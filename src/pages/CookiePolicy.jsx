import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-skipense-ink mb-3">{title}</h2>
      {children}
    </section>
  )
}

export default function CookiePolicy() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="inline-flex items-center bg-skipense-lime text-skipense-ink text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-skipense-ink tracking-tight mb-3">Cookie Policy</h1>
        <p className="text-sm text-slate-400 mb-12">Last updated: 23 September 2026</p>

        <div className="space-y-8 text-slate-600 text-base leading-relaxed">
          <p>
            Skipense (operated by Skittex Studio) uses cookies and similar technologies to provide a secure, functional experience. This policy explains what cookies we use and why.
          </p>

          <Section title="What Are Cookies?">
            <p>
              Cookies are small text files stored on your device by your browser. They are widely used to make websites work efficiently and to provide information to site owners.
            </p>
          </Section>

          <Section title="Cookies We Use">
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-skipense-mist">
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-widest text-slate-400 font-medium">Cookie</th>
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-widest text-slate-400 font-medium">Purpose</th>
                    <th className="text-left py-2 text-xs uppercase tracking-widest text-slate-400 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-skipense-mist">
                  {[
                    { name: 'sb-access-token',  purpose: 'Supabase auth session — keeps you logged in', duration: '1 hour' },
                    { name: 'sb-refresh-token', purpose: 'Refreshes your session without requiring re-login', duration: '60 days' },
                    { name: '__session',         purpose: 'CSRF protection token', duration: 'Session' },
                  ].map(c => (
                    <tr key={c.name}>
                      <td className="py-3 pr-4 font-mono text-xs text-skipense-dark">{c.name}</td>
                      <td className="py-3 pr-4">{c.purpose}</td>
                      <td className="py-3 text-slate-400">{c.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Cookies We Do NOT Use">
            <p>We do not use:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Advertising or tracking cookies</li>
              <li>Third-party analytics cookies (Google Analytics, Meta Pixel, etc.)</li>
              <li>Social media cookies</li>
            </ul>
          </Section>

          <Section title="Managing Cookies">
            <p>
              You can control cookies through your browser settings. Disabling authentication cookies will prevent you from staying logged in. The application will still function, but you'll need to sign in on every visit.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions? Email <a href="mailto:legal@skittex.in" className="text-skipense-dark font-medium hover:underline">legal@skittex.in</a> or visit <a href="https://skittex.in" target="_blank" rel="noopener noreferrer" className="text-skipense-dark font-medium hover:underline">skittex.in</a>.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  )
}
