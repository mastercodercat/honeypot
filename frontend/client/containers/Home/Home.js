import React, { Component } from 'react'
import Immutable from 'immutable'

import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator'
import VisualGraph from 'components/VisualGraph/VisualGraph'
import hoc from './hoc'

class Home extends Component {

  componentWillMount() {
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
    return (
      <div>
        <h3 className="title">Home</h3>
        <VisualGraph nodes={nodes.valueSeq()} />
      </div>
    )
  }
}

export default hoc(Home)
