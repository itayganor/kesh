const emitter = require('./events.js');

module.exports = (io) => {
    io.on('connection', socket => {
        onOff('log', data => {
            socket.emit('log', data);
        });
        onOff('log-error', data => {
            socket.emit('log-error', data);
        });


        function onOff(eventCode, func) {
            emitter.on(eventCode, func);

            socket.on('disconnect', () => {
                emitter.off(eventCode, func);
            })
        }
    })
};
