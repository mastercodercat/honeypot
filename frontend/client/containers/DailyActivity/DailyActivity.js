import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

class DailyActivity extends Component {

  state = {
    countByHost: Immutable.fromJS({}),
    countbyService: Immutable.fromJS({}),
    agents: Immutable.fromJS({}),
  }

  formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }

  updatedState = (agents) => {
    const { events } = this.props
    // const agents = _agents ? _agents : this.state.agents
    const currentDate = this.props.params.date
    let byHost = Immutable.fromJS({})
    let byService = Immutable.fromJS({})
    events.map(event => {
      const date = this.formatDate(new Date(event.get('datetime')))
      if (date == currentDate && agents.get(event.get('nodename'))) {
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
      countbyService
    }
  }

  componentWillMount() {
    const { events } = this.props
    const currentDate = this.props.params.date
    let agents = Immutable.fromJS({})
    events.map(event => {
      const date = this.formatDate(new Date(event.get('datetime')))
      if (date == currentDate) {
        agents = agents.set(event.get('nodename'), true)
      }
    })
    this.setState({
      agents
    })
    this.setState(this.updatedState(agents))
  }

  render() {
    const { countByHost, countbyService, agents } = this.state
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
        data: countByHost
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
        data: countbyService
      }],
    }
    return (
      <div>
        <h3 className="title">Daily Activity</h3>
        <div className="row">
          <div className="col-md-6">
            <ReactHighcharts config={configHosts} />
          </div>
          <div className="col-md-6">
            <ReactHighcharts config={configServices} />
          </div>
        </div>
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
                    onChange={e => {
                      let _agents = this.state.agents
                      const pv = _agents.get(k)
                      _agents = _agents.set(k, !pv)
                      const _state = this.updatedState(_agents)
                      _state.agents = _agents
                      this.setState(_state)
                    }} />
                  {k}
                </label>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default DailyActivity
