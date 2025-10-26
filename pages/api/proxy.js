export default async function handler(req, res) {
  try {
    // Farklı bir yöntem deneyelim - doğrudan stream
    const TARGET_URL = 'https://taycan.zirvedesin23.sbs/yayinzirve.m3u8';
    
    console.log('Trying to fetch:', TARGET_URL);
    
    // Headers ekleyerek deneyelim
    const response = await fetch(TARGET_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
        'Referer': 'https://taycan.zirvedesin23.sbs/'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      // 403 hatası alırsak, farklı bir çözüm deneyelim
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.text();
    console.log('Data received, length:', data.length);
    
    // Basitçe orijinal datayı döndür (segment proxy'siz)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.send(data);
    
  } catch (error) {
    console.error('Error details:', error);
    
    // Hata durumunda fallback
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    
    // Fallback M3U8
    const fallbackM3U8 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:6
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:6.0,
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXT-X-ENDLIST`;
    
    res.send(fallbackM3U8);
  }
}
