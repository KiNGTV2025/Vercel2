export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("❌ URL eksik!");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        "Referer": "https://dengetv66.live/",
        "Origin": "https://umitdenge.vercel.app",
        "Range": req.headers["range"],
        "Accept": "*/*",
      },
    });

    const contentType = response.headers.get("content-type") || "";

    // M3U8 dosyası
    if (contentType.includes("mpegurl") || url.endsWith(".m3u8")) {
      const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
      let text = await response.text();

      // Hem mutlak hem relatif .ts yollarını yakala
      text = text.replace(
        /(https?:\/\/[^\s'"]+\.ts)|(^|\n)([^#\n]+\.ts)/g,
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
      res.setHeader("Access-Control-Allow-Headers", "*");
      return res.status(200).send(text);
    }

    // TS veya medya dosyaları
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "content-encoding") {
        res.setHeader(key, value);
      }
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy hata:", err);
    res.status(500).send("❌ Yayın alınamadı: " + err.message);
  }
    }
