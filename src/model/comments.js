import AbstractObserver from '../utils/abstract-observer.js';

export default class Comments extends AbstractObserver {
  constructor() {
    super();

    this._comments = [];
  }

  setComments(comments) {
    if (comments === null) {
      this._comments = comments;
      return;
    }
    this._comments = [...comments];
  }

  getComments() {
    return this._comments;
  }

  addComment(update) {
    this._comments = [...this._comments, update];

  }
}
