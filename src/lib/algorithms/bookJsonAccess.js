import * as booksData from '../assets/books/books.json' with { type: 'json' };

/**
 * 
 * @param {number} bookId 
 * @param {number} pageId 
 * @returns {string}
 */
function _getPageStory(bookId, pageId) {
  return _getPageStoryJson(bookId, pageId);
}

/**
 * 
 * @param {number} bookId 
 * @param {number} pageId 
 * @returns {{ toPage: number; name: string; }[]}
 */
function _getPageOptions(bookId, pageId) {
  return _getPageOptionsJson(bookId, pageId);
}

/**
 * 
 * @param {number} bookId 
 * @param {number} pageId 
 * @returns {string}
 */
export function _getPageStoryJson(bookId, pageId) {
  const page = _getPageJson(bookId, pageId);
  return page?.story ?? `This part of the story ${Math.random() < 0.5 ? 'went missing' : 'got burned up'}.`;
}

/**
 * 
 * @param {number} bookId 
 * @param {number} pageId 
 * @returns {string}
 */
export function _getPageTypeJson(bookId, pageId) {
  const page = _getPageJson(bookId, pageId);
  return page?.type ?? 'page';
}

/**
 * 
 * @param {number} bookId 
 * @param {number} pageId 
 * @returns {{ toPage: number; type:string, name: string; }[]}
 */
export function _getPageOptionsJson(bookId, pageId) {
  const page = _getPageJson(bookId, pageId);
  return page?.options ?? [
    {toPage:0, type: 'page', name: 'Go back'},
  ];
}

/**
 * 
 * @param {number} bookId 
 * @returns 
 */
function _getBookMetadataJson(bookId) {
  const book = _getBookJson(bookId);
  const metadata = book?.metadata;
  return metadata ?? null;
}

/**
 * 
 * @returns 
 */
function _getBooksArrayJson() {
  return booksData?.books;
}

/**
 * 
 * @returns 
 */
function _getBookRoutesJson() {
  const bookIndexes = _toIndexes(_getBooksArrayJson());
  const introductionBook = _getIntroductionBookJson();
  return bookIndexes.filter((_, i) => i !== introductionBook);
}

/**
 * 
 * @returns 
 */
function _getIntroductionBookJson() {
  return booksData?.introduction_book;
}

/**
 * 
 * @param {number} bookId 
 * @returns 
 */
function _getBookJson(bookId) {
  const booksArray = _getBooksArrayJson();
  const book = booksArray[bookId];
  return book;
}

/**
 * 
 * @param {number} bookId 
 * @returns 
 */
function _getPagesArrayJson(bookId) {
  const book = _getBookJson(bookId);
  return book?.pages ?? null;
}

/**
 * 
 * @param {number} bookId 
 * @param {number} pageId 
 * @returns 
 */
function _getPageJson(bookId, pageId) {
  const book = _getBookJson(bookId);
  const page = book?.pages[pageId];
  return page ?? null;
}

/**
 * 
 * @param {any[]} array 
 * @returns {string[]}
 */
function _toIndexes(array) {
  return array.map((e,i)=>`/${i}`);
}
