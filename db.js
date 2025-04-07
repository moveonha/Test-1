const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

// 회원 테이블 생성 (한 번만 실행됨)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            phone TEXT,
            email TEXT,
            pw TEXT
        )
    `);
});

module.exports = db;
