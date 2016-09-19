import React, { Component } from 'react'

import hoc from './hoc'

class Login extends Component {

  handleLogin = () => {
    this.props.login(
      this.refs.username.value,
      this.refs.password.value
    )
    .then(() => {
      this.props.push('/')
    })
  }

  render() {
    return (
      <div className="login-page">
        <div className="card card-block">
          <h3 className="title text-xs-center">Login</h3>
          <div className="form-group">
            <label for="username">Example label</label>
            <input type="text" className="form-control" id="username" placeholder="Username" ref="username" />
          </div>
          <div className="form-group">
            <label for="password">Another label</label>
            <input type="password" className="form-control" id="password" placeholder="Password" ref="password" />
          </div>
          <div className="text-xs-center">
            <input type="button" className="btn btn-primary" value="Login" onClick={this.handleLogin} />
          </div>
        </div>
      </div>
    )
  }
}

export default hoc(Login)
