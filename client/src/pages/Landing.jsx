import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { ArrowRight, QrCode, Bell, MapPin, Shield, Zap, Heart, Star, Scan, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'

const STEPS = [
  {
    step: '01',
    icon: <Shield size={32} className="text-dark" />,
    title: 'Register Your Items',
    desc: "Create an account and register anything you own — keys, phone, laptop, bag. Every item gets a unique identity in FindIt's secure database.",
    variant: 'lime',
  },
  {
    step: '02',
    icon: <QrCode size={32} className="text-white" />,
    title: 'Generate & Attach QR',
    desc: 'Download a branded QR code label for each item. Print it, stick it on, and forget about it. That small sticker is your safety net.',
    variant: 'dark',
  },
  {
    step: '03',
    icon: <Bell size={32} className="text-dark" />,
    title: 'Get Notified Instantly',
    desc: 'When a finder scans your QR code, they fill out a quick form. You receive an instant email with their contact info and location.',
    variant: 'light',
  },
]

const FEATURES = [
  { icon: <Shield size={24} />, title: 'Privacy First', desc: 'Finders never see your personal details. Your identity stays protected at all times.', variant: 'dark' },
  { icon: <MapPin size={24} />, title: 'GPS Location', desc: 'Finders can optionally share their GPS coordinates so you know exactly where to go.', variant: 'lime' },
  { icon: <Zap size={24} />, title: 'Instant Alerts', desc: 'Email notifications delivered the moment someone submits a found report for your item.', variant: 'dark' },
  { icon: <Heart size={24} />, title: 'Peace of Mind', desc: 'Stop worrying. Know that even if something is lost, you have a way to get it back.', variant: 'light' },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Teacher',
    text: 'I lost my keys at a park. Someone scanned the QR and within minutes I got an email. Got them back the same day!',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Photographer',
    text: 'My camera bag went missing at an event. FindIt saved me — the finder scanned it and I tracked it down in 20 minutes.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Student',
    text: 'I put a QR tag on my laptop. When I forgot it at a cafe, the staff scanned it and I was notified right away.',
    rating: 5,
  },
]

const STATS = [
  { value: '100%', label: 'Privacy Protected' },
  { value: '< 1min', label: 'Alert Delivery' },
  { value: 'Free', label: 'Always & Forever' },
  { value: '0 Apps', label: 'Finder Needs None' },
]

const StarRating = ({ count }) => (
  <div className="flex gap-1 mb-3">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={16} fill="#B9FF66" className="text-lime" />
    ))}
  </div>
)

