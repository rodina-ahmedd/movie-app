import { useState } from 'react';
import { useMovieSearch } from './useMovieSearch';
import { useMovieRecommendation } from './useMovieRecommendation';
import MovieCard from './components/MovieCard';
import './App.css';

function App() {
  const [term, setTerm] = useState('');
  const [description, setDescription] = useState('');
  const { movies, loading, error, searched, search } = useMovieSearch();
  const {
    recommendations,
    loading: aiLoading,
    error: aiError,
    getRecommendations,
  } = useMovieRecommendation();

  function handleSubmit(e) {
    e.preventDefault();
    search(term);
  }

  function handleClear() {
    setTerm('');
  }

  function handleAiSubmit(e) {
    e.preventDefault();
    getRecommendations(description);
  }

  return (
    <div className="app">
      <h1>Movie Search</h1>

      <section className="ai-section">
        <h2>Describe what you want to watch</h2>
        <form onSubmit={handleAiSubmit} className="search-form">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. a feel-good movie for a rainy day"
            aria-label="Describe the kind of movie you want"
          />
          <button type="submit">Get Suggestions</button>
        </form>

        {aiLoading && <p role="status">Finding suggestions...</p>}
        {!aiLoading && aiError && <p role="alert">{aiError}</p>}

        {recommendations.length > 0 && (
          <div className="movie-grid">
            {recommendations.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <hr />

      <section>
        <h2>Or search by title</h2>
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
      </section>
    </div>
  );
}

export default App;