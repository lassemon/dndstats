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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageStorageService = void 0;
const fs_1 = __importDefault(require("fs"));
const common_1 = require("@dmtool/common");
const log = new common_1.Logger('ImageStorageService');
const imagesBasePath = process.env.IMAGES_BASE_PATH || './images';
class ImageStorageService {
    removeImageFromFileSystem(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const unlinkPath = `${imagesBasePath}/${fileName}`;
            fs_1.default.unlink(unlinkPath, (err) => {
                if (err) {
                    log.error('Error removing the file:', err);
                    return;
                }
                log.debug('File removed successfully', fileName);
            });
        });
    }
    writeImageBufferToFile(imageBuffer, fileName) {
        const outputPath = `${imagesBasePath}/${fileName}`;
        fs_1.default.writeFile(outputPath, imageBuffer, (err) => {
            if (err) {
                console.error('Failed to save the image file:', err);
                return;
            }
        });
    }
}
exports.ImageStorageService = ImageStorageService;
//# sourceMappingURL=ImageStorageService.js.map