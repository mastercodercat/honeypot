import { push } from 'react-router-redux'
import Immutable from 'immutable'
import { SubmissionError } from 'redux-form'

import {
  INIT,
  REDUX_INIT,

  USER_LOGIN,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  username: '',
  email: '',
  admin: '',
})

export default function users(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case USER_LOGIN_SUCCESS:
      return state.withMutations(map => {
        const data = action.result
        map.set('username', data.username)
        map.set('email', data.email)
        map.set('admin', data.type == 1)
      })
    default:
      return state
  }
}

/* Get data */

export function login(username, password) {
  return {
    types: [USER_LOGIN, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL],
    promise: (client) => client.post('/api/login', { data: { username, password } })
  }
}
