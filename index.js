const middleware = require('./src/middleware');
const handlePromiseAction = require('./src/handlePromiseAction');
const helpers = require('./src/helpers');

module.exports = {
  middleware,
  handlePromiseAction,
  onRequest: helpers.onRequest,
  onSuccess: helpers.onSuccess,
  onError: helpers.onError,
  isLoading: helpers.isLoading,
  isResolved: helpers.isResolved,
  isRejected: helpers.isRejected,
};
