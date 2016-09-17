import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

import hoc from './hoc'

class Hosts extends Component {

  state = {
    events: Immutable.fromJS({})
  }

  onClickPie = (e) => {
    const elm = e.target
    const parent = e.target.parentElement
    const index = Array.prototype.indexOf.call(parent.childNodes, elm)
    let i = 0
    let nodename = ''
    const { events } = this.state
    events.every((eventsOfHost, key) => {
      if (i == index) {
        nodename = key
        return false
      }
      i++
      return true
    })
    if (nodename) {
      this.props.push(`/hosts/${nodename}`)
    }
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
        type: 'pie',
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
        },
      },
      series: [{
        name: 'Top Attack Hosts',
        data: data,
        events: {
          click: this.onClickPie
        }
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

export default hoc(Hosts)