const Landing = () => {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-24">
        {/* Decorative background circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-[-200px] w-[600px] h-[600px] rounded-full border border-white/5" />
          <div className="absolute top-40 right-[-100px] w-[400px] h-[400px] rounded-full border border-white/5" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-lime/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-lime/10 border border-lime/20 text-lime text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-lime rounded-full animate-pulse" />
                Smart QR-Based Recovery Platform
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                Never Lose<br />
                <span className="text-lime">Your Things</span><br />
                Again.
              </h1>

              <p className="text-lg text-white/60 max-w-lg mb-8 leading-relaxed">
                Attach a FindIt QR code to your valuables. When someone finds your
                lost item, they scan it and you're <strong className="text-white">instantly notified</strong> —
                no app required for the finder.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/register" className="btn-primary text-base px-8 py-4 text-lg rounded-xl">
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="btn-secondary text-base px-8 py-4 text-lg rounded-xl">
                  Sign In
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex gap-8 flex-wrap">
                {STATS.map(stat => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-lime">{stat.value}</div>
                    <div className="text-xs text-white/40 mt-0.5 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Video card */}
            <div className="animate-fade-in relative">
              {/* Decorative stars */}
              <div className="absolute -top-6 -left-6 w-12 h-12 text-lime animate-spin-slow flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="#B9FF66" className="w-10 h-10">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
              </div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 text-lime animate-pulse">
                <svg viewBox="0 0 24 24" fill="#B9FF66" className="w-8 h-8">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
              </div>

              <div className="relative bg-card-dark rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl aspect-video">
                <video
                  src="https://videotourl.com/videos/1782086808198-fe3f8030-4658-4186-84a8-b0e8b8f5eaff.mp4"
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                  title="How FindIt Opens and Functions"
                />
                <div className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-inset ring-white/10" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 left-6 bg-lime text-dark font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm">
                <CheckCircle size={18} />
                No App Required for Finder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted By / Logos Marquee ── */}
      <section className="py-10 border-y border-white/8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 text-center">
          <p className="text-white/30 text-sm font-medium uppercase tracking-widest">Works with everything you own</p>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="marquee-track flex gap-12 items-center whitespace-nowrap px-8">
            {['🔑 Keys', '💻 Laptop', '📱 Phone', '🎒 Backpack', '👜 Wallet', '📷 Camera', '🎸 Instruments', '🔑 Keys', '💻 Laptop', '📱 Phone', '🎒 Backpack', '👜 Wallet', '📷 Camera', '🎸 Instruments'].map((item, i) => (
              <span key={i} className="text-white/40 font-semibold text-base flex-shrink-0 hover:text-lime transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services / How It Works ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="section-tag mb-4 inline-block">How It Works</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white max-w-md">
                Three Simple Steps to Safety
              </h2>
            </div>
            <p className="text-white/50 max-w-xs text-sm leading-relaxed md:text-right">
              From setup to recovery in minutes. No complicated process, no app downloads needed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => {
              const isLime = s.variant === 'lime'
              const isDark = s.variant === 'dark'
              const isLight = s.variant === 'light'
              return (
                <div
                  key={s.step}
                  className={`rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-2 card-glow group ${
                    isLime ? 'bg-lime border-lime' :
                    isDark ? 'bg-card-dark border-white/10' :
                    'bg-card-light border-black/10'
                  }`}
                >
                  <div className={`text-6xl font-bold mb-6 ${isLime ? 'text-dark/30' : isDark ? 'text-white/10' : 'text-black/10'}`}>
                    {s.step}
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                    isLime ? 'bg-dark/10' : isDark ? 'bg-lime/10' : 'bg-black/10'
                  }`}>
                    <div className={isLime ? 'text-dark' : isDark ? 'text-lime' : 'text-dark'}>
                      {s.icon}
                    </div>
                  </div>
                  <h3 className={`font-display text-xl font-bold mb-3 ${isLime ? 'text-dark' : isDark ? 'text-white' : 'text-dark'}`}>
                    {s.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isLime ? 'text-dark/70' : isDark ? 'text-white/50' : 'text-dark/60'}`}>
                    {s.desc}
                  </p>
                  <div className={`mt-6 flex items-center gap-2 text-sm font-semibold ${isLime ? 'text-dark' : isDark ? 'text-lime' : 'text-dark'}`}>
                    <ArrowRight size={16} />
                    Learn more
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-card-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="section-tag mb-4 inline-block">Why FindIt</span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white max-w-sm">
                Built for Peace of Mind
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => {
              const isLime = f.variant === 'lime'
              const isDark = f.variant === 'dark'
              return (
                <div
                  key={f.title}
                  className={`rounded-3xl p-7 border-2 transition-all duration-300 hover:-translate-y-2 card-glow ${
                    isLime ? 'bg-lime border-lime' :
                    isDark ? 'bg-card-dark border-white/10' :
                    'bg-card-light border-black/10'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                    isLime ? 'bg-dark text-lime' : isDark ? 'bg-lime/10 text-lime' : 'bg-dark text-lime'
                  }`}>
                    {f.icon}
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${isLime ? 'text-dark' : isDark ? 'text-white' : 'text-dark'}`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isLime ? 'text-dark/70' : isDark ? 'text-white/50' : 'text-dark/60'}`}>
                    {f.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-14">
            <span className="section-tag mb-4 inline-block">Testimonials</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white max-w-md">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-1 card-glow ${
                  i === 1 ? 'bg-lime border-lime' : 'bg-card-dark border-white/10'
                }`}
              >
                <StarRating count={t.rating} />
                <p className={`text-sm leading-relaxed mb-6 ${i === 1 ? 'text-dark/80' : 'text-white/60'}`}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    i === 1 ? 'bg-dark text-lime' : 'bg-lime text-dark'
                  }`}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${i === 1 ? 'text-dark' : 'text-white'}`}>{t.name}</div>
                    <div className={`text-xs ${i === 1 ? 'text-dark/60' : 'text-white/40'}`}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-lime rounded-4xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-dark mb-4">
                Start Protecting Your<br />Valuables Today
              </h2>
              <p className="text-dark/60 text-lg">
                Join FindIt and never lose anything permanently again. It's free — forever.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-dark text-white font-bold px-10 py-5 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 text-lg"
              >
                Get Started Free <ArrowRight size={22} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion (Positivus-style) ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-2/5">
              <span className="section-tag mb-4 inline-block">FAQ</span>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Everything you need to know about FindIt and how it works.
              </p>
            </div>
            <div className="md:w-3/5 space-y-4">
              {[
                { q: 'Does the finder need to download an app?', a: 'No! The finder simply scans the QR code with any smartphone camera. No app, no account needed.' },
                { q: 'Is my personal information safe?', a: 'Absolutely. Finders never see your name, email, or phone number. All communication goes through our secure system.' },
                { q: 'How fast will I be notified?', a: 'Notifications are sent within seconds of a finder submitting the form. Usually under 1 minute.' },
                { q: 'Is FindIt really free?', a: 'Yes, 100% free. No premium tiers, no credit card required, no hidden fees.' },
              ].map((faq, i) => (
                <details key={i} className="group bg-card-dark border border-white/10 rounded-2xl overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer text-white font-semibold hover:text-lime transition-colors list-none">
                    {faq.q}
                    <span className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0 ml-4 group-open:bg-lime group-open:text-dark transition-all">
                      <span className="text-lg font-light group-open:hidden">+</span>
                      <span className="text-lg font-light hidden group-open:block">−</span>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-white/50 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact / CTA bottom ── */}
      <section className="py-20 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-card-dark rounded-4xl p-12 text-center border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-3 h-3 bg-lime rounded-full animate-pulse" />
              <span className="text-lime text-sm font-semibold uppercase tracking-widest">Let's make it happen</span>
            </div>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Contact Us Today
            </h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">
              Have questions or want to learn more about how FindIt can help you protect your valuables?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary px-8 py-4 text-lg rounded-xl">
                Get Your Free Account <ArrowRight size={20} />
              </Link>
              <a href="mailto:hello@findit.app" className="btn-secondary px-8 py-4 text-lg rounded-xl">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark border-t border-white/8 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime rounded-xl flex items-center justify-center text-dark text-lg font-bold">
                <Scan size={22} />
              </div>
              <span className="font-display font-bold text-white text-xl">FindIt</span>
            </div>
            <nav className="flex gap-6 text-white/40 text-sm">
              <Link to="/" className="hover:text-lime transition-colors">Home</Link>
              <Link to="/login" className="hover:text-lime transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-lime transition-colors">Get Started</Link>
            </nav>
            <p className="text-white/30 text-sm">© {new Date().getFullYear()} FindIt. Never Lose Your Things Again.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
