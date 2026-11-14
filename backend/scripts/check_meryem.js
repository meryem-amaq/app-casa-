const mysql = require('../node_modules/mysql2/promise');
require('../node_modules/dotenv').config({ path: './backend/.env' });

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ids_cgs'
    });
    const [rows] = await conn.query("SELECT id, nom_incube, linkedin, site_web FROM incubes WHERE nom_incube LIKE '%AMAQRAN%'");
    console.log(rows);
    await conn.end();
  } catch(e) {
    console.error(e.message);
  }
})();

