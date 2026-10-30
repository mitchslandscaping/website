export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  return (
    <div
      className="landing-hero-media"
      style={{ backgroundImage: `url(${poster})` }}
      aria-hidden="true"
    >
      <video
        key={src}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        tabIndex={-1}
      />
    </div>
  );
}
