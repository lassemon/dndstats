export const get = async (url: string) => {
  try {
    const response = await fetch(url)
    console.log('response', response)
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
  }
}
