"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructUrl = void 0;
const constructUrl = (paths) => {
    return `/${paths.filter((part) => !!part).join("/")}`;
};
exports.constructUrl = constructUrl;
