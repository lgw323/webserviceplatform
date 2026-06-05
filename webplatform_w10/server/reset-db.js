import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 상위 디렉토리의 .env 파일을 불러옴
dotenv.config({ path: path.join(__dirname, '.env') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ ERROR: DATABASE_URL environment variable is missing.");
  console.error("Please ensure your .env file contains the DATABASE_URL of your Vercel Neon DB.");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function resetDatabase() {
  console.log(`🔌 Connecting to Remote Neon DB...`);
  const client = await pool.connect();

  try {
    console.log("⚠️ WARNING: Dropping existing tables (CASCADE)...");
    
    // 외래 키 종속성을 무시하고 삭제하기 위해 CASCADE 옵션 사용
    // 여러 쿼리일지라도 드롭 명령은 단순하므로 개별 쿼리로 순차 실행합니다.
    await client.query("DROP TABLE IF EXISTS optimization_profiles CASCADE;");
    await client.query("DROP TABLE IF EXISTS hardware_profiles CASCADE;");
    await client.query("DROP TABLE IF EXISTS games CASCADE;");
    await client.query("DROP TABLE IF EXISTS users CASCADE;");

    console.log("✅ All tables dropped successfully.");
    console.log("🔄 The next time you start the server (or when Vercel restarts), db.js will automatically recreate all tables with the pristine schema.");
    
  } catch (err) {
    console.error("❌ Error dropping tables:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase();
