import {emojiMock} from '../mock/film-card.js';
import {generateCountData, getRelativeTimeFromDate} from '../utils/utils.js';
import SmartView from './smart';

const createCommentsMarkup = (infoComment) => {
  const {id, author, comment, date, emotion} = infoComment;
  return `<ul class="film-details__comments-list" id="${id}">
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getRelativeTimeFromDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  </ul>`;
};

const createEmojiMarkup = (emojiName, selectedEmojiName) =>
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiName}" value="${emojiName}" ${selectedEmojiName === emojiName ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emojiName}">
      <img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">
    </label>`;

const createCommentsTemplate = (data) => {
  const {comments, isEmoji, emojiName} = data;
  const generateFilmsList = () =>  generateCountData(comments.length, createCommentsMarkup, comments);
  const generateEmojiMarkup = () => emojiMock.map((nameEmoji) => createEmojiMarkup(nameEmoji, emojiName)).join('');

  return `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      ${generateFilmsList()}
      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">${isEmoji ? `<img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">` : ''}</div>

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

export default class CommentList extends SmartView {
  constructor(film) {
    super();
    this._data = CommentList.parseFilmToData(film);

    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentEmojiChangeHandler = this._commentEmojiChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  static parseFilmToData(film) {
    return { ...film, isEmoji: false, emojiName: null, isCommented: false, commentText: '' };
  }

  static parseDataToFilm(data) {
    data = { ...data };

    if (!data.isEmoji) {
      data.emojiName = '';
    }

    if (!data.isCommented) {
      data.commentText = '';
    }

    delete data.isEmoji;
    delete data.isCommented;

    return data;
  }

  reset(film) {
    this.updateData(CommentList.parseDataToFilm(film));
  }

  getTemplate() {
    return createCommentsTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _commentInputHandler(evt) {
    this.updateData({ ...this._data, commentText: evt.target.value }, true);
  }

  _commentEmojiChangeHandler(evt) {
    evt.preventDefault();
    if (this._data.emojiName === evt.target.value) {
      return;
    }

    if (evt.target.tagName === 'INPUT') {
      this.updateData({
        ...this._data,
        isEmoji: true,
        emojiName: evt.target.value,
        scrollPosition: this.getElement().scrollTop,
      });

      this.getElement().querySelector('.film-details__comment-input').value = this._data.commentText;
      this.getElement().scrollTop = this._data.scrollPosition;
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._commentEmojiChangeHandler);
  }
}
