export const HOST = 'http://192.168.1.246:80/api/';
// export const HOST = 'http://104.197.230.169:80/api/'; // public
export const HOST_IMAGE_UPLOAD = 'http://192.168.1.246:80/storage/';
// export const HOST_IMAGE_UPLOAD = 'http://104.197.230.169:80/storage/'; // public
export const API = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  INFO: 'details',
  INFO_USER: 'detail/user',
  REGISTER: 'register',
  HOME: 'home',
  LATEST: 'latest',
  CATEGORY_BOOK_LIST: 'books/list_by_cat',
  AUTHOR_BOOK_LIST: 'books/list_by_author',
  FEATURED: 'featured',
  POPULAR: 'popular',
  CATEGORY: 'category/list',
  AUTHOR: 'authors/list',
  BOOK_DETAIL: 'books/detail',
  SEARCH_BOOK: 'books/list',
  POST_COMMENT: 'books/comment',
  LIST_COMMENT: 'books/comment_list',
  LIST_CARD: 'cards',
  CARD_UPDATE: 'cards/update_status',
  UPDATE_COIN: 'users/coin',
  ADD_POST: 'community/post',
  ADD_COMMENT: 'community/comment',
  LIST_POST: 'community/list_post',
  LIST_COMMENT_POST: 'community/list_comment',
  DETAIL_POST: 'community/detail_post',
  UPLOAD_IMAGE: 'multi_upload',
};

export function getApiUrl(api) {
  if (api) {
    return HOST + api;
  } else console.warn('apiURL is empty');
}
