export const extractHttpsLinks = (string: string) => {
  const regex = /(https:\/\/[^\s]+)/g
  const links = string.match(regex)
  return links
}
