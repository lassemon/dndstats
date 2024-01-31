import ApiError from 'domain/errors/ApiError'

const API_ROOT = '/api/v1'

export interface IAjaxOptions {
  payload?: any
  endpoint: string
  querystring?: string
  noRefresh?: boolean
}

type FetchOperation<T> = (options: IAjaxOptions) => Promise<T>

export const get = async <T>(options: IAjaxOptions): Promise<T> => {
  const url = buildQueryUrl(options)
  try {
    const response = await fetch(url)
    return await handleApiResponse(response)
  } catch (error) {
    return await refreshTokenAndRetry<T>(error, get, options)
  }
}

export const post = async <T>(options: IAjaxOptions): Promise<T> => {
  const url = buildQueryUrl(options)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(options.payload) // body data type must match "Content-Type" header
    })

    return await handleApiResponse(response)
  } catch (error) {
    return await refreshTokenAndRetry<T>(error, get, options)
  }
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

const refreshTokenAndRetry = async <T>(error: any, operation: FetchOperation<T>, options: IAjaxOptions): Promise<T> => {
  if (error.status === 401 && !options.noRefresh) {
    await refreshToken()
    return await retryOperation(operation, options)
  }
  throw error
}

const refreshToken = async (): Promise<any> => {
  const url = buildQueryUrl({ endpoint: '/auth/refresh' })
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const retryOperation = async <T>(operation: FetchOperation<T>, options: IAjaxOptions) => {
  return await operation({ ...options, noRefresh: true })
}

const buildQueryUrl = (options: IAjaxOptions) => {
  return `${API_ROOT}${options.endpoint}${options.querystring ? '?' + options.querystring : ''}`
}
