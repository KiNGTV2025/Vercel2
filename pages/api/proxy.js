export default async function handler(req, res) {
  const TARGET_URL = 'https://taycan.zirvedesin23.sbs/yayinzirve.m3u8';
  
  try {
    const response = await fetch(TARGET_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    
    const processedData = data.replace(/(https?:\/\/[^\s]+\.ts)/g, (match) => {
      return `${baseUrl}/api/segment?url=${encodeURIComponent(match)}`;
    });
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.send(processedData);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy failed',
      message: error.message 
    });
  }
}
