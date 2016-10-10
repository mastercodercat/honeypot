import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'
import { DateRange, DateRangePicker } from 'components/DateRangePicker/DateRangePicker'

import { format2Digits } from 'utils/formatter'

import hoc from './hoc'

/*
 * Component for Attacks View and Daily View
 */

class DailyActivity extends Component {

  constructor(props) {
    super(props)

    let range = new DateRange()
    const currentDate = this.props.params.date
    if (currentDate != 'all') {
      const _date = new Date(currentDate)
      const _dateStart = new Date(currentDate)
      _dateStart.setHours(0)
      _dateStart.setMinutes(0)
      _dateStart.setSeconds(0)
      _dateStart.setMilliseconds(0)
      range = new DateRange(_dateStart, _date)
    }
    this.state = {
      countByHost: Immutable.fromJS({}),
      countbyService: Immutable.fromJS({}),
      agents: Immutable.fromJS({}),
      range,
    }
  }

  formatDate(date) {
    return date.getFullYear() + '-' + format2Digits(date.getMonth() + 1) + '-' + format2Digits(date.getDate())
  }

  updatedState = (agents) => {
    const { events } = this.props
    // const agents = _agents ? _agents : this.state.agents
    const { range } = this.state
    let byHost = Immutable.fromJS({})
    let byService = Immutable.fromJS({})
    events.map(event => {
      const date = new Date(this.formatDate(new Date(event.get('datetime'))))
      if (range.isIn(date) && agents.get(event.get('nodename'))) {
        const host = event.get('remote_host')
        let hd = byHost.get(host)
        hd = hd ? hd : []
        hd.push(event)
        byHost = byHost.set(host, hd)
        const service = event.get('service')
        let sd = byService.get(service)
        sd = sd ? sd : []
        sd.push(event)
        byService = byService.set(service, sd)
      }
    })
    const countByHost = [],
          countbyService = []
    byHost.map((bh, k) => {
      countByHost.push({
        name: k,
        y: bh.length
      })
    })
    byService.map((bs, k) => {
      countbyService.push({
        name: k,
        y: bs.length
      })
    })
    return {
      countByHost,
      countbyService,
    }
  }

  getClickedIndex(elm) {
    const parent = elm.parentElement
    const index = Array.prototype.indexOf.call(parent.childNodes, elm)
    return index
  }

  handleHostClick = (e) => {
    const index = this.getClickedIndex(e.target)
    const { countByHost } = this.state
    const host = countByHost[index].name
    if (host) {
      setTimeout(() => {
        this.props.push(`/hosts/${host}`)
      }, 500)
    }
  }

  handleServiceClick = (e) => {
    const index = this.getClickedIndex(e.target)
    const { countbyService } = this.state
    const service = countbyService[index].name
    if (service) {
      setTimeout(() => {
        this.props.push(`/services/${service}`)
      }, 500)
    }
  }

  handleAgentOptionClick = (e, k) => {
    let _agents = this.state.agents
    const pv = _agents.get(k)
    _agents = _agents.set(k, !pv)
    const _state = this.updatedState(_agents)
    _state.agents = _agents
    this.setState(_state)
  }

  handleSeeAllAgentsClick = () => {
    let agents = this.state.agents
    agents = agents.withMutations(map => {
      agents.map((v, k) => {
        map.set(k, true)
      })
    })
    this.setState({
      agents
    })
    this.setState(this.updatedState(agents))
    setTimeout(() => {
      const currentDate = this.props.params.date
      this.props.push(`/daily/${currentDate}`)
    }, 10)
  }

  handleRangeChange = (range) => {
    const { agents } = this.state
    this.setState({
      range
    })
    setTimeout(() => {
      this.setState(this.updatedState(agents))
    }, 10)
  }

  componentWillMount() {
    const { events } = this.props
    const currentAgent = this.props.params.agent
    const { range } = this.state
    let agents = Immutable.fromJS({})
    events.map(event => {
      const date = new Date(this.formatDate(new Date(event.get('datetime'))))
      if (range.isIn(date)) {
        if (!currentAgent || currentAgent == event.get('nodename')) {
          agents = agents.set(event.get('nodename'), true)
        } else {
          agents = agents.set(event.get('nodename'), false)
        }
      }
    })
    this.setState({
      agents
    })
    this.setState(this.updatedState(agents))
  }

  render() {
    const { countByHost, countbyService, agents } = this.state
    const currentAgent = this.props.params.agent
    const configHosts = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Total Attacking Hosts'
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
        name: 'Hosts',
        data: countByHost,
        events: {
          click: this.handleHostClick
        }
      }],
    }
    const configServices = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Attacked Services'
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
        name: 'Services',
        data: countbyService,
        events: {
          click: this.handleServiceClick
        }
      }],
    }
    return (
      <div>
        <h3 className="title">
          Attacks View
        </h3>
        {
          this.props.params.date == 'all' ?
          <div className="m-b-3">
            <DateRangePicker
              value={this.state.range}
              onChange={this.handleRangeChange} />
          </div>
          :
          ''
        }
        {
          currentAgent ?
          <h5 className="m-b-3">Agent: {currentAgent}</h5>
          :
          ''
        }
        <div className="row">
          <div className="col-md-6">
            <ReactHighcharts config={configHosts} />
          </div>
          <div className="col-md-6">
            <ReactHighcharts config={configServices} />
          </div>
        </div>
        {
          currentAgent ?
          <button
            className="btn btn-primary m-t-2"
            onClick={this.handleSeeAllAgentsClick}>
            See all agents
          </button>
          :
          <div className="m-t-2">
            <h4 className="m-t-2 m-b-1">Agents</h4>
            {
              agents.map((value, k) => (
                <div className="form-check" key={k}>
                  <label className="form-check-label">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={value}
                      onChange={this.handleAgentOptionClick.bind(this, event, k)} />
                    {k}
                  </label>
                </div>
              ))
            }
          </div>
        }
      </div>
    )
  }
}

export default hoc(DailyActivity)
