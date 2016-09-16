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
      const host = event.get('remote_host')
      const eventsOfHost = sortedEvents.get(host) ? sortedEvents.get(host) : []
      eventsOfHost.push(event)
      sortedEvents = sortedEvents.set(host, eventsOfHost)
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
        <h3 className="title">Hosts</h3>
        <ReactHighcharts config={config} />
      </div>
    )
  }
}

export default Hosts
