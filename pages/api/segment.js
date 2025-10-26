export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }
  
  try {
    const decodedUrl = decodeURIComponent(url);
    const response = await fetch(decodedUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'video/MP2T');
    res.setHeader('Cache-Control', 'public, max-age=7200');
    
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Segment error:', error);
    res.status(500).json({ 
      error: 'Segment failed',
      message: error.message 
    });
  }
}
