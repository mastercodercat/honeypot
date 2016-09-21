import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getUsers } from 'redux/modules/users'
import { getNodes } from 'redux/modules/nodes'

const mapStateToProps = ({ nodes }) => ({
  nodes: nodes.get('nodes'),
  loadedNodes: nodes.get('loaded'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  push,
  getNodes,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
