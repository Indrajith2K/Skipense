import { Link } from 'react-router-dom'
import { TrendingUp, Users, Globe } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Logo from '../components/Logo'

const stats = [
  { value: 'Beta', label: 'Currently in active development' },
  { value: '₹0', label: 'Platform fees forever' },
  { value: '40+', label: 'Integrations on the roadmap' },
]

const team = [
  { name: 'INDRAJITH', role: 'Founder & CEO', initials: 'IKU' },
  { name: 'LOKITH', role: 'CTO', initials: 'LOK' },
  { name: 'RADHAKRISHNAN', role: 'Head of Design', initials: 'RDK' },
]

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center bg-skipense-lime text-skipense-ink text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              About Us
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-skipense-ink tracking-tight leading-tight mb-6">
              Built for teams that<br />move fast
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
              Skipense was born from a simple frustration: expense management was either too complex or too broken. We set out to build something teams actually want to use — minimal, fast, and honest.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-skipense-dark py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              {stats.map(s => (
                <div key={s.label}>
                  <p className="text-3xl md:text-5xl font-bold text-skipense-lime mb-2">{s.value}</p>
                  <p className="text-skipense-mist/60 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-slate-600 text-base leading-relaxed">
            <h2 className="text-3xl font-bold text-skipense-ink">Our Story</h2>
            <p>
              Skipense is a product of{' '}
              <a href="https://skittex.in" target="_blank" rel="noopener noreferrer" className="text-skipense-dark font-semibold hover:underline">Skittex Studio</a>
              , a product studio focused on building clean, opinionated tools for modern businesses. We started Skipense after watching finance teams at small businesses waste hours every month chasing receipts and reconciling spreadsheets.
            </p>
            <p>
              We believed there was a better way — one that doesn't require a 3-day onboarding, a dedicated admin, or an enterprise contract. Skipense is that way.
            </p>
            <p>
              We're headquartered in India, building for global teams. Our infrastructure runs on Supabase (Postgres + Auth) and Vercel, giving us the speed and security that enterprise tools charge 10x for.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-skipense-mist/40 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-skipense-ink mb-10 text-center">What we believe in</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <TrendingUp size={20} className="text-skipense-dark" />, title: 'Radical simplicity', body: 'Every feature added is a trade-off. We choose simplicity over completeness every time.' },
                { icon: <Globe size={20} className="text-skipense-dark" />, title: 'Security by default', body: 'RLS, HTTPS, bcrypt — security isn\'t a premium feature. It\'s the foundation.' },
                { icon: <Users size={20} className="text-skipense-dark" />, title: 'Teams first', body: 'We build for the team lead who approves, the employee who submits, and the accountant who reconciles.' },
              ].map(v => (
                <div key={v.title} className="bg-white rounded-2xl p-7 shadow-card">
                  <div className="w-10 h-10 bg-skipense-mist rounded-xl flex items-center justify-center mb-4">{v.icon}</div>
                  <h3 className="font-bold text-skipense-ink mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-skipense-ink mb-10 text-center">The team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map(member => (
                <div key={member.name} className="text-center">
                  <div className="w-16 h-16 bg-skipense-dark rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-skipense-lime font-bold text-lg">{member.initials}</span>
                  </div>
                  <p className="font-bold text-skipense-ink text-sm">{member.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-skipense-ink mb-4">Ready to get started?</h2>
            <p className="text-slate-500 mb-8">Free forever for small teams. No credit card required.</p>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-skipense-lime text-skipense-ink font-bold px-8 py-4 rounded-full hover:scale-[1.02] transition-transform duration-200">
              Create your account
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
