import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getUsers } from 'redux/modules/users'
import { getNodes, updateNodeOwner, removeNodeOwner, regenerateNodeAPIKey, createNode, deleteNode, clearNodeEvents } from 'redux/modules/nodes'

const mapStateToProps = ({ nodes, users }) => ({
  users: users.get('users'),
  loadedUsers: users.get('loaded'),
  nodes: nodes.get('nodes'),
  loadedNodes: nodes.get('loaded'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  push,
  getUsers,
  getNodes,
  updateNodeOwner,
  removeNodeOwner,
  regenerateNodeAPIKey,
  createNode,
  deleteNode,
  clearNodeEvents,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
