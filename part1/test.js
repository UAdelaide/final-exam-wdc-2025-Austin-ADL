const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',         // ← 使用这个 host
      user: 'root',
      password: 'mypassword',
      database: 'DogWalkService'
    });
    console.log('✅ Connected successfully.');
    await connection.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
