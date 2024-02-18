"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.unixtimeNow = exports.uuid = void 0;
var common_1 = require("./utils/common");
Object.defineProperty(exports, "uuid", { enumerable: true, get: function () { return common_1.uuid; } });
var time_1 = require("./utils/time");
Object.defineProperty(exports, "unixtimeNow", { enumerable: true, get: function () { return time_1.unixtimeNow; } });
var Logger_1 = require("./utils/Logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return __importDefault(Logger_1).default; } });
//# sourceMappingURL=index.js.map