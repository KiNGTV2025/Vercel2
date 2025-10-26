export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("❌ URL eksik!");

  try {
    // Hedef isteği yap
    const response = await fetch(url, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://dengetv66.live/",
        "Range": req.headers["range"],
        "Accept": "*/*",
        "Origin": "https://umitdenge.vercel.app",
      },
    });

    const contentType = response.headers.get("content-type") || "";

    // 🎬 Eğer M3U8 dosyasıysa segment URL'lerini proxy'le
    if (contentType.includes("mpegurl") || url.endsWith(".m3u8")) {
      const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
      let text = await response.text();

      // Hem tam (https://...) hem relatif segmentleri yakala
      text = text.replace(
        /(https?:\/\/[^\s]+\.ts)|(^|\n)([^#\n]+\.ts)/g,
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

    // 🎥 Medya dosyaları (TS, MP4 vs.)
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
