import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import data from './data'

export default combineReducers({
  routing: routerReducer,
  form: formReducer,
  data,
})
