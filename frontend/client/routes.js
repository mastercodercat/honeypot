import React from 'react'
import { browserHistory, Router, Route, IndexRedirect, Redirect } from 'react-router'
import LayoutContainer from './containers/LayoutContainer/LayoutContainer'
import Home from './containers/Home/Home'

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
      </Route>

    </Route>
  )
}

export default routes
