export const IMAGE_RESIZED = "IMAGE_RESIZED";
export const BOX_CREATION_STARTED = "BOX_CREATION_STARTED";
export const BOX_CREATION_UPDATED = "BOX_CREATION_UPDATED";
export const BOX_CREATION_ENDED = "BOX_CREATION_ENDED";

//TODO:payload değişecek
export function imageResized(payload) {
  return { type: IMAGE_RESIZED, payload };
}
export function boxCreationStarted(payload) {
  return { type: BOX_CREATION_STARTED, payload };
}
export function boxCreationUpdated(payload) {
  return { type: BOX_CREATION_UPDATED, payload };
}
export function boxCreationEnded() {
  return { type: BOX_CREATION_ENDED };
}
