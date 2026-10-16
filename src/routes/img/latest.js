import { loadImages } from "../../lib/bing-api.js";
import {
  buildBingTargetUrl,
  IMAGE_HEADERS,
  imageJsonError,
  parseImageRedirect,
  proxyBingImage,
  redirectToBingImage,
  withImageDateHeaders,
} from "../../lib/img-api.js";

function getLatestImage(images) {
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }
  let latest = null;
  for (const image of images) {
    const enddate = typeof image?.enddate === "string" ? image.enddate : "";
    if (!/^\d{8}$/.test(enddate)) {
      continue;
    }
    if (!latest || enddate > latest.enddate) {
      latest = image;
    }
  }
  return latest;
}

export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: IMAGE_HEADERS });
  }
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return imageJsonError("Method not allowed", 405);
  }

  let latestImage = null;
  try {
    const images = await loadImages(context);
    latestImage = getLatestImage(images);
  } catch (error) {
    return imageJsonError(
      `Failed to load wallpaper data: ${error instanceof Error ? error.message : String(error)}`,
      500,
    );
  }

  if (!latestImage || !latestImage.enddate) {
    return imageJsonError("No wallpaper data available.", 404);
  }

  const requestUrl = new URL(context.request.url);
  const redirectOption = parseImageRedirect(requestUrl);
  if (redirectOption.error) {
    return imageJsonError(redirectOption.error, 400);
  }
  const target = buildBingTargetUrl(latestImage, latestImage.enddate, requestUrl);
  if (target.error) {
    return imageJsonError(target.error, 400);
  }

  if (redirectOption.redirect) {
    return redirectToBingImage(target.url, latestImage.enddate);
  }

  const imageResponse = await proxyBingImage(context, target.url);
  return withImageDateHeaders(imageResponse, latestImage.enddate, target.url);
}
