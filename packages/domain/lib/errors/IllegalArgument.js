"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalArgument = void 0;
class IllegalArgument extends Error {
    constructor(status = 400, statusText, message, context) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.statusText = statusText;
        this.message = message !== null && message !== void 0 ? message : `${status} - ${statusText}`;
    }
}
exports.IllegalArgument = IllegalArgument;
//# sourceMappingURL=IllegalArgument.js.map