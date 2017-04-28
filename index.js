const middleware = require('./src/middleware');
const handlePromiseAction = require('./src/handlePromiseAction');
const { onRequest, onSuccess, onError } = require('./src/helpers');

module.exports = {
  middleware,
  handlePromiseAction,
  onRequest,
  onSuccess,
  onError,
};
