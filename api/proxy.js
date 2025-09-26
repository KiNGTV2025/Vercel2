export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Kullanım: /api/proxy?url=HLS_URL");
  }

  const headers = {
    "User-Agent": req.headers["user-agent"] || "Mozilla/5.0"
  };

  try {
    const response = await fetch(url, { headers });

    // Eğer playlist (.m3u8)
    if (url.includes(".m3u8")) {
      let text = await response.text();

      // Hem .ts hem de nested .m3u8 linklerini proxy’ye yönlendir
      text = text.replace(/^(?!#)(.*\.(ts|m3u8).*)$/gm, (match) => {
        const newUrl = new URL(match, url).href;
        const base = req.headers["x-forwarded-proto"] + "://" + req.headers.host;
        return `${base}/api/proxy?url=${encodeURIComponent(newUrl)}`;
      });

      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.send(text);
    }

    // Eğer segment (.ts)
    if (url.includes(".ts")) {
      res.setHeader("Content-Type", response.headers.get("content-type") || "application/octet-stream");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return response.body.pipe(res);
    }

    return res.status(400).send("Desteklenmeyen format");
  } catch (err) {
    return res.status(500).send("Proxy hatası: " + err.message);
  }
}
