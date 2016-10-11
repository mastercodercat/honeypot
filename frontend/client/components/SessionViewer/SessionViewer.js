import React, { Component, PropTypes as T } from 'react'
import Immutable from 'immutable'

class SessionViewer extends Component {

  static propTypes = {
    events: T.object,
    range: T.object,
    host: T.string,
    service: T.string,
  }

  toDoubleDigits(n) {
    return n < 10 ? ('0' + n) : n
  }

  formatDate(date) {
    return date.getFullYear() + '-' + this.toDoubleDigits(date.getMonth() + 1) + '-' + this.toDoubleDigits(date.getDate())
  }

  calculateData = () => {
    const { events, range } = this.props
    const currentHost = this.props.hosts
    const currentService = this.props.service
    let psSortedEvents = Immutable.fromJS({})
    events.map(event => {
      const host = event.get('remote_host')
      const service = event.get('service')
      if (
        (!currentHost ||  host == currentHost) &&
        (!currentService || service == currentService)
      ) {
        const eventDate = new Date(event.get('datetime'))
        if (!range || range.isIn(eventDate)) {
          // Sort by protocol
          const protocol = event.get('protocol')
          let _events = psSortedEvents.get(protocol, Immutable.fromJS({}))
          // Sort by service
          let _eventsByService = _events.get(service, Immutable.fromJS({}))
          // Sort by session
          const session = event.get('session').substr(0, 10)
          let _eventsBySession = _eventsByService.get(session, [])
          _eventsBySession.push(event)
          // Mix up
          _eventsByService = _eventsByService.set(session, _eventsBySession)
          _events = _events.set(service, _eventsByService)
          psSortedEvents = psSortedEvents.set(protocol, _events)
        }
      }
    })
    return psSortedEvents
  }

  render() {
    const psSortedEvents = this.calculateData()
    return (
      <div className="m-t-3 host-data clearfix">
        <div className="events">
          {
            psSortedEvents.map((protocolEvents, protocol) => (
              <div key={protocol}>
                <div className="protocol">{protocol}</div>
                {
                  protocolEvents.map((serviceEvents, service) => (
                    <div className="service-sessions" key={service}>
                      <div className="service" onClick={e => {
                          const container = e.currentTarget.parentNode
                          if (container.classList.contains('open')) {
                            container.classList.remove('open')
                          } else {
                            container.classList.add('open')
                          }
                        }}>
                        <i className="closed-icon fa fa-caret-right" />
                        <i className="opened-icon fa fa-caret-down" />
                        &nbsp;
                        {service}
                      </div>
                      <div className="sessions">
                        {
                          serviceEvents.map((_eventsBySession, session) => {
                            const date = new Date(_eventsBySession[0].get('datetime'))
                            return (
                              <div key={session} className="session" onClick={e => {
                                  let content = `
                                    <h4 className="m-b-2">
                                      ${protocol} > ${service} > ${session}
                                    </h4>
                                  `
                                  _eventsBySession.sort((ev1, ev2) => {
                                    const dt1 = ev1.get('datetime')
                                    const dt2 = ev2.get('datetime')
                                    if (dt1 == dt2) {
                                      return 0;
                                    } else {
                                      return dt1 > dt2 ? 1 : -1;
                                    }
                                  }).map((event, i) => (
                                    content += `
                                      <div>
                                        ${this.formatDate(new Date(event.get('datetime')))} ${event.get('event')}
                                      </div>
                                    `
                                  ))
                                  this.refs.eventData.innerHTML = content
                                }}>
                                {this.formatDate(date)} {session}
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
        <div className="event-data" ref="eventData">
        </div>
      </div>
    )
  }

}

export default SessionViewer
