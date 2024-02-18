"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unixtimeNow = void 0;
const luxon_1 = require("luxon");
const unixtimeNow = () => {
    return luxon_1.DateTime.now().toUnixInteger();
};
exports.unixtimeNow = unixtimeNow;
//# sourceMappingURL=time.js.map