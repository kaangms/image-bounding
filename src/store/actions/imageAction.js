export const IMAGE_RECEIVED = "IMAGE_RECEIVED";
export const IMAGE_BOX_CREATED = "IMAGE_BOX_CREATED";

export function imagesReceived(imgUrl) {
  return { type: IMAGE_RECEIVED, payload: imgUrl };
}
//TODO:payload change
export function imageBoxCreated(payload) {
  return { type: IMAGE_BOX_CREATED, payload };
}
