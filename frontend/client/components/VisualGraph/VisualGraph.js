import React, { Component } from 'react'
import { Link } from 'react-router'

import { format2Digits } from 'utils/formatter'

class VisualGraph extends Component {

  formatDate(date) {
    return date.getFullYear() + '-' + format2Digits(date.getMonth() + 1) + '-' + format2Digits(date.getDate())
  }

  outputNode(className, imageUrl, node = null, style = {}, index = -1) {
    let url = ''
    const date = new Date()
    if (node) {
      url = `/daily/${this.formatDate(date)}/agent/${node.get('nodename')}`
    } else {
      url = `/events`
    }
    return (
      <div className={className} style={style} >
        <Link to={url}>
          <img src={imageUrl} />
          <div className="title">
            {node ? node.get('nodename') : "Server"}
          </div>
          {
            node ?
            <div className="node-tooltip">
              <div className="theader">Information</div>
              <div className="tcontent">
                Name: {node.get('nodename')}<br />
                Last 24h events: {node.get('events_count_today')}<br />
                Total events: {node.get('events_count')}
              </div>
            </div>
            :
            ''
          }
        </Link>
      </div>
    )
  }

  render() {
    const { nodes } = this.props
    const nodesCount = nodes.size
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
          {this.outputNode("node server", "/assets/images/server.png")}
          {
            nodes.map((node, index) => {
              const x = -radius * Math.cos(angleDelta * index)
              const y = -radius * Math.sin(angleDelta * index) / 1.6
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
        </div>
      </div>
    )
  }

}

export default VisualGraph
