/** Build the Storage path for an uploaded sketch. Sanitizes the client-supplied
 *  file name (it goes into a URL/path) and caps its length. */
export function storagePath(uuid: string, fileName: string): string {
  const safe =
    fileName.replace(/[^\w.\-]+/g, "_").slice(-100).replace(/^_+/, "") ||
    "fisier";
  return `submissions/${uuid}/${safe}`;
}
