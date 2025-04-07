// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db.js'); // DB 연결
const app = express();
const PORT = 3000;

app.use(cors()); // 모든 도메인 허용
app.use(express.json()); // JSON 요청 파싱

// 회원 가입 처리
app.post('/user', (req, res) => {
    const { id, name, phone, email, pw } = req.body;
    const query = `
        INSERT INTO users (id, name, phone, email, pw)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [id, name, phone, email, pw], function (err) {
        if (err) {
            console.error('DB 저장 에러:', err.message);
            return res.status(500).json({ message: 'DB 저장 실패', error: err.message });
        }
        res.json({ message: '회원가입 성공!', userId: id });
    });
});

// 유저 ID 조회 예시
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error('조회 실패:', err.message);
            return res.status(500).json({ message: '조회 실패' });
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ message: '유저를 찾을 수 없음' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
