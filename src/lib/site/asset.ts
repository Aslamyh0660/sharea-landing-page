/** Public-asset URL that respects the Vite base ("/" in production,
 *  "/site/" in the sandbox preview build). */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}assets/${path}`.replaceAll("//assets", "/assets")
