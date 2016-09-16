import React from 'react'
import { browserHistory, Router, Route, IndexRedirect, Redirect } from 'react-router'
import LayoutContainer from './containers/LayoutContainer/LayoutContainer'
import Home from './containers/Home/Home'
import Hosts from './containers/Hosts/Hosts'
import Host from './containers/Host/Host'
import Services from './containers/Services/Services'

const requireAuth = (nextState, replace) => {
  // if (!boutiqueAirLoggedIn) {
  //   replace({ pathname: '/login' })
  // }
}

const requireAdmin = (nextState, replace) => {
  // if (!isAdmin(userEmail)) {
  //   replace({ pathname: `/profile/${nextState.params.id}` })
  // }
}

export const routes = () => {
  return (
    <Route path="/">
      <IndexRedirect to="/home" />
      {/*<Route path="login" component={Login} />*/}

      <Route component={LayoutContainer} onEnter={requireAuth}>
        <Route path="home" component={Home} />
        <Route path="hosts" component={Hosts} />
        <Route path="hosts/:host" component={Host} />
        <Route path="services" component={Services} />
      </Route>

    </Route>
  )
}

export default routes
