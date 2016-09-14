import { createStore as _createStore, applyMiddleware } from 'redux'
import createMiddleware from './middleware/clientMiddleware'
import { routerMiddleware } from 'react-router-redux'
import reducer from './modules/reducer'

export default function createStore(history, client, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);

  const middleware = [createMiddleware(client), reduxRouterMiddleware];
  const finalCreateStore = applyMiddleware(...middleware)(_createStore);
  const store = finalCreateStore(reducer, data);

  if (module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
