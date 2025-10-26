import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState('loading...');

  useEffect(() => {
    // API test
    fetch('/api/proxy')
      .then(response => response.text())
      .then(data => {
        console.log('API Response:', data.substring(0, 500));
        setStatus('API çalışıyor ✓');
      })
      .catch(error => {
        console.error('API Error:', error);
        setStatus('API hatası: ' + error.message);
      });
  }, []);

  return (
    <div style={{ 
      margin: 0, 
      padding: 20, 
      backgroundColor: 'black',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🔴 Canlı Yayın Test</h1>
      
      <div style={{ 
        padding: 10, 
        backgroundColor: status.includes('✓') ? 'green' : 'red',
        marginBottom: 20,
        borderRadius: 5
      }}>
        Durum: {status}
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => {
          setStatus('testing...');
          fetch('/api/proxy')
            .then(r => r.text())
            .then(data => {
              console.log('Manual test:', data);
              setStatus('Manual test başarılı ✓');
            })
            .catch(err => {
              setStatus('Manual test hatası: ' + err.message);
            });
        }}>API Test Et</button>
        
        <button onClick={() => window.location.reload()} style={{ marginLeft: 10 }}>
          Sayfayı Yenile
        </button>
      </div>

      <video 
        controls 
        autoPlay 
        muted
        style={{ 
          width: '100%', 
          maxWidth: '800px', 
          height: 'auto',
          border: '2px solid #333',
          borderRadius: '10px'
        }}
        onError={(e) => {
          console.error('Video Error:', e);
          setStatus('Video hatası - console\'a bak');
        }}
        onLoadStart={() => console.log('Video loading...')}
        onLoadedData={() => console.log('Video loaded!')}
      >
        <source src="/api/proxy" type="application/x-mpegURL" />
        Tarayıcınız bu video formatını desteklemiyor.
      </video>

      <div style={{ marginTop: 20, fontSize: '14px', color: '#ccc' }}>
        <h3>Debug Links:</h3>
        <a href="/api/proxy" target="_blank" style={{ color: '#4fc3f7' }}>
          Raw M3U8 Görüntüle
        </a>
        <br />
        <a href="/api/test" target="_blank" style={{ color: '#4fc3f7', marginTop: '10px' }}>
          Test M3U8 Görüntüle
        </a>
      </div>
    </div>
  );
        }      
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
