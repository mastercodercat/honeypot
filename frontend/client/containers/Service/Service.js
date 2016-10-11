import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

import { DateRange, DateRangePicker } from 'components/DateRangePicker/DateRangePicker'
import SessionViewer from 'components/SessionViewer/SessionViewer'

class Service extends Component {

  state = {
    range: new DateRange(),
  }

  calculateData = () => {
    const { events } = this.props
    const currentService = this.props.params.service
    const { range } = this.state
    let sortedEvents = Immutable.fromJS({})
    events.map(event => {
      const service = event.get('service')
      if (service == currentService) {
        const eventDate = new Date(event.get('datetime'))
        if (range.isIn(eventDate)) {
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
    const { range } = this.state
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
          <DateRangePicker
            value={range}
            onChange={range => this.setState({ range })} />
        </div>
        <ReactHighcharts config={config} />
        <SessionViewer
          events={this.props.events}
          range={range}
          service={currentService} />
      </div>
    )
  }
}

export default Service
