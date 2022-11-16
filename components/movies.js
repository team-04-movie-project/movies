import { CONTAINER, BACKDROP_BASE_URL } from '../utils/constants.js';
import constructUrl from '../utils/urls.js';
import renderMovie from './single-movie.js';

const fetchGenreName = async (genreId) => {
  const url = constructUrl('genre/movie/list');
  const res = await fetch(url);
  const data = await res.json();
  return data.genres.find((genre) => genre.id === genreId).name;
};

const renderMovies = (movies) => {
  movies.map(async (movie) => {
    const genreName = movie.genre_ids.map(
      async (genreId) => fetchGenreName(genreId),
    );
    const genreNames = await Promise.all(genreName);

    const movieContainer = document.createElement('div');
    movieContainer.classList.add(
      'movie',
      'flex',
      'flex-col',
      'justify-center',
      'items-center',
      'max-w-xs',
      'rounded',
      'overflow-hidden',
      'bg-neutral-200',
      'cursor-pointer',
      'transition',
      'duration-500',
      'ease-in-out',
      'transform',
      'dark:bg-neutral-700',
      'dark:hover:bg-neutral-600',
      'hover:shadow-2xl',
      'hover:bg-neutral-400',
      'hover:-translate-y-1',
      'hover:scale-110',
    );
    movieContainer.innerHTML = `
      <img src="${BACKDROP_BASE_URL + movie.backdrop_path}"
        alt="${movie.title} poster" width="780" height="439">

      <h3 class="movie-title my-2 text-lg font-bold">
        ${movie.title}
      </h3>

      <p class="genre-names text-sm">
        Genres: ${genreNames.join(', ')}
      </p>

      <p class="movie-rating text-sm pb-4">
        Average vote: ${movie.vote_average}
      </p>

      <p class="description hidden absolute bottom-0 p-4 text-sm tracking-wide
          text-center bg-neutral-200 dark:bg-neutral-700 animate-fade-in-down">
        ${movie.overview}
      </p>
      `;
    movieContainer.addEventListener('click', () => {
      const filterBy = document.querySelector('.filterBy');
      filterBy.remove();
      renderMovie(movie.id);
    });

    movieContainer.addEventListener('mouseover', () => {
      const description = movieContainer.querySelector('.description');
      description.classList.remove('hidden');
    });

    movieContainer.addEventListener('mouseout', () => {
      const description = movieContainer.querySelector('.description');
      description.classList.add('hidden');
    });

    CONTAINER.appendChild(movieContainer);
  });
};

export default renderMovies;
