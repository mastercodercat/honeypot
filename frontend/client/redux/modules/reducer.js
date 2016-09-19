import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import events from './events'
import users from './users'

export default combineReducers({
  routing: routerReducer,
  form: formReducer,
  events,
  users,
})
