import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    console.log('Page loaded, testing proxy...');
    
    // Proxy test
    fetch('/api/proxy')
      .then(response => response.text())
      .then(data => {
        console.log('Proxy response:', data.substring(0, 200));
      })
      .catch(error => {
        console.error('Proxy test failed:', error);
      });
  }, []);

  return (
    <div style={{ 
      margin: 0, 
      padding: 20, 
      backgroundColor: 'black',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>Canlı Yayın Test</h1>
      
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => window.location.reload()}>Sayfayı Yenile</button>
        <button onClick={() => {
          fetch('/api/proxy')
            .then(r => r.text())
            .then(console.log)
            .catch(console.error);
        }}>Proxy Test</button>
      </div>
      
      <video 
        controls 
        autoPlay 
        style={{ width: '100%', maxWidth: '800px', height: 'auto' }}
        onError={(e) => {
          console.error('Video error:', e);
          alert('Video yüklenemedi. Console hatasına bakın.');
        }}
        onLoadStart={() => console.log('Video loading started')}
        onLoadedData={() => console.log('Video data loaded')}
      >
        <source src="/api/proxy" type="application/x-mpegURL" />
        Tarayıcınız video etiketini desteklemiyor.
      </video>
      
      <div style={{ marginTop: 20 }}>
        <h3>Debug Info:</h3>
        <p>Proxy URL: /api/proxy</p>
        <p>Target: https://taycan.zirvedesin23.sbs/yayinzirve.m3u8</p>
      </div>
    </div>
  );
          }
