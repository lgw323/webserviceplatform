import { describe, it, expect } from 'vitest';
import { detectBottleneck } from '../detectBottleneck.js';

describe('detectBottleneck', () => {
  it('should detect CPU bottleneck when GPU is high-end and CPU is low-end', () => {
    const hardware = {
      cpu: 'i3-10100', // Low end
      gpu: 'RTX 4090', // High end
      ram: '32GB'
    };
    
    // In our mock logic, we'll assign scores to determine bottleneck
    const result = detectBottleneck(hardware);
    expect(result.component).toBe('cpu');
    expect(result.reason).toContain('병목');
  });

  it('should detect GPU bottleneck when CPU is high-end and GPU is low-end', () => {
    const hardware = {
      cpu: 'i9-13900K', // High end
      gpu: 'GTX 1050', // Low end
      ram: '32GB'
    };
    
    const result = detectBottleneck(hardware);
    expect(result.component).toBe('gpu');
  });

  it('should return null or balanced if components are balanced', () => {
    const hardware = {
      cpu: 'i5-13600K',
      gpu: 'RTX 3060',
      ram: '16GB'
    };
    
    const result = detectBottleneck(hardware);
    expect(result.component).toBe('none');
  });
});
