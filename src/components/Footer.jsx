import { Link } from 'react-router-dom'
import { X, Link2, Code2, Mail } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  const cols = [
    {
      title: 'Product',
      links: [
        { label: 'Features',  to: '#features', anchor: true },
        { label: 'Changelog', to: '#',          anchor: true },
        { label: 'Roadmap',   to: '#',          anchor: true },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About',   to: '/about', anchor: false },
        { label: 'Blog',    to: '/blog',  anchor: false },
        { label: 'Careers', to: '#',      anchor: true  },
        { label: 'Press',   to: '#',      anchor: true  },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy',   to: '/privacy',  anchor: false },
        { label: 'Terms of Service', to: '/terms',    anchor: false },
        { label: 'Cookie Policy',    to: '/cookies',  anchor: false },
        { label: 'Security',         to: '/security', anchor: false },
      ],
    },
  ]

  return (
    <footer id="footer" className="bg-white border-t border-skipense-mist/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 relative">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">

          {/* Col 1: Logo + tagline + socials */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-[200px]">
              Effortlessly track, manage, and understand your business spending.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <X size={15} />,     label: 'X (Twitter)', href: '#' },
                { icon: <Link2 size={15} />, label: 'LinkedIn',    href: '#' },
                { icon: <Code2 size={15} />, label: 'GitHub',      href: '#' },
                { icon: <Mail size={15} />,  label: 'Email',       href: '#' },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 bg-skipense-mist rounded-lg flex items-center justify-center text-slate-500 hover:bg-skipense-dark hover:text-skipense-lime transition"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Cols 2–4 */}
          {cols.map(col => (
            <div key={col.title}>
              <h3 className="text-xs uppercase tracking-widest font-medium text-slate-400 mb-4">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    {link.anchor ? (
                      <a href={link.to} className="text-sm text-slate-600 hover:text-skipense-ink transition">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} className="text-sm text-slate-600 hover:text-skipense-ink transition">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-skipense-mist pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Skipense. All rights reserved by{' '}
            <a
              href="https://skittex.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skipense-dark font-medium hover:underline"
            >
              Skittex Studio
            </a>.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-slate-400 hover:text-skipense-ink transition">Privacy Policy</Link>
            <Link to="/terms"   className="text-xs text-slate-400 hover:text-skipense-ink transition">Terms of Service</Link>
          </div>
        </div>

        {/* Watermark */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 flex justify-center overflow-hidden pointer-events-none select-none"
          style={{ zIndex: 0 }}
        >
          <span
            className="font-bold text-skipense-ink/[0.04] whitespace-nowrap leading-none"
            style={{ fontSize: 'clamp(80px, 15vw, 160px)' }}
          >
            Skipense
          </span>
        </div>
      </div>
    </footer>
  )
}
