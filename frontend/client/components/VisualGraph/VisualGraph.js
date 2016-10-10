import React, { Component } from 'react'
import { Link } from 'react-router'

import { format2Digits } from 'utils/formatter'

class VisualGraph extends Component {

  outputServerNode(className, imageUrl, data, style = {}, index = -1) {
    const url = `/events`
    return (
      <div className={className} style={style} >
        <Link to={url}>
          <div className="node-content">
            <img src={imageUrl} />
            <div className="title">
              Server
            </div>
          </div>
          <div className="node-tooltip">
            <div className="theader">Information</div>
            <div className="tcontent">
              Last 24h events: <span className="event-count">{data.last24hEventsAll}</span><br />
              Total events: {data.totalEvents}
            </div>
          </div>
        </Link>
      </div>
    )
  }

  outputNode(className, imageUrl, node, style = {}, index = -1) {
    const url = `/daily/all/agent/${node.get('nodename')}`
    let status = 'safe'
    if (node.get('events_count_today') > 5) {
      status = 'danger'
    } else if (node.get('events_count_today') > 0) {
      status = 'neutral'
    }
    return (
      <div className={className + ' ' + status} style={style} >
        <Link to={url}>
          <div className="node-content">
            <img src={imageUrl} />
            <div className="title">
              {node ? node.get('nodename') : "Server"}
            </div>
          </div>
          <div className="node-tooltip">
            <div className="theader">Information</div>
            <div className="tcontent">
              Name: {node.get('nodename')}<br />
              Last 24h events: <span className="event-count">{node.get('events_count_today')}</span><br />
              Total events: {node.get('events_count')}
            </div>
          </div>
          <div className="node-status">
            <span className="light"></span>
            <span className="light"></span>
            <span className="light"></span>
          </div>
        </Link>
      </div>
    )
  }

  render() {
    const { nodes } = this.props
    const nodesCount = nodes.size
    let last24hEventsAll = 0
    let totalEvents = 0
    if (!nodesCount) {
      return (
        <div></div>
      )
    }
    const angleDelta = Math.PI * 2 / nodesCount
    const radius = 30
    return (
      <div className="visual-graph-container">
        <div className="inner">
          {
            nodes.map((node, index) => {
              const x = -radius * Math.cos(angleDelta * index)
              const y = -radius * Math.sin(angleDelta * index) / 1.6
              last24hEventsAll += node.get('events_count_today')
              totalEvents += node.get('events_count')
              return (
                <div key={index}>
                  {this.outputNode("node", "/assets/images/agent.png", node, {
                    marginLeft: x + '%',
                    marginTop: y + '%',
                  }, index)}
                </div>
              )
            })
          }
          <div>
            {this.outputServerNode("node server", "/assets/images/server.png", { last24hEventsAll, totalEvents })}
          </div>
        </div>
      </div>
    )
  }

}

export default VisualGraph
