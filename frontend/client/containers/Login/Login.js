import React, { Component } from 'react'

import hoc from './hoc'

class Login extends Component {

  handleLogin = (e) => {
    e.preventDefault()
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
          <form onSubmit={this.handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" className="form-control" id="username" placeholder="Username" ref="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" className="form-control" id="password" placeholder="Password" ref="password" />
            </div>
            <div className="text-xs-center">
              <input type="submit" className="btn btn-primary" value="Login" />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default hoc(Login)
