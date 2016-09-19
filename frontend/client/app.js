import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { hashHistory } from 'react-router'

import createStore from 'redux/create'
import ApiClient from 'utils/apiclient'
import Routes from './routes'

const client = new ApiClient()
const store = createStore(hashHistory, client)

const mountNode = document.querySelector('#app')

ReactDOM.render(
  <Provider store={store} key="provider">
    <Routes store={store} />
  </Provider>,
mountNode)
