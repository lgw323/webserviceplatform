/**
 * Unit Test Script for SYNCRIG Core Matching Engine
 * Command to run: node testCases.js
 */

import { calculateSimilarity } from '../webplatform_w9/matchingEngine.js';

const testCases = [
  {
    name: '동일 하드웨어 사양 매칭 점수 1.0 검증',
    user: { cpu_model: 'AMD Ryzen 7 7800X3D', gpu_model: 'NVIDIA GeForce RTX 4070 SUPER', ram_gb: 32, resolution: 'QHD' },
    db: { cpu_model: 'AMD Ryzen 7 7800X3D', gpu_model: 'NVIDIA GeForce RTX 4070 SUPER', ram_gb: 32, resolution: 'QHD' },
    expectedMin: 1.0,
    expectedMax: 1.0
  },
  {
    name: '미세 하드웨어 차이 (RAM 용량 차이) 유사도 점수 0.9 이상 검증',
    user: { cpu_model: 'AMD Ryzen 7 7800X3D', gpu_model: 'NVIDIA GeForce RTX 4070 SUPER', ram_gb: 32, resolution: 'QHD' },
    db: { cpu_model: 'AMD Ryzen 7 7800X3D', gpu_model: 'NVIDIA GeForce RTX 4070 SUPER', ram_gb: 16, resolution: 'QHD' },
    expectedMin: 0.9,
    expectedMax: 0.99
  },
  {
    name: '완전히 상이한 하드웨어 사양 (RTX 4090 vs RTX 3060) 유사도 0.8 이하 검증',
    user: { cpu_model: 'Intel Core i9-14900K', gpu_model: 'NVIDIA GeForce RTX 4090', ram_gb: 64, resolution: '4K' },
    db: { cpu_model: 'AMD Ryzen 5 5600X', gpu_model: 'NVIDIA GeForce RTX 3060', ram_gb: 16, resolution: 'FHD' },
    expectedMin: 0.0,
    expectedMax: 0.8
  }
];

function runTests() {
  console.log('==================================================');
  console.log('[SYNCRIG TEST RUNNER] Starting core algorithm tests...');
  console.log('==================================================');

  let passedCount = 0;

  testCases.forEach((tc, idx) => {
    const score = calculateSimilarity(tc.user, tc.db);
    const passed = score >= tc.expectedMin && score <= tc.expectedMax;
    
    if (passed) {
      console.log(`[PASS] CASE #${idx + 1}: ${tc.name}`);
      console.log(`       Calculated Similarity: ${score}`);
      passedCount++;
    } else {
      console.error(`[FAIL] CASE #${idx + 1}: ${tc.name}`);
      console.error(`       Expected Range: [${tc.expectedMin} - ${tc.expectedMax}], Got: ${score}`);
    }
  });

  console.log('==================================================');
  console.log(`[TEST SUMMARY] Total: ${testCases.length} | Passed: ${passedCount} | Failed: ${testCases.length - passedCount}`);
  console.log('==================================================');
  
  if (passedCount === testCases.length) {
    console.log('모든 핵심 매칭 알고리즘 단위 테스트를 정상 통과하였습니다.');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Execute tests if run directly
runTests();
