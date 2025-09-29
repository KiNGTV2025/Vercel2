const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";

async function fetchConfig(githubRawUrl) {
  const res = await fetch(githubRawUrl, { cache: "no-store" });
  const txt = await res.text();
  try { return JSON.parse(txt); } catch (e) { return null; }
}

function ensureScheme(urlOrHost) {
  if (!urlOrHost) return null;
  if (urlOrHost.startsWith("http://") || urlOrHost.startsWith("https://")) return urlOrHost.replace(/\/+$/, "");
  return "https://" + urlOrHost.replace(/\/+$/, "");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();

  const githubRawUrl = process.env.GITHUB_RAW_URL;
  const conf = await fetchConfig(githubRawUrl);

  const q = req.query || {};
  const file = q.file;
  const rawUrlParam = q.url;

  let targetUrl;
  if (rawUrlParam) targetUrl = rawUrlParam;
  else if (file && conf?.domain) targetUrl = `${ensureScheme(conf.domain)}/${file}`;
  else return res.status(400).send("Provide ?file=<name>.m3u8 or ?url=<full-url>");

  const fetchHeaders = { "User-Agent": req.headers["user-agent"] || DEFAULT_USER_AGENT };
  if (conf?.referer) fetchHeaders["Referer"] = conf.referer;

  const upstream = await fetch(targetUrl, { headers: fetchHeaders, redirect: "follow" });
  upstream.headers.forEach((v, k) => res.setHeader(k, v));
  res.status(upstream.status);

  const reader = upstream.body?.getReader?.();
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
    res.end();
  } else {
    const buf = await upstream.arrayBuffer();
    res.end(Buffer.from(buf));
  }
}
