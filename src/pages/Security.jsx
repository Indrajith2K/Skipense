import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const pillars = [
  {
    icon: <Lock size={22} className="text-skipense-lime" />,
    title: 'Row Level Security',
    body: 'Every database table enforces RLS policies. Your expense data is isolated at the Postgres layer — not application code. Even our engineers cannot query your rows without your session JWT.',
  },
  {
    icon: <Shield size={22} className="text-skipense-lime" />,
    title: 'Password Security',
    body: 'Passwords are never stored in plaintext. Supabase Auth uses bcrypt hashing with a cost factor of 10. We have no access to your raw password.',
  },
  {
    icon: <Eye size={22} className="text-skipense-lime" />,
    title: 'Transport Security',
    body: 'All data in transit is encrypted with TLS 1.3. We enforce HTTPS on all endpoints. HTTP connections are redirected automatically.',
  },
  {
    icon: <AlertTriangle size={22} className="text-skipense-lime" />,
    title: 'Vulnerability Disclosure',
    body: 'We run a responsible disclosure programme. If you discover a security vulnerability, please report it to security@skittex.in. We commit to acknowledging reports within 48 hours.',
  },
]

export default function Security() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="inline-flex items-center bg-skipense-lime text-skipense-ink text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
          Security
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-skipense-ink tracking-tight mb-4">
          How We Keep Your Data Safe
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed mb-16 max-w-2xl">
          Security isn't an afterthought at Skipense — it's built into the architecture. Here's exactly what protects your data.
        </p>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {pillars.map(p => (
            <div key={p.title} className="bg-skipense-dark rounded-2xl p-7">
              <div className="w-10 h-10 bg-skipense-lime/10 rounded-xl flex items-center justify-center mb-5">
                {p.icon}
              </div>
              <h2 className="text-lg font-bold text-white mb-2">{p.title}</h2>
              <p className="text-skipense-mist/70 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Infrastructure */}
        <div className="bg-skipense-mist/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-skipense-ink mb-4">Infrastructure</h2>
          <div className="space-y-3 text-sm text-slate-600">
            <p><span className="font-semibold text-skipense-ink">Hosting:</span> Supabase (Asia-Pacific region), deployed on AWS.</p>
            <p><span className="font-semibold text-skipense-ink">Database:</span> Postgres 15 with Row Level Security enforced at the engine level.</p>
            <p><span className="font-semibold text-skipense-ink">Auth:</span> Supabase Auth — JWT-based, with automatic token rotation.</p>
            <p><span className="font-semibold text-skipense-ink">Frontend:</span> Vercel CDN with automatic HTTPS, DDoS protection, and WAF.</p>
          </div>
        </div>

        {/* Report a vulnerability */}
        <div className="border border-skipense-mist rounded-2xl p-8">
          <h2 className="text-xl font-bold text-skipense-ink mb-3">Report a Vulnerability</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            If you've found a security issue, we want to know about it. Please do not disclose it publicly until we've had a chance to address it. Email us at{' '}
            <a href="mailto:security@skittex.in" className="text-skipense-dark font-medium hover:underline">security@skittex.in</a>{' '}
            with details of the vulnerability. We commit to:
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
            <li>Acknowledge your report within 48 hours</li>
            <li>Provide a resolution timeline within 7 days</li>
            <li>Credit you (if desired) when we publish a fix</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}
