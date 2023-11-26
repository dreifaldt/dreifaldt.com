export const getHttpsLinks = (string: string) => {
  const regex = /(https:\/\/[^\s]+)/g
  const links = string.match(regex)
  return links
}
