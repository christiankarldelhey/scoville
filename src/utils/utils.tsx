
  export const getImagePath = (type: string, imageUrl: string) => {
    console.log(type, imageUrl);
    try {
      return new URL(`../assets/${type}/${imageUrl}`, import.meta.url).href
    } catch {
      return imageUrl
    }
  }