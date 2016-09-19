import { push } from 'react-router-redux'
import Immutable from 'immutable'
import { SubmissionError } from 'redux-form'

import {
  INIT,
  REDUX_INIT,

  NODES_GET,
  NODES_GET_SUCCESS,
  NODES_GET_FAIL,

  NODES_UPDATE,
  NODES_UPDATE_SUCCESS,
  NODES_UPDATE_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  nodes: {},
  loaded: false,
})

export default function nodes(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case NODES_GET_SUCCESS:
      return state.withMutations(map => {
        map.set('nodes', Immutable.fromJS(action.result))
        map.set('loaded', true)
      })
    case NODES_GET_FAIL:
      return state.set('loaded', false)
    default:
      return state
  }
}

export function getNodes() {
  return {
    types: [NODES_GET, NODES_GET_SUCCESS, NODES_GET_FAIL],
    promise: (client) => client.get('/api/nodes')
  }
}

export function updateNodeOwner(id, owner) {
  return {
    types: [NODES_UPDATE, NODES_UPDATE_SUCCESS, NODES_UPDATE_FAIL],
    promise: (client) => client.post('/api/nodes', { data: { id, owner } })
  }
}
