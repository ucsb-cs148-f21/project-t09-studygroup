// Cited from https://stackoverflow.com/a/57099213/8903570
// This ensures that Express catches async errors
const asyncHandler = (fn) => (req, res, next) => Promise
  .resolve(fn(req, res, next))
  .catch(next);

const methods = [
  'get',
  'post',
  'delete',
  'put',
  'patch',
];

function toAsyncApp(app) {
  const appKeys = Object.keys(app);
  appKeys.forEach((key) => {
    if (methods.includes(key)) {
      const method = app[key];
      // eslint-disable-next-line no-param-reassign
      app[key] = (path, ...callbacks) => method.call(app, path, ...callbacks.map((cb) => asyncHandler(cb)));
    }
  });

  return app;
}

export default toAsyncApp;
