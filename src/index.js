import { onRequest as apiRoot } from "../functions/api.js";
import { onRequest as apiLatest } from "../functions/api/latest.js";
import { onRequest as apiLatestLimit } from "../functions/api/latest/[limit].js";
import { onRequest as apiRandom } from "../functions/api/random.js";
import { onRequest as apiRandomLimit } from "../functions/api/random/[limit].js";
import { onRequest as apiRange } from "../functions/api/range/[start]/[end].js";
import { onRequest as apiYear } from "../functions/api/[year].js";
import { onRequest as apiYearMonth } from "../functions/api/[year]/[month].js";
import { onRequest as apiYearMonthDay } from "../functions/api/[year]/[month]/[day].js";
import { onRequest as apiYearAll } from "../functions/api/[year]/all.js";
import { onRequest as apiYearMonthAll } from "../functions/api/[year]/[month]/all.js";
import { onRequest as imgLatest } from "../functions/img/latest.js";
import { onRequest as imgRandom } from "../functions/img/random.js";
import { onRequest as imgDate } from "../functions/img/[year]/[month]/[day].js";
import { onRequest as jsonYearAll } from "../functions/[year]/all.json.js";
import { onRequest as jsonMonthAll } from "../functions/[year]/[month]/all.json.js";
import { onRequest as jsonDate } from "../functions/[year]/[month]/[day].json.js";

const routes = [
  [/^\/api\/?$/, apiRoot, []],
  [/^\/api\/latest\/?$/, apiLatest, []],
  [/^\/api\/latest\/([^/]+)\/?$/, apiLatestLimit, ["limit"]],
  [/^\/api\/random\/?$/, apiRandom, []],
  [/^\/api\/random\/([^/]+)\/?$/, apiRandomLimit, ["limit"]],
  [/^\/api\/range\/([^/]+)\/([^/]+)\/?$/, apiRange, ["start", "end"]],
  [/^\/api\/([^/]+)\/([^/]+)\/([^/]+)\/?$/, apiYearMonthDay, ["year", "month", "day"]],
  [/^\/api\/([^/]+)\/([^/]+)\/all\/?$/, apiYearMonthAll, ["year", "month"]],
  [/^\/api\/([^/]+)\/([^/]+)\/?$/, apiYearMonth, ["year", "month"]],
  [/^\/api\/([^/]+)\/all\/?$/, apiYearAll, ["year"]],
  [/^\/api\/([^/]+)\/?$/, apiYear, ["year"]],
  [/^\/img\/latest\/?$/, imgLatest, []],
  [/^\/img\/random\/?$/, imgRandom, []],
  [/^\/img\/([^/]+)\/([^/]+)\/([^/]+)\/?$/, imgDate, ["year", "month", "day"]],
  [/^\/([^/]+)\/all\.json$/, jsonYearAll, ["year"]],
  [/^\/([^/]+)\/([^/]+)\/all\.json$/, jsonMonthAll, ["year", "month"]],
  [/^\/([^/]+)\/([^/]+)\/([^/]+)\.json$/, jsonDate, ["year", "month", "day"]],
];

function matchRoute(pathname) {
  for (const [pattern, handler, paramNames] of routes) {
    const match = pathname.match(pattern);
    if (!match) continue;
    return {
      handler,
      params: Object.fromEntries(paramNames.map((name, index) => [name, match[index + 1]])),
    };
  }
  return null;
}

export default {
  async fetch(request, env, executionContext) {
    const url = new URL(request.url);
    const route = matchRoute(url.pathname);

    if (route) {
      return route.handler({
        request,
        env,
        params: route.params,
        waitUntil: executionContext.waitUntil.bind(executionContext),
        passThroughOnException() {},
        next: () => env.ASSETS.fetch(request),
        data: {},
        functionPath: url.pathname,
      });
    }

    return env.ASSETS.fetch(request);
  },
};
