import ApiError from 'domain/errors/ApiError'
import RefreshTokenError from 'domain/errors/RefreshTokenError'

const API_ROOT = '/api/v1'

export interface IAjaxOptions {
  payload?: any
  endpoint: string
  querystring?: string
  noRefresh?: boolean
}

type FetchOperation = (options: IAjaxOptions) => Promise<Response>

export const get = async <T>(options: IAjaxOptions): Promise<T> => {
  const url = buildQueryUrl(options)
  const response = await fetch(url)
  return await handleApiResponse(response).catch((error) => {
    return refreshTokenAndRetry(error, post, options)
  })
}

export const post = async <T>(options: IAjaxOptions): Promise<T> => {
  const url = buildQueryUrl(options)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(options.payload) // body data type must match "Content-Type" header
  })

  return await handleApiResponse(response).catch((error) => {
    return refreshTokenAndRetry(error, post, options)
  })
}

const handleApiResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    let errorData = null
    try {
      // Attempt to parse the error response
      errorData = await response.json()
    } catch (error) {
      // If parsing fails, throw a generic ApiError
      throw new ApiError(response.status, response.statusText, 'Error processing response')
    }
    // Extract error information from the response
    const message = errorData.message || response.statusText
    const status = response.status
    const statusText = response.statusText
    const context = errorData.context || {}

    // Throw a custom ApiError with the extracted information
    throw new ApiError(status, statusText, message, context)
  }

  // If response is ok, return the parsed JSON data
  return await response.json()
}

const refreshTokenAndRetry = async (error: any, operation: FetchOperation, options: IAjaxOptions) => {
  if (error.status === 401 && !options.noRefresh) {
    await refreshToken()
    const response = await retryOperation(operation, options)
    return handleApiResponse(response)
  }
  throw error
}

const refreshToken = async (): Promise<any> => {
  const url = buildQueryUrl({
    endpoint: 'auth/refresh'
  })
  return post({ endpoint: url })
    .then((response: any) => {
      return response.data
    })
    .catch(() => {
      throw new RefreshTokenError(401, 'Unauthorized')
    })
}

const retryOperation = async (operation: FetchOperation, options: IAjaxOptions) => {
  return await operation(options)
}

const buildQueryUrl = (options: IAjaxOptions) => {
  return `${API_ROOT}${options.endpoint}${options.querystring ? '?' + options.querystring : ''}`
}
