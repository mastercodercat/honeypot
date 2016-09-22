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
    // calculate dateToIndexes
    let dateToIndexes = Immutable.fromJS({})
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1)
    startDate.setHours(0); startDate.setMinutes(0); startDate.setSeconds(0); startDate.setMilliseconds(0);
    for(let i = 0; i < 7; i++) {
      dateToIndexes = dateToIndexes.set(this.formatDate(startDate), i)
      startDate.setDate(startDate.getDate() + 1)
    }
    // calculate stacked column data
    let sortedEvents = Immutable.fromJS({})
    const defaultArray = [0, 0, 0, 0, 0, 0, 0]
    const tmpdt = new Date();
    tmpdt.setDate(tmpdt.getDate() - tmpdt.getDay() + 1)
    events.map(event => {
      const date = this.formatDate(new Date(event.get('datetime')))
      const i = dateToIndexes.get(date)
      if (i || i === 0) {
        const nm = event.get('nodename')
        const data = sortedEvents.get(nm) ? sortedEvents.get(nm) : defaultArray.slice()
        data[i] += 1;
        sortedEvents = sortedEvents.set(nm, data)
      }
    })
    this.setState({
      events: sortedEvents
    })
    // get nodes data
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
    const weekDates = []
    const data = []
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    for(let i = 0; i < 7; i++) {
      const date = this.formatDate(currentDate)
      weekDates.push(date)
      currentDate.setDate(currentDate.getDate() + 1);
    }
    events.map((nodeData, key) => {
      data.push({
        name: key,
        data: nodeData
      })
    })

    const config = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Honeypot Activity'
      },
      xAxis: {
        categories: weekDates
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor: 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        pointFormat: '{series.name}: {point.y}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            color: 'white',
            style: {
              textShadow: '0 0 3px black'
            }
          }
        }
      },
      series: data,
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
                nodes.valueSeq().map((node, i) => (
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
