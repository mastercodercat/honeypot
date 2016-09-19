import { push } from 'react-router-redux'
import Immutable from 'immutable'
import { SubmissionError } from 'redux-form'

import {
  INIT,
  REDUX_INIT,

  USERS_LOGIN,
  USERS_LOGIN_SUCCESS,
  USERS_LOGIN_FAIL,
  USERS_GET,
  USERS_GET_SUCCESS,
  USERS_GET_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  username: '',
  email: '',
  admin: '',
  users: {},
  loaded: false,
})

export default function users(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case USERS_LOGIN_SUCCESS:
      return state.withMutations(map => {
        const data = action.result
        map.set('username', data.username)
        map.set('email', data.email)
        map.set('admin', data.type == 1)
      })
    case USERS_GET_SUCCESS:
      return state.withMutations(map => {
        const users = action.result
        for(let i = 0; i < users.length; i++) {
          const user = users[i]
          map.setIn(['users', user.id], Immutable.fromJS(user))
        }
        map.set('loaded', true)
      })
    case USERS_GET_FAIL:
      return state.set('loaded', false)
    default:
      return state
  }
}

export function login(username, password) {
  return {
    types: [USERS_LOGIN, USERS_LOGIN_SUCCESS, USERS_LOGIN_FAIL],
    promise: (client) => client.post('/api/login', { data: { username, password } })
  }
}

export function getUsers() {
  return {
    types: [USERS_GET, USERS_GET_SUCCESS, USERS_GET_FAIL],
    promise: (client) => client.get('/api/users')
  }
}
