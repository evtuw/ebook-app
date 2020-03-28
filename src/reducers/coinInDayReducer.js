import {accountActionTypes} from '../actions/type';

export default function(state = 0, action) {
  switch (action.type) {
    case accountActionTypes.SET_NEW_COIN:
      return action.payload;
    default:
      return state;
  }
}
