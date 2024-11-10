import { combineReducers } from '@reduxjs/toolkit';

import fetchReducer from './fetch.store';
import formReducer from './form.store';
import globalReducer from './global.store';
import tagsViewReducer from './tags-view.store';
import userReducer from './user.store';

const rootReducer = combineReducers({
  user: userReducer,
  tagsView: tagsViewReducer,
  global: globalReducer,
  fetch: fetchReducer,
  form: formReducer,
});

export default rootReducer;
