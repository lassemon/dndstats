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
exports.ImageProcessingService = void 0;
const fs_1 = __importDefault(require("fs"));
const jimp_1 = __importDefault(require("jimp"));
const webp_converter_1 = __importDefault(require("webp-converter"));
const file_type_1 = __importDefault(require("file-type"));
const imagesBasePath = process.env.IMAGES_BASE_PATH || './images';
webp_converter_1.default.grant_permission();
class ImageProcessingService {
    resizeImage(buffer, resizeOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Detect the MIME type of the image
                const type = yield file_type_1.default.fromBuffer(buffer);
                if (type && type.mime === 'image/webp') {
                    // Process as WebP
                    const inputWebpPath = `${imagesBasePath}/temp/temp.webp`; // Consider using a unique filename or a temporary directory
                    const outputPngPath = `${imagesBasePath}/temp/temp.png`;
                    // Write the WebP image to a temporary file
                    yield fs_1.default.promises.writeFile(inputWebpPath, buffer);
                    // Convert WebP to PNG
                    yield webp_converter_1.default.dwebp(inputWebpPath, outputPngPath, '-o');
                    // Read the converted PNG file into a buffer
                    const pngBuffer = yield fs_1.default.promises.readFile(outputPngPath);
                    // Resize the PNG buffer using Jimp
                    const image = yield jimp_1.default.read(pngBuffer);
                    yield image.resize(resizeOptions.width, jimp_1.default.AUTO);
                    const resizedBuffer = yield image.getBufferAsync(jimp_1.default.MIME_PNG);
                    // Cleanup temporary files
                    yield fs_1.default.promises.unlink(inputWebpPath);
                    yield fs_1.default.promises.unlink(outputPngPath);
                    return resizedBuffer;
                }
                else {
                    // Process non-WebP images directly with Jimp
                    const image = yield jimp_1.default.read(buffer);
                    yield image.resize(resizeOptions.width, jimp_1.default.AUTO);
                    return yield image.getBufferAsync(jimp_1.default.MIME_PNG);
                }
            }
            catch (error) {
                console.error('Error processing image:', error);
                throw new Error('Failed to process image');
            }
        });
    }
}
exports.ImageProcessingService = ImageProcessingService;
//# sourceMappingURL=ImageProcessingService.js.map