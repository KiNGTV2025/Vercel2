import fetch from "node-fetch";

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("❌ URL eksik!");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        "Referer": "https://dengetv66.live/"
      }
    });

    const contentType = response.headers.get("content-type") || "";

    // Eğer .m3u8 ise içindeki TS linklerini Vercel proxy üzerinden yönlendir
    if (contentType.includes("mpegurl") || url.endsWith(".m3u8")) {
      let text = await response.text();
      text = text.replace(/(https?:\/\/[^\s]+\.ts)/g, (match) => {
        return `/api/proxy?url=${encodeURIComponent(match)}`;
      });
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      return res.send(text);
    }

    // Diğer dosyalar (TS segmentleri)
    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send("❌ Yayın alınamadı: " + err.message);
  }
}
