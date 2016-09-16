import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getEvents } from 'redux/modules/events'

const mapStateToProps = ({ events }) => ({
  events: events.get('data'),
  loaded: events.get('loaded'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getEvents,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
