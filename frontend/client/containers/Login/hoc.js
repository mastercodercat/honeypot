import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { login } from 'redux/modules/users'

const mapStateToProps = ({ users }) => ({
  
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  push,
  login,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
