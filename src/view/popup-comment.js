import {emojiMock} from '../mock/film-card.js';
import {createElement, generateCountData} from '../utils.js';

const createCommentsMarkup = (commit) => {
  const {id, author, comment, data, emotion} = commit;
  return `<ul class="film-details__comments-list" id="${id}">
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${data}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  </ul>`;
};

const createEmojiMarkup = (emojis) =>
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
    <label class="film-details__emoji-label" for="emoji-angry">
      <img src="./images/emoji/${emojis}.png" width="30" height="30" alt="emoji">
    </label>`;

const createCommentsTemplate = (film) => {
  const {comments} = film;
  const generateFilmsList = () =>  generateCountData(comments.length, createCommentsMarkup, comments);
  const generateEmojiMarkup = () => emojiMock.map((nameEmoji) => createEmojiMarkup(nameEmoji));

  return `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      ${generateFilmsList()}
      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>
        <div class="film-details__emoji-list">
        ${generateEmojiMarkup()}
        </div>
      </div>
    </section>
  </div>`;
};

export default class CommentList {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createCommentsTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element.parentNode.removeChild(this._element);
    }

    this._element = null;
  }
}
