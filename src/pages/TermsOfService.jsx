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
        <div className="space-y-8 text-slate-600 text-base leading-relaxed">
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

export default function TermsOfService() {
  return (
    <PageShell badge="Legal" title="Terms of Service" updated="23 September 2026">
      <p>
        By accessing or using Skipense (operated by Skittex Studio), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
      </p>

      <Section title="1. Use of Service">
        <p>
          Skipense is a business expense tracking application. You may use it for lawful business expense management. You agree not to:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Use the service for any unlawful purpose or to violate any regulations.</li>
          <li>Attempt to gain unauthorised access to other users' data.</li>
          <li>Reverse engineer, decompile, or disassemble the application.</li>
          <li>Upload malicious code, viruses, or any content that disrupts the service.</li>
        </ul>
      </Section>

      <Section title="2. Account Responsibility">
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activity that occurs under your account. Notify us immediately at <a href="mailto:security@skittex.in" className="text-skipense-dark font-medium hover:underline">security@skittex.in</a> if you suspect unauthorised access.
        </p>
      </Section>

      <Section title="3. Data Ownership">
        <p>
          You retain full ownership of all expense data you enter into Skipense. We do not claim any intellectual property rights over your data. We act as a data processor on your behalf.
        </p>
      </Section>

      <Section title="4. Service Availability">
        <p>
          We strive for high availability but do not guarantee uninterrupted access. We may suspend or terminate the service with reasonable notice for maintenance, security, or operational reasons. We are not liable for any loss resulting from service interruptions.
        </p>
      </Section>

      <Section title="5. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Skittex Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of Skipense. Our total liability shall not exceed the amount you paid us in the twelve months prior to the claim.
        </p>
      </Section>

      <Section title="6. Termination">
        <p>
          We may terminate or suspend your account immediately, without prior notice, if you breach these Terms. Upon termination, your right to use the service ceases immediately. You may request export of your data within 30 days of termination.
        </p>
      </Section>

      <Section title="7. Governing Law">
        <p>
          These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          Questions? Reach us at <a href="https://skittex.in" target="_blank" rel="noopener noreferrer" className="text-skipense-dark font-medium hover:underline">skittex.in</a> or email <a href="mailto:legal@skittex.in" className="text-skipense-dark font-medium hover:underline">legal@skittex.in</a>.
        </p>
      </Section>
    </PageShell>
  )
}
