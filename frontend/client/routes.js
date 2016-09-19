import React from 'react'
import { Route, IndexRedirect } from 'react-router'

import LayoutContainer from './containers/LayoutContainer/LayoutContainer'
import Login from './containers/Login/Login'
import Home from './containers/Home/Home'
import Hosts from './containers/Hosts/Hosts'
import Host from './containers/Host/Host'
import Services from './containers/Services/Services'
import Service from './containers/Service/Service'
import Nodes from './containers/Nodes/Nodes'

const requireAuth = (nextState, replace) => {
  // const userState = this.props.users
  // if (!userState.get('username')) {
  //   replace({ pathname: '/login' })
  // }
}

const requireAdmin = (nextState, replace) => {
  // const userState = this.props.users
  // if (!userState.get('username') || !userState.get('admin')) {
  //   replace({ pathname: '/login' })
  // }
}

const routes = () => {
  return (
    <Route path="/">
      <IndexRedirect to="/home" />
      <Route path="login" component={Login} />

      <Route component={LayoutContainer} onEnter={requireAuth}>
        <Route path="home" component={Home} />
        <Route path="hosts" component={Hosts} />
        <Route path="hosts/:host" component={Host} />
        <Route path="services" component={Services} />
        <Route path="services/:service" component={Service} />
        <Route path="nodes" component={Nodes} />
      </Route>

    </Route>
  )
}

export default routes
