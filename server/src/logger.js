const emitter = require('./events.js');


module.exports = class Logger {
    static log(...args) {
        console.log(...args);
        Logger._generic(...args);
    }

    static error(...args) {
        console.error(...args);
        Logger._generic(...args);
    }

    static _generic(...args) {
        emitter.emit('log', ...args);
    }
}
