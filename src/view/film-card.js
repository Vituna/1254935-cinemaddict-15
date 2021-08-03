const createFilmCardTemplate = (films) => {
  const commentLeang = films.comments.length;

  return `<article class="film-card" id = "${films.id}">
    <h3 class="film-card__title">${films.filmInfo.title}</h3>
    <p class="film-card__rating">${films.filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year"></span>
      <span class="film-card__duration">${films.filmInfo.runtime}</span>
      <span class="film-card__genre">${films.filmInfo.genre}</span>
    </p>
    <img src="./images/posters/${films.filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${films.filmInfo.description}</p>
    <a class="film-card__comments">${commentLeang}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export {createFilmCardTemplate};
