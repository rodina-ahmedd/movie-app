import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App title search', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows results after searching by title', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        Response: 'True',
        Search: [
          {
            Title: 'Batman Begins',
            Year: '2005',
            imdbID: 'tt0372784',
            Poster: 'N/A',
          },
        ],
      }),
    });

    render(<App />);
    await userEvent.type(screen.getByLabelText(/movie title/i), 'Batman');
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }));

    expect(await screen.findByText('Batman Begins')).toBeInTheDocument();
  });

  it('shows a readable error when OMDb finds nothing', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ Response: 'False', Error: 'Movie not found!' }),
    });

    render(<App />);
    await userEvent.type(screen.getByLabelText(/movie title/i), 'zzzz');
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Movie not found!'
    );
  });
});