import React, { Component } from 'react'
import Sidebar from 'components/Sidebar/Sidebar'
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator'

import hoc from './hoc'

export class LayoutContainer extends Component {

  componentWillMount() {
    this.props.getEvents()
  }

  render() {
    const { events, loaded } = this.props
    let children = ''
    if (this.props.children && loaded) {
      children = React.cloneElement(this.props.children, {
        events: events
      })
    }
    return (
      <div>
        <Sidebar />
        {
          loaded ?
          <div className="content">
            {children}
          </div>
          :
          <LoadingIndicator />
        }
      </div>
    )
  }
}

export default hoc(LayoutContainer)
