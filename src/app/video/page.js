export const dynamic = 'force-static'

export default function VideoPage() {
  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <video 
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        preload="auto"
      >
        <source src="/videos/1.mp4" type="video/mp4" />
      </video>
    </div>
  );
} 