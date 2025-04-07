const express = require('express');
const router = express.Router();
const fs = require('fs');
const Joi = require('joi');

const filePath = 'userData.txt';

// ✅ Joi 스키마 정의
const userSchema = Joi.object({
    userID: Joi.string().alphanum().min(4).required()
        .messages({
            'string.base': 'userID는 문자열이어야 합니다.',
            'string.alphanum': 'userID는 영문자와 숫자만 가능합니다.',
            'string.min': 'userID는 최소 4자 이상이어야 합니다.',
            'any.required': 'userID는 필수 항목입니다.'
        }),
    name: Joi.string().required().messages({
        'string.base': 'name은 문자열이어야 합니다.',
        'any.required': 'name은 필수 항목입니다.'
    }),
    age: Joi.number().integer().min(0).max(130).required()
        .messages({
            'number.base': 'age는 숫자여야 합니다.',
            'number.integer': 'age는 정수여야 합니다.',
            'number.min': 'age는 0 이상이어야 합니다.',
            'number.max': 'age는 130 이하이어야 합니다.',
            'any.required': 'age는 필수 항목입니다.'
        })
});

const patchSchema = Joi.object({
    name: Joi.string().messages({
        'string.base': 'name은 문자열이어야 합니다.'
    }),
    age: Joi.number().integer().min(0).max(130)
        .messages({
            'number.base': 'age는 숫자여야 합니다.',
            'number.integer': 'age는 정수여야 합니다.',
            'number.min': 'age는 0 이상이어야 합니다.',
            'number.max': 'age는 130 이하이어야 합니다.'
        })
}).or('name', 'age').messages({
    'object.missing': '최소한 하나 이상의 항목(name 또는 age)을 수정해야 합니다.'
});

// ✅ [GET] userID로 검색
router.get('/:userId', (req, res) => {
    const userID = req.params.userId;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: '파일 읽기 실패' });

        const lines = data.trim().split('\n');
        const line = lines.find(line => line.startsWith(`userID:${userID},`));

        if (!line) {
            return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
        }

        const userData = Object.fromEntries(line.split(',').map(pair => {
            const [key, value] = pair.split(':');
            return [key.trim(), value.trim()];
        }));

        return res.status(200).json(userData);
    });
});

// ✅ [PATCH] 사용자 수정
router.patch('/:userId', (req, res) => {
    const userID = req.params.userId;

    const { error, value } = patchSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: '파일 읽기 실패' });

        let lines = data.trim().split('\n');
        let found = false;

        const updatedLines = lines.map(line => {
            if (line.startsWith(`userID:${userID},`)) {
                found = true;
                const parts = Object.fromEntries(line.split(',').map(pair => {
                    const [k, v] = pair.split(':');
                    return [k, v];
                }));
                const newUser = { ...parts, ...value };
                return Object.entries(newUser).map(([k, v]) => `${k}:${v}`).join(',');
            }
            return line;
        });

        if (!found) {
            return res.status(404).json({ message: '수정할 사용자 정보를 찾을 수 없습니다.' });
        }

        fs.writeFile(filePath, updatedLines.join('\n'), 'utf8', err => {
            if (err) return res.status(500).json({ error: '파일 쓰기 실패' });
            return res.status(200).json({ userID, ...value });
        });
    });
});

// ✅ [POST] 사용자 등록
router.post('/', (req, res) => {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { userID, name, age } = value;

    fs.readFile(filePath, 'utf8', (err, data = '') => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: '파일 읽기 실패' });
        }

        const lines = data.trim().split('\n');
        const exists = lines.find(line => line.startsWith(`userID:${userID},`));

        if (exists) {
            return res.status(409).json({ message: '이미 존재하는 userID입니다.' });
        }

        const newLine = `userID:${userID},name:${name},age:${age}`;
        fs.appendFile(filePath, newLine + '\n', err => {
            if (err) return res.status(500).json({ error: '파일 쓰기 실패' });
            return res.status(201).json({ message: '사용자 등록 완료', user: value });
        });
    });
});

module.exports = router;
