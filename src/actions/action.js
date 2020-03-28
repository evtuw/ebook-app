import {accountActionTypes} from './type';

export const setCoinInDay = data => ({
  type: accountActionTypes.SET_NEW_COIN,
  payload: data,
});
