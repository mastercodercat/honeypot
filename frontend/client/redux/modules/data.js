import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,
  DATA_LOAD,
  DATA_LOAD_SUCCESS,
  DATA_LOAD_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  data: {},
  loaded: false,
})

export default function data(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    default:
      return state
  }
}

/* Get data */

export function getData() {
  return {
    types: [DATA_LOAD, DATA_LOAD_SUCCESS, DATA_LOAD_FAIL],
    promise: (client) => client.get('/api/data')
  }
}
