import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getUserConfig, updateUserConfig } from 'redux/modules/users'

const mapStateToProps = ({ users }) => ({
  loaded: users.get('loadedConfig'),
  email: users.get('email'),
  threshold: users.get('threshold'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  push,
  getUserConfig,
  updateUserConfig,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
