"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const domain_1 = require("@dmtool/domain");
const Encryption_1 = require("../security/Encryption");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    validatePasswordChange(userId, newPassword, oldPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!oldPassword) {
                throw new domain_1.ApiError(401, 'Unauthorized');
            }
            const dbUser = yield this.userRepository.getById(userId);
            if (!(yield Encryption_1.Encryption.compare(oldPassword, dbUser.password))) {
                throw new domain_1.ApiError(401, 'Unauthorized');
            }
            return this.validateNewPassword(newPassword);
        });
    }
    validateNewPassword(newPassword) {
        // TODO new password length and complexity rules?
        // duplicate these rules to frontend input validation when implementing
        return true;
    }
    getUserNameByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getById(userId);
            return user.name;
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map