import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UpgradeRecommendationWidget from '../UpgradeRecommendationWidget';

describe('UpgradeRecommendationWidget', () => {
  it('should not render anything if no ad is provided', () => {
    const { container } = render(<UpgradeRecommendationWidget ad={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render ad information correctly when provided', () => {
    const mockAd = {
      type: 'cpu',
      title: 'CPU 병목 주의',
      description: 'CPU 업그레이드가 필요합니다.',
      link: 'https://example.com/cpu',
      imageUrl: '/cpu.png'
    };

    render(<UpgradeRecommendationWidget ad={mockAd} />);
    
    // Check if the title and description are rendered
    expect(screen.getByText('CPU 병목 주의')).toBeDefined();
    expect(screen.getByText('CPU 업그레이드가 필요합니다.')).toBeDefined();
    
    // Check if the link is correct
    const linkElement = screen.getByRole('link');
    expect(linkElement.getAttribute('href')).toBe('https://example.com/cpu');
  });
});
