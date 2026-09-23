/**
 * Logo — shared component used in Navbar, TopBar, Footer, Login, Signup.
 *
 * Accepts a `size` prop (defaults to 'md') to control the icon dimensions.
 * The wordmark is always Manrope bold — never an image, so it renders crisp at any scale.
 *
 * Using a single component means changing the logo asset updates it everywhere.
 */
export default function Logo({ size = 'md', showWordmark = true }) {
  const dimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  }

  const textSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }

  return (
    <div className="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="Skipense logo"
        className={`${dimensions[size]} object-contain rounded-xl`}
      />
      {showWordmark && (
        <span className={`font-bold text-skipense-ink ${textSize[size]} tracking-tight`}>
          Skipense
        </span>
      )}
    </div>
  )
}
