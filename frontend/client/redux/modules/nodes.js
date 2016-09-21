import { push } from 'react-router-redux'
import Immutable from 'immutable'
import { SubmissionError } from 'redux-form'

import {
  INIT,
  REDUX_INIT,

  NODES_GET,
  NODES_GET_SUCCESS,
  NODES_GET_FAIL,

  NODES_CREATE,
  NODES_CREATE_SUCCESS,
  NODES_CREATE_FAIL,

  NODES_UPDATE,
  NODES_UPDATE_SUCCESS,
  NODES_UPDATE_FAIL,

  NODES_REGEN_API,
  NODES_REGEN_API_SUCCESS,
  NODES_REGEN_API_FAIL,
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
        action.result.forEach(node => {
          map.setIn(['nodes', node.id], Immutable.fromJS(node))
        })
        map.set('loaded', true)
      })
    case NODES_GET:
    case NODES_GET_FAIL:
      return state.withMutations(map => {
        map.set('nodes', Immutable.fromJS({}))
        map.set('loaded', false)
      })
    case NODES_REGEN_API_SUCCESS:
      const { api_key } = action.result
      console.log(api_key, action.data.id)
      return state.setIn(['nodes', action.data.id, 'api_key'], api_key)
    case NODES_CREATE_SUCCESS:
      {
        const node = action.result
        return state.setIn(['nodes', node.id], Immutable.fromJS(node))
      }
    default:
      return state
  }
}

export function getNodes() {
  return {
    types: [NODES_GET, NODES_GET_SUCCESS, NODES_GET_FAIL],
    promise: (client) => client.get('/api/nodes/')
  }
}

export function createNode(nodename, owner) {
  return {
    types: [NODES_CREATE, NODES_CREATE_SUCCESS, NODES_CREATE_FAIL],
    promise: (client) => client.post('/api/nodes/', { data: { nodename, owner } })
  }
}

export function updateNodeOwner(id, owner) {
  return {
    types: [NODES_UPDATE, NODES_UPDATE_SUCCESS, NODES_UPDATE_FAIL],
    promise: (client) => client.put('/api/nodes/', { data: { id, owner } })
  }
}

export function regenerateNodeAPIKey(id) {
  return {
    types: [NODES_REGEN_API, NODES_REGEN_API_SUCCESS, NODES_REGEN_API_FAIL],
    promise: (client) => client.post(`/api/nodes/${id}/regenapi/`),
    data: {
      id
    }
  }
}
