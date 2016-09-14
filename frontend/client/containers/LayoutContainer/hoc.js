import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = ({ employees }) => ({

})

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
