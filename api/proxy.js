export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("❌ URL eksik!");

  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        "Referer": "https://dengetv66.live/",
        "Range": req.headers["range"],
        "Accept": "*/*",
      },
    });

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("mpegurl") || url.endsWith(".m3u8")) {
      const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
      let text = await response.text();

      text = text.replace(
        /(https?:\/\/[^\s]+\.(ts|m4s|mp4|aac))|(^|\n)([^#\n]+\.(ts|m4s|mp4|aac))/g,
        (match) => {
          const clean = match.trim();
          if (clean.startsWith("http")) {
            return `/api/proxy?url=${encodeURIComponent(clean)}`;
          }
          return `/api/proxy?url=${encodeURIComponent(baseUrl + clean)}`;
        }
      );

      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).send(text);
    }

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy hata:", err);
    res.status(500).send("❌ Yayın alınamadı: " + err.message);
  }
}
