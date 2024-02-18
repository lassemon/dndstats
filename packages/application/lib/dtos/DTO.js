"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@dmtool/common");
class DTO {
    constructor(props) {
        this._properties = Object.assign(Object.assign({}, props), { id: props.id ? props.id : (0, common_1.uuid)() });
    }
}
exports.default = DTO;
//# sourceMappingURL=DTO.js.map