import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import Immutable from 'immutable'

class DailyActivity extends Component {

  state = {
    countByHost: Immutable.fromJS({}),
    countByPort: Immutable.fromJS({}),
    agents: Immutable.fromJS({}),
  }

  formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }

  updateState = (_agents) => {
    const { events } = this.props
    const agents = _agents ? _agents : this.state.agents
    const currentDate = this.props.params.date
    let byHost = Immutable.fromJS({})
    let byPort = Immutable.fromJS({})
    events.map(event => {
      const date = this.formatDate(new Date(event.get('datetime')))
      if (date == currentDate && agents.get(event.get('nodename'))) {
        const host = event.get('remote_host')
        let hd = byHost.get(host)
        hd = hd ? hd : []
        hd.push(event)
        byHost = byHost.set(host, hd)
        const port = event.get('remote_port')
        let pd = byPort.get(port)
        pd = pd ? pd : []
        pd.push(event)
        byPort = byPort.set(port, pd)
      }
    })
    const countByHost = [],
          countByPort = []
    byHost.map((bh, k) => {
      countByHost.push({
        name: k,
        y: bh.length
      })
    })
    byPort.map((bp, k) => {
      countByPort.push({
        name: k,
        y: bp.length
      })
    })
    this.setState({
      countByHost,
      countByPort
    })
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
    this.updateState(agents)
  }

  render() {
    const { countByHost, countByPort } = this.state
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
    const configPorts = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Total Attacking Ports'
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
        name: 'Ports',
        data: countByPort
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
            <ReactHighcharts config={configPorts} />
          </div>
        </div>
      </div>
    )
  }
}

export default DailyActivity
