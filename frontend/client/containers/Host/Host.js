import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

class Host extends Component {

  state = {
    period: 1,
    selectedEvent: null
  }

  toDoubleDigits(n) {
    return n < 10 ? ('0' + n) : n
  }

  formatDate(date) {
    return date.getFullYear() + '-' + this.toDoubleDigits(date.getMonth() + 1) + '-' + this.toDoubleDigits(date.getDate())
  }

  calculateData = () => {
    const { events } = this.props
    const currentHost = this.props.params.host
    const { period } = this.state
    const date = new Date()
    date.setHours(date.getHours() - period)
    let sortedEvents = Immutable.fromJS({})
    let psSortedEvents = Immutable.fromJS({})
    events.map(event => {
      const host = event.get('remote_host')
      if (host == currentHost) {
        const eventDate = new Date(event.get('datetime'))
        if (eventDate >= date) {
          const service = event.get('service')
          const eventsOfService = sortedEvents.get(service) ? sortedEvents.get(service) : []
          eventsOfService.push(event)
          sortedEvents = sortedEvents.set(service, eventsOfService)
          // Sort by protocol
          const protocol = event.get('protocol')
          let _events = psSortedEvents.get(protocol)
          _events = _events ? _events : Immutable.fromJS({})
          let _eventsByService = _events.get(service)
          _eventsByService = _eventsByService ? _eventsByService : []
          // _eventsByService = _eventsByService.set(service, event)
          _eventsByService.push(event)
          _events = _events.set(service, _eventsByService)
          psSortedEvents = psSortedEvents.set(protocol, _events)
        }
      }
    })
    console.log(psSortedEvents.toJS())
    return { events: sortedEvents, psSortedEvents }
  }

  render() {
    const { period, selectedEvent } = this.state
    const { events, psSortedEvents } = this.calculateData()
    const currentHost = this.props.params.host

    const data = []
    events.map((eventsOfService, key) => {
      data.push({
        name: key,
        y: eventsOfService.length
      })
    })

    const config = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Activity from host: ' + currentHost
      },
      tooltip: {
        pointFormat: 'Attacks: <b>{point.y}</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
        }
      },
      series: [{
        name: 'Top Attack Hosts',
        data: data
      }],
    }
    return (
      <div>
        <h3 className="title">Host</h3>
        <div className="m-t-3 m-b-2">
          <label>Period:</label>
          <select
            className="form-control"
            style={{ width: 300 }}
            value={period}
            onChange={e => this.setState({ period: e.currentTarget.value })}>
            <option value={1}>Last one hour</option>
            <option value={24}>Last one day</option>
            <option value={168}>Last one week</option>
            <option value={168 * 30}>Last 30 days</option>
            <option value={168 * 180}>Last 6 months</option>
          </select>
        </div>
        <ReactHighcharts config={config} />
        <div className="m-t-3">
          <div>
            Lookup tools:
            <a
              className="lookup-link"
              href={`https://www.dshield.org/ipinfo.html?ip=${currentHost}`}
              target="_blank">DShield</a>
            <a 
              className="lookup-link"
              href={`https://www.firyx.com/whois?ip=${currentHost}`}
              target="_blank">Firyx</a>
            <a
              className="lookup-link"
              href={`https://twitter.com/search?f=tweets&q=${currentHost}&src=typd`}
              target="_blank">Twitter</a>
            <a
              className="lookup-link"
              href={`https://www.google.hu/?gfe_rd=cr&ei=SOzoV-zrEuav8wf65464Dg#q=${currentHost}`}
              target="_blank">Google</a>
            <a
              className="lookup-link"
              href={`https://www.virustotal.com/en/ip-address/${currentHost}/information/`}
              target="_blank">Virus Total</a>
            <a
              className="lookup-link"
              href={`https://www.spamhaus.org/query/ip/${currentHost}`}
              target="_blank">Spamhaus</a>
            <a
              className="lookup-link"
              href={`https://www.spamcop.net/w3m?action=checkblock&ip=${currentHost}`}
              target="_blank">Spamcop</a>
            <a
              className="lookup-link"
              href={`https://www.senderbase.org/lookup/?search_string=${currentHost}`}
              target="_blank">Senderbase</a>
          </div>
        </div>
        <div className="m-t-3 host-data clearfix">
          <div className="events">
            {
              psSortedEvents.map((protocolEvents, protocol) => (
                <div key={protocol}>
                  <div className="protocol">{protocol}</div>
                  {
                    protocolEvents.map((serviceEvents, service) => (
                      <div key={service}>
                        <div className="service">{service}</div>
                        <div className="sessions">
                          {
                            serviceEvents.map((event, i) => {
                              const date = new Date(event.get('datetime'))
                              return (
                                <div key={i} className="session" onClick={e => {
                                    content = `
                                      <h4 className="m-b-2">
                                        ${event.get('protocol')} > ${event.get('service')} > ${event.get('session')}
                                      </h4>
                                      ${event.get('data')}
                                    `
                                    this.refs.eventData.innerHTML = content
                                  }}>
                                  {this.formatDate(date)} {event.get('session')}
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
      </div>
    )
  }
}

export default Host
