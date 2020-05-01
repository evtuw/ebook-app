export const HOST = 'http://192.168.0.108:80/api/';
export const HOST_IMAGE_UPLOAD = 'http://192.168.0.108:80/storage/';
// export const HOST = 'http://192.168.1.246:80/api/';
// export const HOST_IMAGE_UPLOAD = 'http://192.168.1.246:80/storage/';
// export const HOST = 'http://104.197.230.169:80/api/'; // public
// export const HOST_IMAGE_UPLOAD = 'http://104.197.230.169:80/storage/'; // public
export const API = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  INFO: 'details',
  INFO_USER: 'detail/user',
  INFO_PROFILE: 'detail_user',
  UPDATE_PROFILE: 'user/update_profile',
  UPDATE_PASSWORD: 'change_password',
  FORGOT_PASSWORD: 'reset-password',
  RESET_PASSWORD: 'reset-password',
  APP_DETAIL: 'app_details',
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
  DELETE_COMMENT: 'community/comment_delete',
  BOOK_BY_AUTHOR: 'books/list_by_author',
  BOOK_BY_CATEGORY: 'books/list_by_cat',
  LIST_AUDIO: 'audio/list',

  BOOK_FAVORITE: 'book/favorite',
  BOOK_RECENT: 'book/recent',
  ADD_TO_FAVORITE: 'book/add_favorite',
  ADD_TO_RECENT: 'book/add_recent',
  ADD_STORE: 'store/add',
  LIST_STORE: 'store/list',
  LIST_DETAIL_STORE: 'store/detail_store',
  LIST_STORE_BOOK: 'store/list_book',
  ADD_STORE_BOOK: 'store/add_book',
  GET_DETAIL_STORE: 'store/get_detail',
  GET_OTHER_STORE: 'store/get_other_store',
  UPDATE_EXPIRED: 'store/update_expired',
};

export function getApiUrl(api) {
  if (api) {
    return HOST + api;
  } else console.warn('apiURL is empty');
}
