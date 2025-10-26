// /api/proxy.js
export default async function handler(req, res) {
  const TARGET_URL = 'https://taycan.zirvedesin23.sbs/yayinzirve.m3u8';
  
  try {
    const response = await fetch(TARGET_URL);
    const data = await response.text();
    
    // M3U8 içindeki segment linklerini de proxy'le
    const processedData = data.replace(/(https?:\/\/[^\s]+\.ts)/g, (match) => {
      return `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/segment?url=${encodeURIComponent(match)}`;
    });
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(processedData);
  } catch (error) {
    res.status(500).json({ error: 'Proxy failed: ' + error.message });
  }
}
