import React, { Component } from 'react'
import hoc from './hoc'

class Home extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        Home
      </div>
    )
  }
}

export default hoc(Home)
