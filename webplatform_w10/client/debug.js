import fs from 'fs';
import os from 'os';

console.log("===============================================");
console.log("🚀 [SYNCRIG VERCEL DEBUGGER] STARTING INSPECTION");
console.log("===============================================");

console.log("\n[1] SYSTEM ENVIRONMENT INFO");
console.log("- OS Platform:", os.platform());
console.log("- OS Arch:", os.arch());
console.log("- Node version:", process.version);
console.log("- Current Directory (CWD):", process.cwd());
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- NPM_CONFIG_PRODUCTION:", process.env.NPM_CONFIG_PRODUCTION);

console.log("\n[2] ROLLUP DIRECTORY INSPECTION");
const checkDirs = [
  './node_modules/@rollup',
  '../node_modules/@rollup',
  './node_modules/rollup',
  '../node_modules/rollup'
];

checkDirs.forEach(dir => {
  try {
    if (fs.existsSync(dir)) {
      console.log(`✅ FOUND: ${dir}`);
      console.log(`   Contents: ${fs.readdirSync(dir).join(', ')}`);
    } else {
      console.log(`❌ NOT FOUND: ${dir}`);
    }
  } catch (e) {
    console.log(`⚠️ ERROR checking ${dir}: ${e.message}`);
  }
});

console.log("\n[3] PACKAGE-LOCK.JSON INSPECTION");
try {
  if (fs.existsSync('../package-lock.json')) {
    console.log("✅ FOUND: ../package-lock.json");
    // Check if the linux binary is mentioned in the packages flat map
    const lockfile = JSON.parse(fs.readFileSync('../package-lock.json', 'utf8'));
    const linuxPkg = "node_modules/@rollup/rollup-linux-x64-gnu";
    
    if (lockfile.packages && lockfile.packages[linuxPkg]) {
      console.log(`   - Linux binary IS listed in packages tree.`);
    } else {
      console.log(`   - 🚨 Linux binary IS MISSING from packages tree! This prevents npm from downloading it.`);
    }
  } else {
    console.log("❌ NOT FOUND: ../package-lock.json");
  }
} catch (e) {
  console.log(`⚠️ ERROR reading lockfile: ${e.message}`);
}

console.log("===============================================");
console.log("🏁 [SYNCRIG VERCEL DEBUGGER] INSPECTION COMPLETED");
console.log("===============================================\n");
