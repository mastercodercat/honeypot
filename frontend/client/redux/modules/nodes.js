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

  NODES_REMOVE_OWNER,
  NODES_REMOVE_OWNER_SUCCESS,
  NODES_REMOVE_OWNER_FAIL,

  NODES_DELETE,
  NODES_DELETE_SUCCESS,
  NODES_DELETE_FAIL,

  NODES_REGEN_API,
  NODES_REGEN_API_SUCCESS,
  NODES_REGEN_API_FAIL,

  NODES_CLEAR_EVENTS,
  NODES_CLEAR_EVENTS_SUCCESS,
  NODES_CLEAR_EVENTS_FAIL,
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
      return state.setIn(['nodes', action.data.id, 'api_key'], api_key)
    case NODES_CREATE_SUCCESS:
      {
        const node = action.result
        return state.setIn(['nodes', node.id], Immutable.fromJS(node))
      }
    case NODES_DELETE_SUCCESS:
      {
        const id = action.data.id
        return state.deleteIn(['nodes', id])
      }
    case NODES_UPDATE_SUCCESS:
      {
        const { id, owner_id } = action.data
        const owners = state.getIn(['nodes', id, 'owners'], Immutable.fromJS([])).toJS()
        if (owners.indexOf(owner_id) == -1) {
          owners.push(owner_id)
          return state.setIn(['nodes', id, 'owners'], Immutable.fromJS(owners))
        }
        return state
      }
    case NODES_REMOVE_OWNER_SUCCESS:
      {
        const { id, owner_id } = action.data
        const owners = state.getIn(['nodes', id, 'owners'], Immutable.fromJS([])).toJS()
        const index = owners.indexOf(owner_id)
        if (index >= 0) {
          owners.splice(index, 1)
          return state.setIn(['nodes', id, 'owners'], Immutable.fromJS(owners))
        }
        return state
      }
    default:
      return state
  }
}

export function getNodes(startDate, endDate) {
  let url = '/api/nodes/', param = ''
  if (startDate) {
    param += `start=${startDate}`
  }
  if (endDate) {
    if (param) {
      param += '&'
    }
    param += `end=${endDate}`
  }
  if (param) {
    url += ('?' + param)
  }
  return {
    types: [NODES_GET, NODES_GET_SUCCESS, NODES_GET_FAIL],
    promise: (client) => client.get(url)
  }
}

export function createNode(nodename) {
  return {
    types: [NODES_CREATE, NODES_CREATE_SUCCESS, NODES_CREATE_FAIL],
    promise: (client) => client.post('/api/nodes/', { data: { nodename } })
  }
}

export function updateNodeOwner(id, owner) {
  const owner_id = parseInt(owner)
  return {
    types: [NODES_UPDATE, NODES_UPDATE_SUCCESS, NODES_UPDATE_FAIL],
    promise: (client) => client.put('/api/nodes/', { data: { id, owner_id, remove: 0 } }),
    data: {
      id,
      owner_id,
    },
  }
}

export function removeNodeOwner(id, owner) {
  const owner_id = parseInt(owner)
  return {
    types: [NODES_REMOVE_OWNER, NODES_REMOVE_OWNER_SUCCESS, NODES_REMOVE_OWNER_FAIL],
    promise: (client) => client.put('/api/nodes/', { data: { id, owner_id, remove: 1 } }),
    data: {
      id,
      owner_id,
    },
  }
}

export function deleteNode(id) {
  return {
    types: [NODES_DELETE, NODES_DELETE_SUCCESS, NODES_DELETE_FAIL],
    promise: (client) => client.del('/api/nodes/', { data: { id } }),
    data: {
      id
    }
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

export function clearNodeEvents(id) {
  return {
    types: [NODES_CLEAR_EVENTS, NODES_CLEAR_EVENTS_SUCCESS, NODES_CLEAR_EVENTS_FAIL],
    promise: (client) => client.del(`/api/nodes/${id}/clearevents/`, { data: { id } })
  }
}
