import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useMovieRecommendation } from './useMovieRecommendation';

describe('useMovieRecommendation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns matched movies when Gemini and OMDb both succeed', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            { content: { parts: [{ text: '["Inception"]' }] } },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          Response: 'True',
          Title: 'Inception',
          imdbID: 'tt1375666',
        }),
      });

    const { result } = renderHook(() => useMovieRecommendation());

    await act(async () => {
      await result.current.getRecommendations('a mind-bending movie');
    });

    await waitFor(() => {
      expect(result.current.recommendations).toHaveLength(1);
      expect(result.current.recommendations[0].Title).toBe('Inception');
      expect(result.current.error).toBe('');
    });
  });

  it('sets an error if Gemini returns invalid JSON', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          { content: { parts: [{ text: 'not valid json at all' }] } },
        ],
      }),
    });

    const { result } = renderHook(() => useMovieRecommendation());

    await act(async () => {
      await result.current.getRecommendations('something weird');
    });

    await waitFor(() => {
      expect(result.current.error).toMatch(/could not understand/i);
      expect(result.current.recommendations).toHaveLength(0);
    });
  });

  it('retries on 503 and eventually succeeds', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            { content: { parts: [{ text: '["Up"]' }] } },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          Response: 'True',
          Title: 'Up',
          imdbID: 'tt1049413',
        }),
      });

    const { result } = renderHook(() => useMovieRecommendation());

    await act(async () => {
      await result.current.getRecommendations('a movie about adventure');
    });

    await waitFor(() => {
      expect(result.current.recommendations).toHaveLength(1);
      expect(result.current.recommendations[0].Title).toBe('Up');
    }, { timeout: 5000 });
  });

  it('sets a friendly error after repeated 503s', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useMovieRecommendation());

    await act(async () => {
      await result.current.getRecommendations('anything');
    });

    await waitFor(() => {
      expect(result.current.error).toMatch(/busy right now/i);
    }, { timeout: 5000 });
  });
});