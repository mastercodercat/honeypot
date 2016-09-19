import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import createStore from 'redux/create'
import ApiClient from 'utils/apiclient'
import routes from './routes'

const client = new ApiClient()
const store = createStore(browserHistory, client)
const history = syncHistoryWithStore(browserHistory, store)

const appRoutes = routes()
const mountNode = document.querySelector('#app')

ReactDOM.render(
  <Provider store={store} key="provider">
    <Router history={history}>
      {appRoutes}
    </Router>
  </Provider>,
mountNode)
