"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownError = void 0;
class UnknownError extends Error {
    constructor(status, statusText, message) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.statusText = statusText;
        this.message = message !== null && message !== void 0 ? message : `${status} - ${statusText}`;
    }
}
exports.UnknownError = UnknownError;
//# sourceMappingURL=UnknownError.js.map