import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory, Router, Route, IndexRedirect, Redirect } from 'react-router'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import LayoutContainer from './containers/LayoutContainer/LayoutContainer'
import Login from './containers/Login/Login'
import Home from './containers/Home/Home'
import Hosts from './containers/Hosts/Hosts'
import Host from './containers/Host/Host'
import Services from './containers/Services/Services'
import Service from './containers/Service/Service'

class Routes extends Component {

  componentWillMount() {
    this.history = syncHistoryWithStore(hashHistory, this.props.store)
  }

  requireAuth = (nextState, replace) => {
    const userState = this.props.users
    if (!userState.get('username')) {
      replace({ pathname: '/login' })
    }
  }

  requireAdmin = (nextState, replace) => {
    const userState = this.props.users
    if (!userState.get('username') || !userState.get('admin')) {
      replace({ pathname: '/login' })
    }
  }

  render() {
    return (
      <Router history={this.history}>
        <Route path="/">
          <IndexRedirect to="/home" />
          <Route path="login" component={Login} />

          <Route component={LayoutContainer} onEnter={this.requireAuth}>
            <Route path="home" component={Home} />
            <Route path="hosts" component={Hosts} />
            <Route path="hosts/:host" component={Host} />
            <Route path="services" component={Services} />
            <Route path="services/:service" component={Service} />
          </Route>

        </Route>
      </Router>
    )
  }
}

export default connect(
  store => ({
    users: store.users
  }),
  null
)(Routes)
