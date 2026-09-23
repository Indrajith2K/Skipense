import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const posts = [
  {
    slug:     'why-rls-is-better-than-app-level-security',
    tag:      'Engineering',
    title:    'Why Row Level Security beats application-level filtering',
    excerpt:  'Most apps filter user data in JavaScript. We explain why Postgres RLS is fundamentally more secure — and why you should never trust your own frontend code to enforce data isolation.',
    date:     '20 Sep 2026',
    readTime: '6 min read',
    initials: 'AN',
    author:   'Arjun Nair',
  },
  {
    slug:     'building-optimistic-ui-with-supabase',
    tag:      'Product',
    title:    'Building optimistic UI with Supabase and React',
    excerpt:  'Waiting for a network round trip before updating the UI is a UX anti-pattern. We walk through how Skipense achieves instant-feeling mutations with rollback on error.',
    date:     '15 Sep 2026',
    readTime: '5 min read',
    initials: 'DK',
    author:   'Dev Khanna',
  },
  {
    slug:     'expense-tracking-for-small-teams',
    tag:      'Business',
    title:    'Expense tracking for small teams: what actually matters',
    excerpt:  'After talking to 200+ small business owners, we found that 80% of their expense pain comes from just 3 problems. Here\'s what they are and how to solve them.',
    date:     '8 Sep 2026',
    readTime: '4 min read',
    initials: 'RM',
    author:   'Riya Mehta',
  },
  {
    slug:     'design-decisions-skipense-dashboard',
    tag:      'Design',
    title:    'The design decisions behind the Skipense dashboard',
    excerpt:  'Why we chose a 2-column layout, why the total lives in the top bar, and why we use `confirm()` for destructive actions instead of a modal. Every decision has a reason.',
    date:     '1 Sep 2026',
    readTime: '7 min read',
    initials: 'PS',
    author:   'Pooja Srivastava',
  },
  {
    slug:     'tailwind-v4-migration',
    tag:      'Engineering',
    title:    'Migrating to Tailwind v4: what changed and what didn\'t',
    excerpt:  'Tailwind v4 moves design tokens from tailwind.config.js to @theme in CSS. We walk through our migration experience and what junior devs need to know.',
    date:     '25 Aug 2026',
    readTime: '5 min read',
    initials: 'DK',
    author:   'Dev Khanna',
  },
  {
    slug:     'supabase-asia-pacific-performance',
    tag:      'Infrastructure',
    title:    'Why we chose Asia-Pacific for our Supabase region',
    excerpt:  'Latency matters for perceived performance. We explain our region selection process and show the p95 response time difference between AP and US regions for Indian users.',
    date:     '18 Aug 2026',
    readTime: '3 min read',
    initials: 'AN',
    author:   'Arjun Nair',
  },
]

const tagColors = {
  Engineering:    { bg: '#1B3530', text: '#C7F269' },
  Product:        { bg: '#C7F269', text: '#112320' },
  Business:       { bg: '#ECECEC', text: '#112320' },
  Design:         { bg: '#2D5F57', text: '#ffffff' },
  Infrastructure: { bg: '#112320', text: '#C7F269' },
}

export default function Blog() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center bg-skipense-lime text-skipense-ink text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Blog
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-skipense-ink tracking-tight mb-4">
              From the Skipense team
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              Engineering decisions, product thinking, and lessons from building a business expense tool used by thousands of teams.
            </p>
          </div>
        </section>

        {/* Featured post */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-skipense-dark rounded-3xl p-8 md:p-12">
            <span
              className="inline-flex text-xs font-bold px-3 py-1 rounded-full mb-5"
              style={{ backgroundColor: tagColors[posts[0].tag]?.bg, color: tagColors[posts[0].tag]?.text }}
            >
              {posts[0].tag}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">{posts[0].title}</h2>
            <p className="text-skipense-mist/70 leading-relaxed mb-6 max-w-2xl">{posts[0].excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-skipense-lime rounded-full flex items-center justify-center">
                  <span className="text-skipense-ink font-bold text-xs">{posts[0].initials}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{posts[0].author}</p>
                  <p className="text-skipense-mist/50 text-xs">{posts[0].date} · {posts[0].readTime}</p>
                </div>
              </div>
              {/* In a real app this would be <Link to={`/blog/${posts[0].slug}`}> */}
              <span className="text-skipense-lime text-sm font-medium">Read article →</span>
            </div>
          </div>
        </section>

        {/* Post grid */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.slice(1).map(post => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl shadow-card p-7 hover:scale-[1.01] transition-transform duration-200"
              >
                <span
                  className="inline-flex text-xs font-bold px-3 py-1 rounded-full mb-4"
                  style={{ backgroundColor: tagColors[post.tag]?.bg, color: tagColors[post.tag]?.text }}
                >
                  {post.tag}
                </span>
                <h2 className="font-bold text-skipense-ink text-lg leading-snug mb-3">{post.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-7 h-7 bg-skipense-dark rounded-full flex items-center justify-center">
                    <span className="text-skipense-lime font-bold text-[10px]">{post.initials}</span>
                  </div>
                  <div>
                    <p className="text-skipense-ink text-xs font-medium">{post.author}</p>
                    <p className="text-slate-400 text-[11px]">{post.date} · {post.readTime}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
