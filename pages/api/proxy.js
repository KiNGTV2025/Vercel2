export default async function handler(req, res) {
  const TARGET_URL = 'https://taycan.zirvedesin23.sbs/yayinzirve.m3u8';
  
  try {
    console.log('Fetching:', TARGET_URL);
    const response = await fetch(TARGET_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    console.log('Original data length:', data.length);
    
    const baseUrl = 'https://umitdenge54.vercel.app';
    
    // TS segmentlerini proxy'le
    const processedData = data.replace(/(https?:\/\/[^\s]+\.ts)/g, (match) => {
      return `${baseUrl}/api/segment?url=${encodeURIComponent(match)}`;
    });
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache');
    
    console.log('Sending processed data');
    res.send(processedData);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy failed',
      message: error.message,
      target: TARGET_URL
    });
  }
}
