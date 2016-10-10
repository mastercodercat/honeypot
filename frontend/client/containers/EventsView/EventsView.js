import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator'
import { DateRange, DateRangePicker } from 'components/DateRangePicker/DateRangePicker'
import { format2Digits } from 'utils/formatter'
import hoc from './hoc'

class EventsView extends Component {

  constructor(props) {
    super(props)

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1)
    startDate.setHours(0); startDate.setMinutes(0); startDate.setSeconds(0); startDate.setMilliseconds(0);
    const endDate = new Date(startDate.getTime())
    endDate.setDate(endDate.getDate() + 6)
    this.state = {
      range: new DateRange(startDate, endDate),
      events: Immutable.fromJS({}),
    }
  }

  formatDate(date) {
    return date.getFullYear() + '-' + format2Digits(date.getMonth() + 1) + '-' + format2Digits(date.getDate())
  }

  getIndex(elm) {
    const parent = elm.parentElement
    return Array.prototype.indexOf.call(parent.childNodes, elm)
  }

  handleClickColumn = (e) => {
    if (e.target.tagName != 'rect') {
      return;
    }
    const dateIndex = this.getIndex(e.target)
    const { range } = this.state
    const date = range.start.toDate()
    date.setDate(date.getDate() + dateIndex);
    const nodeIndex = this.getIndex(e.target.parentElement) / 2
    const nodename = this.state.events.keySeq().get(nodeIndex)
    if (nodename) {
      setTimeout(() => {
        this.props.push(`/daily/${this.formatDate(date)}/agent/${nodename}`)
      }, 10)
    }
  }

  calculateGraphData = (range) => {
    // get nodes from api
    this.getNodesInRange(range)

    const { events } = this.props
    // calculate dateToIndexes and defaultArray
    let dateToIndexes = Immutable.fromJS({})
    const _date = range.start.toDate()
    _date.setHours(0); _date.setMinutes(0); _date.setSeconds(0); _date.setMilliseconds(0);
    const endDate = range.end.toDate()
    endDate.setHours(0); endDate.setMinutes(0); endDate.setSeconds(0); endDate.setMilliseconds(0);
    const defaultArray = []
    let i = 0
    while(_date <= endDate) {
      dateToIndexes = dateToIndexes.set(this.formatDate(_date), i)
      _date.setDate(_date.getDate() + 1)
      defaultArray.push(0)
      i++
    }

    // calculate stacked column data
    let sortedEvents = Immutable.fromJS({})
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
      range,
      events: sortedEvents
    })
  }

  getNodesInRange = (range) => {
    const { getNodes } = this.props
    getNodes(
      this.formatDate(range.start.toDate()),
      this.formatDate(range.end.toDate())
    )
  }

  componentWillMount() {
    this.getNodesInRange(this.state.range)
    this.calculateGraphData(this.state.range)
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

    const { events, range } = this.state

    const weekDates = []
    const data = []
    const _date = range.start.toDate()
    _date.setHours(0); _date.setMinutes(0); _date.setSeconds(0); _date.setMilliseconds(0);
    const endDate = range.end.toDate()
    endDate.setHours(0); endDate.setMinutes(0); endDate.setSeconds(0); endDate.setMilliseconds(0);
    while(_date <= endDate) {
      const date = this.formatDate(_date)
      weekDates.push(date)
      _date.setDate(_date.getDate() + 1)
    }

    events.map((nodeData, key) => {
      data.push({
        name: key,
        data: nodeData,
        events: {
          click: this.handleClickColumn
        }
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
        categories: weekDates,
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
              textShadow: '0 0 3px black',
            },
            formatter: function() {
              if (this.y != 0) {
                return this.y;
              } else {
                return null;
              }
            },
          },
        }
      },
      series: data,
    }
    return (
      <div>
        <h3 className="title">Events View</h3>
        <div className="m-t-2 m-b-2">
          <DateRangePicker
            customOnly
            value={range}
            onChange={range => this.calculateGraphData(range)} />
        </div>
        <ReactHighcharts config={config} />
        <h5 className="m-t-2">Agents activity</h5>
        <div className="m-t-2">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Status</th>
                <th>Last 24h events</th>
                <th>Events in the selected range</th>
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
                    <td>{node.get('events_count_period')}</td>
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

export default hoc(EventsView)
