import React, { Component } from 'react'
import hoc from './hoc'

export class LayoutContainer extends Component {

  render() {
    const { children } = this.props
    return (
      <div>
        {children}
      </div>
    )
  }
}

export default hoc(LayoutContainer)
