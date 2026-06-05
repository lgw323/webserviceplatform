import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PremiumStatsWidget from '../PremiumStatsWidget';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../api/apiClient', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        data: {
          cpu_score: { user: 8500, top_1_percent: 12000 },
          gpu_score: { user: 11000, top_1_percent: 18000 },
          insights: ["NVIDIA RTX 4090"]
        }
      }
    })
  }
}));

describe('PremiumStatsWidget', () => {
  it('should render blurred paywall for free users', () => {
    render(
      <MemoryRouter>
        <PremiumStatsWidget isPremium={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('PRO 요금제 전용 기능')).toBeDefined();
    expect(screen.getByText('지금 업그레이드 하기')).toBeDefined();
  });

  it('should render stats correctly for premium users', async () => {
    render(
      <MemoryRouter>
        <PremiumStatsWidget isPremium={true} />
      </MemoryRouter>
    );

    expect(screen.getByText('💡 PRO 인사이트')).toBeDefined();
    
    // Check if apiClient was called and values are rendered
    const insightText = await screen.findByText('NVIDIA RTX 4090');
    expect(insightText).toBeDefined();
  });
});
