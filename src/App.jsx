import { useState } from 'react';
import { useMovieSearch } from './useMovieSearch';
import MovieCard from './components/MovieCard';
import './App.css';

function App() {
  const [term, setTerm] = useState('');
  const { movies, loading, error, searched, search } = useMovieSearch();

  function handleSubmit(e) {
    e.preventDefault();
    search(term);
  }
  function handleClear() {
    setTerm('');
  }

  return (
    <div className="app">
      <h1>Movie Search</h1>

      <form onSubmit={handleSubmit} className="search-form">
  <input
    type="text"
    value={term}
    onChange={(e) => setTerm(e.target.value)}
    placeholder="Search for a movie..."
    aria-label="Movie title"
  />
  <button type="submit">Search</button>
  {term && (
    <button type="button" onClick={handleClear}>
      Clear
    </button>
  )}
</form>

      {loading && <p role="status">Loading...</p>}

      {!loading && error && <p role="alert">{error}</p>}

      {!loading && !error && searched && movies.length === 0 && (
        <p>No movies found.</p>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default App;