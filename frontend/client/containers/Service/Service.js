import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

class Service extends Component {

  state = {
    period: 1,
  }

  calculateData = () => {
    const { events } = this.props
    const currentService = this.props.params.service
    const { period } = this.state
    const currentHost = this.props.params.host
    const date = new Date()
    date.setHours(date.getHours() - period)
    let sortedEvents = Immutable.fromJS({})
    events.map(event => {
      const service = event.get('service')
      if (service == currentService) {
        const eventDate = new Date(event.get('datetime'))
        if (eventDate >= date) {
          const host = event.get('remote_host')
          const eventsOfHost = sortedEvents.get(host) ? sortedEvents.get(host) : []
          eventsOfHost.push(event)
          sortedEvents = sortedEvents.set(host, eventsOfHost)
        }
      }
    })
    return sortedEvents
  }

  render() {
    const events = this.calculateData()
    const { period } = this.state
    const currentService = this.props.params.service

    const data = []
    events.map((eventsOfHost, key) => {
      data.push({
        name: key,
        y: eventsOfHost.length
      })
    })

    const config = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Activity on the service: ' + currentService
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
        name: 'Top Attack Service',
        data: data
      }],
    }
    return (
      <div>
        <h3 className="title">Service</h3>
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
      </div>
    )
  }
}

export default Service
