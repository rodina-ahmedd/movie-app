import { useState } from 'react';

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY;
const MODEL = 'gemini-3.8-flash';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiWithRetry(description, attempt = 1) {
  const maxAttempts = 3;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Suggest exactly 5 real, existing movie titles that match this request: "${description}". Respond with ONLY a JSON array of movie titles, nothing else. Example format: ["Title One", "Title Two", "Title Three", "Title Four", "Title Five"]`,
              },
            ],
          },
        ],
      }),
    }
  );

  if (res.status === 503 && attempt < maxAttempts) {
    await delay(attempt * 1500);
    return callGeminiWithRetry(description, attempt + 1);
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    if (res.status === 503) {
      throw new Error('The AI is busy right now. Please try again in a moment.');
    }
    throw new Error(errorBody?.error?.message || 'AI recommendation request failed.');
  }

  return res.json();
}

export function useMovieRecommendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function getRecommendations(description) {
    if (!description.trim()) return;

    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const geminiData = await callGeminiWithRetry(description);
      const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      const cleanedText = rawText.replace(/```json|```/g, '').trim();

      let titles;
      try {
        titles = JSON.parse(cleanedText);
      } catch {
        throw new Error('Could not understand AI response. Please try again.');
      }

      if (!Array.isArray(titles) || titles.length === 0) {
        throw new Error('No recommendations found. Try describing it differently.');
      }

      const movieResults = await Promise.all(
        titles.map(async (title) => {
          try {
            const res = await fetch(
              `https://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${encodeURIComponent(title)}`
            );
            const data = await res.json();
            return data.Response === 'True' ? data : null;
          } catch {
            return null;
          }
        })
      );

      const validMovies = movieResults.filter((m) => m !== null);

      if (validMovies.length === 0) {
        throw new Error('Found suggestions, but could not retrieve their details. Please try again.');
      }

      setRecommendations(validMovies);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return { recommendations, loading, error, getRecommendations };
}