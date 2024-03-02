"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * @tsoaModel
 */
class ApiError extends Error {
    constructor(status, statusText, message, context) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.statusText = statusText;
        this.context = context;
        this.message = message !== null && message !== void 0 ? message : `${status} - ${statusText}`;
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map