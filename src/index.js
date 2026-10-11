import { onRequest as apiRoot } from "./routes/api.js";
import { onRequest as apiLatest } from "./routes/api/latest.js";
import { onRequest as apiLatestLimit } from "./routes/api/latest/[limit].js";
import { onRequest as apiRandom } from "./routes/api/random.js";
import { onRequest as apiRandomLimit } from "./routes/api/random/[limit].js";
import { onRequest as apiRange } from "./routes/api/range/[start]/[end].js";
import { onRequest as apiYear } from "./routes/api/[year].js";
import { onRequest as apiYearMonth } from "./routes/api/[year]/[month].js";
import { onRequest as apiYearMonthDay } from "./routes/api/[year]/[month]/[day].js";
import { onRequest as apiYearAll } from "./routes/api/[year]/all.js";
import { onRequest as apiYearMonthAll } from "./routes/api/[year]/[month]/all.js";
import { onRequest as imgLatest } from "./routes/img/latest.js";
import { onRequest as imgRandom } from "./routes/img/random.js";
import { onRequest as imgDate } from "./routes/img/[year]/[month]/[day].js";
import { onRequest as jsonYearAll } from "./routes/[year]/all.json.js";
import { onRequest as jsonMonthAll } from "./routes/[year]/[month]/all.json.js";
import { onRequest as jsonDate } from "./routes/[year]/[month]/[day].json.js";

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
