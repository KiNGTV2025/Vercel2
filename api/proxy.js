import fetch from "node-fetch";

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("❌ URL parametre eksik!");
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        "Referer": "https://dengetv66.live/",
      },
    });

    const body = await response.arrayBuffer();
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(Buffer.from(body));
  } catch (err) {
    res.status(500).send("❌ Yayın alınamadı: " + err.message);
  }
}
