export default async function handler(req, res) {
  // Sadece test için basit bir response
  const testM3U8 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:1
#EXTINF:10.0,
https://umitdenge54.vercel.app/api/segment?url=https://example.com/test.ts
#EXT-X-ENDLIST`;

  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(testM3U8);
}
