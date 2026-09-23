import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Plus, Minus, ChevronRight, TrendingUp, CreditCard, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Logo from '../components/Logo'

// ─────────────────────────────────────────────────────────────────────────────
// Section helpers
// ─────────────────────────────────────────────────────────────────────────────

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-skipense-lime text-skipense-ink text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
      {children}
    </span>
  )
}

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} fill="#C7F269" stroke="none" />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// B. Hero
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const [email, setEmail] = useState('')

  return (
    <section className="relative overflow-hidden py-20 md:py-32" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <div>
            <Pill>Welcome to Skipense</Pill>
            <h1
              id="hero-heading"
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-skipense-ink leading-[1.05] mb-6"
            >
              Streamline Your<br />
              <span className="text-skipense-dark">Spending Goals</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-10 max-w-md">
              Effortlessly track expenses, capture receipts, and manage spending — all in one place. Built for teams that move fast.
            </p>

            {/* Email + CTA */}
            <form
              onSubmit={e => { e.preventDefault(); window.location.href = '/signup' }}
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input
                id="hero-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="flex-1 bg-skipense-mist rounded-full px-5 py-3.5 text-skipense-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-skipense-dark/20 transition text-sm"
              />
              <Link
                to="/signup"
                className="bg-skipense-lime text-skipense-ink font-bold text-sm px-6 py-3.5 rounded-full hover:scale-[1.03] transition-transform duration-200 text-center whitespace-nowrap"
              >
                Try It Free
              </Link>
            </form>

            <p className="text-xs text-slate-400 mt-4">No credit card required. Free forever for small teams.</p>
          </div>

          {/* Right: dashboard mockup */}
          <div className="relative flex items-center justify-center">
            {/* Lime blob */}
            <div className="lime-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />

            {/* Dashboard mockup card */}
            <div className="relative z-10 bg-white rounded-3xl shadow-card w-full max-w-sm p-5">
              {/* Mockup top bar */}
              <div className="flex items-center justify-between mb-4">
                <Logo size="sm" />
                <span className="bg-skipense-lime text-skipense-ink font-bold text-xs px-2.5 py-1 rounded-full">
                  ₹84,200
                </span>
              </div>

              {/* Chart mockup */}
              <div className="bg-skipense-mist rounded-2xl p-4 mb-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-3">Category Breakdown</p>
                <div className="space-y-2">
                  {[
                    { cat: 'Travel', pct: 38, color: '#1B3530' },
                    { cat: 'Software', pct: 28, color: '#C7F269' },
                    { cat: 'Food', pct: 20, color: '#2D5F57' },
                    { cat: 'Other', pct: 14, color: '#ECECEC' },
                  ].map(({ cat, pct, color }) => (
                    <div key={cat} className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 w-14 shrink-0">{cat}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 w-8 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent expenses */}
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-2">Recent</p>
              {[
                { desc: 'AWS Services', cat: 'Software', amt: '₹12,400', date: 'Today' },
                { desc: 'Team Lunch', cat: 'Food', amt: '₹3,200', date: 'Yesterday' },
                { desc: 'Flight — BLR', cat: 'Travel', amt: '₹18,000', date: '22 Sep' },
              ].map(({ desc, cat, amt, date }) => (
                <div key={desc} className="flex items-center justify-between py-2 border-b border-skipense-mist last:border-0">
                  <div>
                    <p className="text-[11px] font-medium text-skipense-ink">{desc}</p>
                    <p className="text-[10px] text-slate-400">{date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-skipense-ink">{amt}</p>
                    <span className="text-[9px] bg-skipense-mist px-2 py-0.5 rounded-full text-slate-500">{cat}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating rating card */}
            <div
              className="absolute -bottom-4 -left-4 md:bottom-6 md:-left-8 bg-white rounded-2xl shadow-card px-4 py-3 z-20"
              aria-label="User rating: 4.9 out of 5"
            >
              <Stars />
              <p className="text-xs font-bold text-skipense-ink mt-1">4.9/5 our users feedback</p>
              <p className="text-[10px] text-slate-400">Based on 2,400+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// C. Marquee feature strip
// ─────────────────────────────────────────────────────────────────────────────
function FeatureStrip() {
  const items = [
    'Invoices', 'Expense Reports', 'Travel Management',
    'Virtual Cards', 'Analytics', 'Team Budgets', 'OCR Receipts',
  ]
  // Duplicate for seamless loop
  const repeated = [...items, ...items]

  return (
    <section aria-label="Feature highlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <div className="bg-skipense-dark rounded-full py-4 px-6 overflow-hidden">
        <div className="animate-marquee">
          {repeated.map((item, i) => (
            <span key={i} className="flex items-center gap-3 mr-6 text-white font-medium text-sm whitespace-nowrap">
              <Zap size={14} className="text-skipense-lime shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// D. Feature suite
// ─────────────────────────────────────────────────────────────────────────────
function FeatureSuite() {
  return (
    <section id="features" className="py-20 md:py-32" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-14">
          <Pill>Features</Pill>
          <h2 id="features-heading" className="text-3xl md:text-5xl font-bold text-skipense-ink tracking-tight mb-4">
            Comprehensive Feature Suite
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Everything you need to manage expenses intelligently — from submission to reconciliation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl shadow-card p-8 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-skipense-mist rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={22} className="text-skipense-dark" />
            </div>
            <h3 className="font-bold text-skipense-ink text-xl mb-3">Spend Management</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Real-time visibility into every rupee spent across your organization. Set budgets, track overruns, and approve with one click.
            </p>
            <div className="mt-6 space-y-2">
              {['Category tracking', 'Budget alerts', 'Approval workflows'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-skipense-dark rounded-full" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl shadow-card p-8 hover:scale-[1.02] transition-transform duration-200">
            <div className="w-12 h-12 bg-skipense-mist rounded-2xl flex items-center justify-center mb-6">
              <CreditCard size={22} className="text-skipense-dark" />
            </div>
            <h3 className="font-bold text-skipense-ink text-xl mb-3">Skipense Card</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Issue virtual and physical cards to your team. Set per-card limits, merchant categories, and auto-reconcile with expenses.
            </p>
            <div className="mt-6 space-y-2">
              {['Virtual cards', 'Merchant controls', 'Auto-reconcile'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-skipense-dark rounded-full" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 — dark */}
          <div className="bg-skipense-dark rounded-3xl p-8 hover:scale-[1.02] transition-transform duration-200 flex flex-col">
            <div className="w-12 h-12 bg-skipense-lime/20 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={22} className="text-skipense-lime" />
            </div>
            <h3 className="font-bold text-white text-xl mb-3">Instant Virtual Card Access</h3>
            <p className="text-skipense-mist/70 text-sm leading-relaxed flex-1">
              Approve a purchase, issue a card — in 30 seconds. No paperwork. No waiting for finance.
            </p>
            <div className="mt-6 space-y-2 mb-8">
              {['30-second issuance', 'Single-use cards', 'Auto-expire after use'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-skipense-mist/60">
                  <div className="w-1.5 h-1.5 bg-skipense-lime rounded-full" />
                  {f}
                </div>
              ))}
            </div>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-skipense-lime text-skipense-ink font-bold text-sm px-5 py-3 rounded-full hover:scale-[1.03] transition-transform duration-200 self-start"
            >
              Get started <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// E. Testimonials
// ─────────────────────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      quote: "Skipense cut our month-end reconciliation from 3 days to 2 hours. The category breakdown alone is worth it.",
      name: "Ananya R.",
      role: "Head of Finance, NovaTech",
      initials: "AR",
    },
    {
      quote: "The dashboard mockup sold our CFO before we even showed him the live app. Solid product.",
      name: "Milton Lakhani",
      role: "CTO, Pivotal Works",
      initials: "ML",
      featured: true,
    },
    {
      quote: "Our remote team submits expenses in real-time now. No more chasing receipts at month end.",
      name: "Priya Sood",
      role: "Operations Lead, Cascade",
      initials: "PS",
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-skipense-mist/40" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center mb-14">
          <Pill>Testimonials</Pill>
          <h2 id="testimonials-heading" className="text-3xl md:text-5xl font-bold text-skipense-ink tracking-tight mb-4">
            What our Clients<br />Say About Us
          </h2>
          <p className="text-slate-500 leading-relaxed">
            Trusted by finance teams at over 400 companies worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {testimonials.map(({ quote, name, role, initials, featured }) => (
            <div
              key={name}
              className={`rounded-3xl p-8 ${
                featured
                  ? 'bg-skipense-dark text-white shadow-[0_20px_60px_rgba(17,35,32,0.15)] scale-[1.03]'
                  : 'bg-white shadow-card'
              }`}
            >
              <Stars />
              <blockquote className={`mt-4 mb-6 text-sm leading-relaxed ${featured ? 'text-skipense-mist/80' : 'text-slate-600'}`}>
                &ldquo;{quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                  featured ? 'bg-skipense-lime text-skipense-ink' : 'bg-skipense-dark text-skipense-lime'
                }`}>
                  {initials}
                </div>
                <div>
                  <p className={`text-sm font-bold ${featured ? 'text-white' : 'text-skipense-ink'}`}>{name}</p>
                  <p className={`text-xs ${featured ? 'text-skipense-mist/60' : 'text-slate-400'}`}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// F. Integrations — orbital layout
// ─────────────────────────────────────────────────────────────────────────────
function Integrations() {
  const tools = [
    { name: 'Xero', color: '#13B5EA' },
    { name: 'QuickBooks', color: '#2CA01C' },
    { name: 'Slack', color: '#4A154B' },
    { name: 'Uber', color: '#000000' },
    { name: 'Oracle', color: '#F80000' },
    { name: 'SAP', color: '#0070F2' },
    { name: 'Stripe', color: '#635BFF' },
    { name: 'Notion', color: '#000000' },
  ]

  return (
    <section className="py-20 md:py-32" aria-labelledby="integrations-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center mb-16">
          <Pill>Roadmap</Pill>
          <h2 id="integrations-heading" className="text-3xl md:text-5xl font-bold text-skipense-ink tracking-tight mb-4">
            Coming soon: Connect with over 40 popular tools
          </h2>
          <p className="text-slate-500 leading-relaxed">
            We are actively building integrations to plug Skipense into your existing stack.
          </p>
        </div>

        {/* Orbital layout */}
        <div className="relative flex items-center justify-center" style={{ height: 360 }}>
          {/* Orbit ring */}
          <div
            aria-hidden="true"
            className="absolute w-64 h-64 rounded-full border border-dashed border-skipense-mist"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          />

          {/* Center logo */}
          <div className="relative z-10 flex flex-col items-center justify-center shadow-card">
            <img src="/logo.png" alt="Skipense" className="w-16 h-16 object-contain rounded-2xl" />
          </div>

          {/* Orbiting badges */}
          {tools.map((tool, i) => {
            const angle = (i / tools.length) * 360
            const rad   = (angle * Math.PI) / 180
            const r     = 128 // orbit radius in px
            const x     = Math.cos(rad) * r
            const y     = Math.sin(rad) * r
            return (
              <div
                key={tool.name}
                aria-label={tool.name}
                className="absolute bg-white rounded-xl shadow-card px-3 py-2 text-xs font-bold flex items-center gap-1.5"
                style={{
                  left:      `calc(50% + ${x}px)`,
                  top:       `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: tool.color }}
                />
                {tool.name}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// G. FAQ accordion
// ─────────────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null)
  const [search, setSearch] = useState('')

  const faqs = [
    { q: 'What is Skipense?', a: 'Skipense is a business expense tracker built for modern teams. Submit, approve, and analyse expenses from a single dashboard — no spreadsheets required.' },
    { q: 'What does Skipense integrate with?', a: 'We are currently building integrations with over 40 popular tools including Xero, QuickBooks, Slack, and Stripe. These will be available in our upcoming releases.' },
    { q: 'Can Skipense help with compliance?', a: 'Yes. Skipense enforces spending policies at the point of purchase, captures digital receipts, and generates audit-ready reports for your finance team and auditors.' },
    { q: 'What kind of expenses can I track?', a: 'Any business expense: travel, accommodation, meals, software subscriptions, marketing spend, utilities, and more. You can create custom categories too.' },
    { q: 'How quickly can I get set up?', a: 'Most teams are tracking expenses within 15 minutes. Create an account, invite your team, and start submitting — no IT involvement required.' },
    { q: 'How much does it cost?', a: 'Skipense is free for individuals and small teams. Paid plans with advanced features like approval workflows and ERP integrations start at ₹499/month.' },
    { q: "Can I use Skipense if my company doesn't?", a: "Absolutely. Individuals use Skipense to track personal business expenses, freelance income, and tax-deductible items. Sign up solo — upgrade when your team's ready." },
    { q: 'How do I get started?', a: "Click 'Get Started', enter your email, and you'll be in the dashboard in under 60 seconds. No credit card, no setup calls, no salesperson." },
  ]

  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  // Split into 2 columns
  const col1 = filtered.slice(0, Math.ceil(filtered.length / 2))
  const col2 = filtered.slice(Math.ceil(filtered.length / 2))

  function Item({ faq, idx }) {
    const isOpen = open === faq.q
    return (
      <div className="border-b border-skipense-mist last:border-0">
        <button
          id={`faq-toggle-${idx}`}
          aria-expanded={isOpen}
          onClick={() => setOpen(isOpen ? null : faq.q)}
          className="w-full flex items-center justify-between py-5 text-left gap-4"
        >
          <span className="text-sm font-bold text-skipense-ink">{faq.q}</span>
          <span className="shrink-0 text-skipense-dark">
            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
          </span>
        </button>
        <div className={`faq-content ${isOpen ? 'open' : ''}`}>
          <div className="faq-inner">
            <p className="text-sm text-slate-500 leading-relaxed pb-5">{faq.a}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="faq" className="py-20 md:py-32 bg-skipense-mist/40" aria-labelledby="faq-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center mb-10">
          <Pill>FAQ</Pill>
          <h2 id="faq-heading" className="text-3xl md:text-5xl font-bold text-skipense-ink tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Everything you need to know about Skipense.
          </p>

          {/* Search */}
          <input
            id="faq-search"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full bg-white rounded-full px-5 py-3 text-sm text-skipense-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-skipense-dark/20 shadow-soft transition"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">No results for &ldquo;{search}&rdquo;</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 bg-white rounded-3xl shadow-card p-8">
            <div>
              {col1.map((faq, i) => <Item key={faq.q} faq={faq} idx={i} />)}
            </div>
            <div>
              {col2.map((faq, i) => <Item key={faq.q} faq={faq} idx={i + col1.length} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// H. CTA banner
// ─────────────────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-20 md:py-32" aria-label="Call to action">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-skipense-dark rounded-3xl px-8 py-14 md:px-16 md:py-20 overflow-hidden">
          {/* Lime accent shape */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 w-64 h-64 bg-skipense-lime rounded-full opacity-10 translate-x-1/3 -translate-y-1/3"
          />
          <div
            aria-hidden="true"
            className="absolute right-12 top-8 w-32 h-32 bg-skipense-lime rounded-full opacity-20"
          />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Simplify Expense Management
            </h2>
            <p className="text-skipense-mist/70 text-base md:text-lg leading-relaxed mb-8">
              Join 10,000+ businesses that use Skipense to take control of their spending. Start free today.
            </p>
            <form
              onSubmit={e => { e.preventDefault(); window.location.href = '/signup' }}
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input
                id="cta-email"
                type="email"
                placeholder="Enter your work email"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-skipense-lime/40 transition text-sm"
              />
              <Link
                to="/signup"
                className="bg-skipense-lime text-skipense-ink font-bold text-sm px-6 py-3.5 rounded-full hover:scale-[1.03] transition-transform duration-200 text-center whitespace-nowrap"
              >
                Try It Free
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Landing — assembles all sections
// ─────────────────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureStrip />
        <FeatureSuite />
        <Testimonials />
        <Integrations />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
