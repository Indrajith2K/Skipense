import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function PageShell({ badge, title, updated, children }) {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="inline-flex items-center bg-skipense-lime text-skipense-ink text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
          {badge}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-skipense-ink tracking-tight mb-3">{title}</h1>
        <p className="text-sm text-slate-400 mb-12">Last updated: {updated}</p>
        <div className="prose-skipense space-y-8 text-slate-600 text-base leading-relaxed">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-skipense-ink mb-3">{title}</h2>
      {children}
    </section>
  )
}

export default function PrivacyPolicy() {
  return (
    <PageShell badge="Legal" title="Privacy Policy" updated="23 September 2026">
      <p>
        Skipense ("we", "us", or "our") is operated by Skittex Studio. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application at skipense.app.
      </p>

      <Section title="1. Information We Collect">
        <p>We collect information you provide directly to us:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Account information:</strong> email address and password (hashed) when you register.</li>
          <li><strong>Expense data:</strong> amounts, dates, categories, and descriptions you enter.</li>
          <li><strong>Usage data:</strong> pages visited, features used, timestamps — collected automatically.</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Provide, operate, and maintain the Skipense service.</li>
          <li>Authenticate your account and enforce security via Row Level Security (RLS).</li>
          <li>Send transactional emails (password reset, account notifications).</li>
          <li>Improve and analyse product usage patterns — aggregated and anonymised.</li>
        </ul>
      </Section>

      <Section title="3. Data Storage and Security">
        <p>
          Your data is stored on Supabase infrastructure in the Asia-Pacific region. We enforce Row Level Security on every database table — your expense data is cryptographically isolated from other users at the database layer. Passwords are never stored in plaintext; they are hashed using bcrypt by Supabase Auth.
        </p>
      </Section>

      <Section title="4. Data Sharing">
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share aggregated, non-personally identifiable information for analytical purposes. We use Supabase as our infrastructure provider; their privacy policy applies to data processed on their platform.
        </p>
      </Section>

      <Section title="5. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your account and all associated data.</li>
          <li>Export your expense data at any time from the dashboard.</li>
        </ul>
        <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:privacy@skittex.in" className="text-skipense-dark font-medium hover:underline">privacy@skittex.in</a>.</p>
      </Section>

      <Section title="6. Cookies">
        <p>
          We use essential cookies to maintain your authentication session. We do not use advertising or tracking cookies. See our <a href="/cookies" className="text-skipense-dark font-medium hover:underline">Cookie Policy</a> for details.
        </p>
      </Section>

      <Section title="7. Contact">
        <p>
          Questions about this policy? Reach us at{' '}
          <a href="https://skittex.in" target="_blank" rel="noopener noreferrer" className="text-skipense-dark font-medium hover:underline">skittex.in</a>{' '}
          or email <a href="mailto:legal@skittex.in" className="text-skipense-dark font-medium hover:underline">legal@skittex.in</a>.
        </p>
      </Section>
    </PageShell>
  )
}
