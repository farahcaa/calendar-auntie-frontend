interface Env {
  ANALYTICS_URL: string; // set this in Pages bindings to your /analytics endpoint
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  env.ANALYTICS_URL = "https://your-analytics-endpoint.example.com/collect"; // replace with your actual endpoint
  const cf: any = (request as any).cf ?? {};
  const country = cf.country ?? null;
  const region = (cf.region ?? cf.regionCode ?? null) as string | null;

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  let originalText = "";
  if (hasBody) {
    // clone to avoid consuming the stream if you ever need to forward request.body
    originalText = await request.text();
  }

  // Build JSON body regardless of what came in
  let payload: any = {};
  const ct = request.headers.get("content-type") || "";
  if (hasBody && ct.includes("application/json") && originalText.trim()) {
    try {
      payload = JSON.parse(originalText);
    } catch {
      /* ignore */
    }
  }
  // Add/override enrichment
  payload.country = country;
  payload.region = region;

  const resp = await fetch(env.ANALYTICS_URL, {
    method,
    headers: { "content-type": "application/json" },
    body: hasBody ? JSON.stringify(payload) : undefined,
  });

  // pass through backend response
  return resp;
};
