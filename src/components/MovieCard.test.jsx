import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MovieCard from './MovieCard';

describe('MovieCard', () => {
  it('shows the title, year, and poster with alt text', () => {
    const movie = {
      Title: 'Inception',
      Year: '2010',
      Poster: 'https://example.com/poster.jpg',
    };

    render(<MovieCard movie={movie} />);

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByAltText('Inception poster')).toBeInTheDocument();
  });

  it('shows a fallback when the poster is N/A', () => {
    const movie = { Title: 'Unknown Film', Year: '1999', Poster: 'N/A' };

    render(<MovieCard movie={movie} />);

    expect(screen.getByText('No image')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});