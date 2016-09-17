import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

class Service extends Component {

  state = {
    events: Immutable.fromJS({})
  }

  componentWillMount() {
    const { events } = this.props
    const currentService = this.props.params.service
    let sortedEvents = Immutable.fromJS({})
    events.map(event => {
      const service = event.get('service')
      if (service == currentService) {
        const host = event.get('remote_host')
        const eventsOfHost = sortedEvents.get(host) ? sortedEvents.get(host) : []
        eventsOfHost.push(event)
        sortedEvents = sortedEvents.set(host, eventsOfHost)
      }
    })
    this.setState({
      events: sortedEvents
    })
  }

  render() {
    const { events } = this.state

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
        text: 'Top Attack Service'
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
        <ReactHighcharts config={config} />
      </div>
    )
  }
}

export default Service
