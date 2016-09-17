import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

import hoc from './hoc'

class Services extends Component {

  state = {
    events: Immutable.fromJS({})
  }

  onClickPie = (e) => {
    const elm = e.target
    const parent = e.target.parentElement
    const index = Array.prototype.indexOf.call(parent.childNodes, elm)
    let i = 0
    let service = ''
    const { events } = this.state
    events.every((eventsOfHost, key) => {
      if (i == index) {
        service = key
        return false
      }
      i++
      return true
    })
    if (service) {
      setTimeout(() => {
        this.props.push(`/services/${service}`)
      }, 500)
    }
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
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
        }
      },
      series: [{
        name: 'Top Attack Services',
        data: data,
        events: {
          click: this.onClickPie
        }
      }],
    }
    return (
      <div>
        <h3 className="title">Services</h3>
        <ReactHighcharts config={config} />
      </div>
    )
  }
}

export default hoc(Services)
