export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});

      const actionPromise = promise(client);
      actionPromise.then(
        (result) => {
          return next({...rest, result, type: SUCCESS})
        },
        (error) => {
          // console.error('MIDDLEWARE RESOLVED ERROR:', error);
          throw error
          return next({...rest, error, type: FAILURE})
        }
      ).catch((error)=> {
        // console.error('MIDDLEWARE ERROR:', error);
        throw error
        next({...rest, error, type: FAILURE});
      });

      return actionPromise;
    };
  };
}
