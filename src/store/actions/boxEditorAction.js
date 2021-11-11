export const IMAGE_RESIZED = "IMAGE_RESIZED";
export const BOX_CREATION_STARTED = "BOX_CREATION_STARTED";
export const BOX_CREATION_UPDATED = "BOX_CREATION_UPDATED";
export const BOX_CREATION_ENDED = "BOX_CREATION_ENDED";
export const BOX_CREAT_TICKET = "BOX_CREAT_TICKET";
export const BOX_CREAT_TICKET_SAVED = "BOX_CREAT_TICKET_SAVED";
export const WRITE_TEXT_DATA = "WRITE_TEXT_DATA";

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
export function boxCreatTicket(payload) {
  return { type: BOX_CREAT_TICKET, payload };
}
export function boxCreatTicketSaved(payload) {
  return { type: BOX_CREAT_TICKET_SAVED, payload };
}
