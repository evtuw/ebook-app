import {applyMiddleware, combineReducers, createStore} from 'redux';

import thunk from 'redux-thunk';
import {accountActionTypes} from '../actions/type';
import coinInDayReducer from './coinInDayReducer';

const accountReducer = (state = null, action) => {
  switch (action.type) {
    case accountActionTypes.APP_SIGN_IN:
    case accountActionTypes.APP_USER_INFO:
      return action.payload;
    case accountActionTypes.APP_SIGN_OUT:
      return null;
    default:
      return state;
  }
};

const combine = combineReducers({
  accountReducer,
  coinInDayReducer,
});

export const store = createStore(combine, applyMiddleware(thunk));
