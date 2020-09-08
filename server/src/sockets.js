const emitter = require('./events.js');

module.exports = (io) => {
    io.on('connection', socket => {
        emitter.on('log', data => {
            socket.emit('log', data);
        })
        emitter.on('log-error', data => {
            socket.emit('log-error', data);
        })
    })
};
