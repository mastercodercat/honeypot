import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

import hoc from './hoc'

class Home extends Component {

  state = {
    events: Immutable.fromJS({})
  }

  componentWillMount() {
    const { events } = this.props
    let sortedEvents = Immutable.fromJS({})
    events.map(event => {
      const date = this.formatDate(new Date(event.get('datetime')))
      const arrayInDay = sortedEvents.get(date) ? sortedEvents.get(date) : []
      arrayInDay.push(event)
      sortedEvents = sortedEvents.set(date, arrayInDay)
    })
    this.setState({
      events: sortedEvents
    })
  }

  formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }

  render() {
    const { events } = this.state

    const categories = []
    const data = []
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 8);
    for(let i = 0; i < 7; i++) {
      const date = this.formatDate(currentDate)
      const eventsInDay = events.get(date)
      const eventsCount = eventsInDay ? eventsInDay.length : 0
      categories.push(date)
      data.push(eventsCount)
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const config = {
      xAxis: {
        categories: categories
      },
      series: [{
        data: data
      }],
      title: {
        text: 'Honeypot Activity'
      },
    }
    return (
      <div>
        <h3 className="title">Home</h3>
        <ReactHighcharts config={config} />
      </div>
    )
  }
}

export default hoc(Home)
