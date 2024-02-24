import { FetchOptions, HttpImageRepositoryInterface } from '@dmtool/application'
import { Image } from '@dmtool/domain'
import ApiError from 'domain/errors/ApiError'
import { getJson, postJson } from 'infrastructure/dataAccess/http/fetch'

class ImageRepository implements HttpImageRepositoryInterface {
  async getById(imageId: string, options?: FetchOptions): Promise<Image> {
    return await getJson<Image>({ ...{ endpoint: `/image/${imageId ? imageId : ''}` }, ...options })
  }

  // differentiate between post and put on images?
  async save(image: Image, options?: FetchOptions) {
    return await postJson<Image>({ ...{ endpoint: '/image', payload: image }, ...options })
  }

  async delete(imageId: string, options?: FetchOptions): Promise<Image> {
    throw new ApiError(501, 'NotImplemented')
  }
}

export default ImageRepository
