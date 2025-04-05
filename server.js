const express = require('express');
const cors = require('cors');  // CORS 미들웨어 추가
const app = express();
const fs = require('fs');

// CORS 미들웨어 사용
app.use(cors());  // 모든 도메인에서의 요청을 허용

const port = 3000;

app.get('/user/:userid', (req, res) => {
    console.log(req.params);
    const userId = req.params.userid;
    res.status(200).send(`userId : ${userId}`);
});

app.listen(port, () => {
    console.log("server Start at 3000 port");
});
