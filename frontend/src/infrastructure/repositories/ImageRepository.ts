import { FetchOptions, HttpImageRepositoryInterface } from '@dmtool/application'
import { ApiError, Image } from '@dmtool/domain'
import { deleteJson, getJson, postJson } from 'infrastructure/dataAccess/http/fetch'

class ImageRepository implements HttpImageRepositoryInterface {
  async getById(imageId: string, options?: FetchOptions): Promise<Image> {
    return await getJson<Image>({ ...{ endpoint: `/image/${imageId ? imageId : ''}` }, ...options })
  }

  // differentiate between post and put on images?
  async save(image: Image, options?: FetchOptions) {
    return await postJson<Image>({ ...{ endpoint: '/image', payload: image }, ...options })
  }

  async delete(imageId: string, options?: FetchOptions): Promise<Image> {
    return await deleteJson({ ...{ endpoint: `/image/${imageId ? imageId : ''}` }, ...options })
  }
}

export default ImageRepository
