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
import UserConfig from './containers/UserConfig/UserConfig'

const requireAuth = (nextState, replace) => {
  if (!window.honeydbLoggedIn) {
    replace({ pathname: '/login' })
  }
}

const requireAdmin = (nextState, replace) => {
  if (!window.honeydbAdmin) {
    replace({ pathname: '/' })
  }
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
        <Route path="userconfig" component={UserConfig} />
        <Route onEnter={requireAdmin}>
          <Route path="nodes" component={Nodes} />
        </Route>
      </Route>

    </Route>
  )
}

export default routes
