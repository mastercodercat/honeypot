import React, { Component } from 'react'

class VisualGraph extends Component {

  outputNode(className, imageUrl, node = null, style = {}, index = -1) {
    return (
      <div className={className} style={style} >
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
