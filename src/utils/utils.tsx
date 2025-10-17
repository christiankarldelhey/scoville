
  export const getImagePath = (type: string, imageUrl: string) => {
    try {
      return new URL(`../assets/${type}/${imageUrl}`, import.meta.url).href
    } catch {
      return imageUrl
    }
  }