export default function Logo({ size = 40, glow = false, className = '' }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}gdu_logo.png`}
      alt="GameDevUtopia logo"
      width={size}
      height={size}
      className={`logo ${glow ? 'logo-glow' : ''} ${className}`}
      style={{ width: size, height: size }}
      draggable="false"
    />
  )
}
