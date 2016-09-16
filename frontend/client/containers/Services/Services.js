import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

class Hosts extends Component {

  state = {
    events: Immutable.fromJS({})
  }

  componentWillMount() {
    const { events } = this.props
    let sortedEvents = Immutable.fromJS({})
    events.map(event => {
      const service = event.get('service')
      const eventsOfService = sortedEvents.get(service) ? sortedEvents.get(service) : []
      eventsOfService.push(event)
      sortedEvents = sortedEvents.set(service, eventsOfService)
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
        text: 'Top Attacked Services'
      },
      tooltip: {
        pointFormat: 'Attacks: <b>{point.y}</b>'
      },
      series: [{
        name: 'Top Attack Hosts',
        data: data
      }],
    }
    return (
      <div>
        <h3 className="title">Hosts</h3>
        <ReactHighcharts config={config} />
      </div>
    )
  }
}

export default Hosts
