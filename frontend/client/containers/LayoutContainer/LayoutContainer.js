import React, { Component } from 'react'
import Sidebar from 'components/Sidebar/Sidebar'

import hoc from './hoc'

export class LayoutContainer extends Component {

  render() {
    const { children } = this.props
    return (
      <div>
        <Sidebar />
        <div className="content">
          {children}
        </div>
      </div>
    )
  }
}

export default hoc(LayoutContainer)
