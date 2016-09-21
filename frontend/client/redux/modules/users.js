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
  USERS_CONFIG_GET,
  USERS_CONFIG_GET_SUCCESS,
  USERS_CONFIG_GET_FAIL,
  USERS_CONFIG_UPDATE,
  USERS_CONFIG_UPDATE_SUCCESS,
  USERS_CONFIG_UPDATE_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  users: {},
  loaded: false,
  email: '',
  threshold: 0,
  loadedConfig: false,
})

export default function users(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case USERS_GET_SUCCESS:
      return state.withMutations(map => {
        const users = action.result
        for(let i = 0; i < users.length; i++) {
          const user = users[i]
          map.setIn(['users', user.id], Immutable.fromJS(user))
        }
        map.set('loaded', true)
      })
    case USERS_GET:
    case USERS_GET_FAIL:
      return state.withMutations(map => {
        map.set('users', Immutable.fromJS({}))
        map.set('loaded', false)
      })
    case USERS_CONFIG_GET_SUCCESS:
      const data = action.result
      return state.withMutations(map => {
        map.set('email', data.result === false ? '' : data.email)
        map.set('threshold', data.result === false ? '' : data.threshold)
        map.set('loadedConfig', true)
      })
    case USERS_CONFIG_GET_FAIL:
      return state.set('loadedConfig', false)
    default:
      return state
  }
}

export function login(username, password) {
  return {
    types: [USERS_LOGIN, USERS_LOGIN_SUCCESS, USERS_LOGIN_FAIL],
    promise: (client) => client.post('/api/login/', { data: { username, password } })
  }
}

export function getUsers() {
  return {
    types: [USERS_GET, USERS_GET_SUCCESS, USERS_GET_FAIL],
    promise: (client) => client.get('/api/users/')
  }
}

export function getUserConfig() {
  return {
    types: [USERS_CONFIG_GET, USERS_CONFIG_GET_SUCCESS, USERS_CONFIG_GET_FAIL],
    promise: (client) => client.get('/api/userconfig/')
  }
}

export function updateUserConfig(data) {
  return {
    types: [USERS_CONFIG_UPDATE, USERS_CONFIG_UPDATE_SUCCESS, USERS_CONFIG_UPDATE_FAIL],
    promise: (client) => client.post('/api/userconfig/', { data })
  }
}
