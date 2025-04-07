// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors()); // 모든 도메인 허용
app.use(express.json()); // JSON 요청 파싱

// 회원 가입 처리
app.post('/user', (req, res) => {
    console.log('회원가입 요청 도착:', req.body);
    res.json({ message: '회원가입 성공!', data: req.body });
});

// 유저 ID 조회 예시
app.get('/user/:id', (req, res) => {
    console.log(`유저 ID 요청 도착: ${req.params.id}`);
    res.json({ id: req.params.id, name: '임시유저' });
});

app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
