/**
 * @typedef {'LOGO'|'PROFILE'|'RESUME'} PatchType
 * @param {{patch:PatchType, url_image:string}} options
 */
export function previewImageUrl(options) {
  if (!options.url_image) return null;
  return `${import.meta.env.VITE_IMAGE_API}/${options.url_image}`;
}

export function isUrl(urlString) {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
}

export function isProtocol(urlString) {
  return /\b(http|https)/.test(urlString);
}
