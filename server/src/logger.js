const emitter = require('./events.js');


module.exports = class Logger {
    static log(...args) {
        console.log(...args);
        Logger.emitLog(...args);
    }

    static error(...args) {
        console.error(...args);
        Logger.emitError(...args);
    }

    static emitLog(...args) {
        emitter.emit('log', ...args);
    }

    static emitError(...args) {
        emitter.emit('log-error', ...args);
    }
}
