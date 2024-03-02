"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateStringFromUnixTime = exports.unixtimeNow = void 0;
const luxon_1 = require("luxon");
const unixtimeNow = () => {
    return luxon_1.DateTime.now().toUnixInteger();
};
exports.unixtimeNow = unixtimeNow;
const dateStringFromUnixTime = (unixtime) => {
    return luxon_1.DateTime.fromSeconds(unixtime).setZone('Europe/Helsinki').toLocaleString(luxon_1.DateTime.DATETIME_SHORT_WITH_SECONDS);
};
exports.dateStringFromUnixTime = dateStringFromUnixTime;
//# sourceMappingURL=time.js.map