import { useState } from 'react';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export function useMovieSearch() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function search(term) {
    if (!term.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(term)}`
      );
      const data = await res.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || 'No results found.');
      }
    } catch (err) {
      setMovies([]);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return { movies, loading, error, searched, search };
}