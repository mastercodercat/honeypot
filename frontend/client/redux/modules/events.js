import { push } from 'react-router-redux'
import Immutable from 'immutable'
import { SubmissionError } from 'redux-form'

import {
  INIT,
  REDUX_INIT,
  DATA_LOAD,
  DATA_LOAD_SUCCESS,
  DATA_LOAD_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  data: [],
  loaded: false,
})

export default function events(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case DATA_LOAD_SUCCESS:
      return state.withMutations(map => {
        map.set('data', Immutable.fromJS(action.result))
        map.set('loaded', true)
      })
    case DATA_LOAD:
    case DATA_LOAD_FAIL:
      return state.withMutations(map => {
        map.set('data', Immutable.fromJS({}))
        map.set('loaded', false)
      })
    default:
      return state
  }
}

/* Get data */

export function getEvents() {
  return {
    types: [DATA_LOAD, DATA_LOAD_SUCCESS, DATA_LOAD_FAIL],
    promise: (client) => client.get('/api/events/')
  }
}
