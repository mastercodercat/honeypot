import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

class Host extends Component {

  state = {
    events: Immutable.fromJS({})
  }

  componentWillMount() {
    const { events } = this.props
    const currentHost = this.props.params.host
    let sortedEvents = Immutable.fromJS({})
    events.map(event => {
      const host = event.get('remote_host')
      if (host == currentHost) {
        const service = event.get('service')
        const eventsOfService = sortedEvents.get(service) ? sortedEvents.get(service) : []
        eventsOfService.push(event)
        sortedEvents = sortedEvents.set(service, eventsOfService)
      }
    })
    this.setState({
      events: sortedEvents
    })
  }

  render() {
    const { events } = this.state

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
        text: 'Top Attack Hosts'
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
        <ReactHighcharts config={config} />
      </div>
    )
  }
}

export default Host
