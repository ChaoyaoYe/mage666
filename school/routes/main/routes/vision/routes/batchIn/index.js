module.exports = {
    path: 'batchin',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./components/BatchIn'));
        });
    }
};
