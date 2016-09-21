import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator'

import hoc from './hoc'

class Home extends Component {

  state = {
    events: Immutable.fromJS({})
  }

  formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
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
    const { getNodes } = this.props
    getNodes()
  }

  render() {
    const {
      nodes, loadedNodes,
    } = this.props
    if (!loadedNodes) {
      return (
        <LoadingIndicator />
      )
    }

    const { events } = this.state
    const categories = []
    const data = []
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    for(let i = 0; i < 7; i++) {
      const date = this.formatDate(currentDate)
      const eventsInDay = events.get(date)
      const eventsCount = eventsInDay ? eventsInDay.length : 0
      categories.push(date)
      data.push(eventsCount)
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const config = {
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: categories
      },
      series: [{
        name: 'Events',
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
        <h5 className="m-t-2">Agents activity</h5>
        <div className="m-t-2">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Status</th>
                <th>Last 24h events</th>
                <th>Total events</th>
              </tr>
            </thead>
            <tbody>
              {
                nodes.map((node, i) => (
                  <tr key={i}>
                    <td>{node.get('nodename')}</td>
                    <td className='text-success'>Online</td>
                    <td>{node.get('events_count_today')}</td>
                    <td>{node.get('events_count')}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default hoc(Home)
