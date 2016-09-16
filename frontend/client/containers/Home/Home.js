import React, { Component } from 'react'
import hoc from './hoc'

class Home extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h2 className="title">Home</h2>
      </div>
    )
  }
}

export default hoc(Home)
