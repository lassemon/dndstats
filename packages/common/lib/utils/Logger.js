"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
class Logger {
    constructor(name, dateFormat = 'DD-MM-YYYY HH:mm:ssZ') {
        this.name = name;
        this.DATE_FORMAT = dateFormat;
    }
    debug(message, ...args) {
        if (process.env.LOG_LEVEL === 'DEBUG') {
            const formatted = this.formatMessage(message, 'DEBUG');
            console.log(formatted, ...args);
        }
    }
    info(message, ...args) {
        const formatted = this.formatMessage(message, 'INFO');
        console.log(formatted, ...args);
    }
    warn(message, ...args) {
        const formatted = this.formatMessage(message, 'WARN');
        console.warn(formatted, ...args);
    }
    error(message, ...args) {
        const formatted = this.formatMessage(message, 'ERROR');
        console.error(formatted, ...args);
    }
    formatMessage(message, level) {
        return `${this.name} ${this.getTimestamp()} ${level} - ${message}`;
    }
    getTimestamp() {
        return luxon_1.DateTime.now().toFormat(this.DATE_FORMAT);
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map