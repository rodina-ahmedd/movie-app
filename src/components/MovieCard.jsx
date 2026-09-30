export default function MovieCard({ movie }) {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : null;

  return (
    <div className="movie-card">
      {poster ? (
        <img src={poster} alt={`${movie.Title} poster`} />
      ) : (
        <div className="movie-card-no-poster">No image</div>
      )}
      <h3>{movie.Title}</h3>
      <p>{movie.Year}</p>
    </div>
  );
}