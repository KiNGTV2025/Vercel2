export default function Home() {
  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: 'black' }}>
      <video 
        controls 
        autoPlay 
        style={{ width: '100%', height: '100vh' }}
        onError={(e) => console.error('Video error:', e)}
      >
        <source src="/api/proxy" type="application/x-mpegURL" />
        Tarayıcınız video etiketini desteklemiyor.
      </video>
    </div>
  );
}
