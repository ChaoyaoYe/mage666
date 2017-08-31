module.exports = {
    path: 'vision',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./components/Vision'));
        });
    },
    getChildRoutes(partialNextState, cb) {
        require.ensure([], (require) => {
          cb(null, [require('./routes/list'),require('./routes/batchIn')]);
        });
    }
};
