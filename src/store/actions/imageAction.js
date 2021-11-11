export const IMAGE_RECEIVED = "IMAGE_RECEIVED";
export const IMAGE_BOX_CREATED = "IMAGE_BOX_CREATED";
export const IMAGE_CHANGED = "IMAGE_CHANGED";
export const IMAGE_BOX_TICKET_UPDATED = "IMAGE_BOX_TICKET_UPDATED";

export function imagesReceived(imgUrl) {
  return { type: IMAGE_RECEIVED, payload: imgUrl };
}
//TODO:payload change
export function imageBoxCreated(payload) {
  return { type: IMAGE_BOX_CREATED, payload };
}

export function imageChanged(imgUrl) {
  return { type: IMAGE_CHANGED, payload: imgUrl };
}
export function imageBoxTicketUpdated(updatedPayload) {
  return { type: IMAGE_CHANGED, payload: updatedPayload };
}
