import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { ArrowRight, QrCode, Bell, MapPin, Shield, Zap, Heart } from 'lucide-react'
import Navbar from '../components/Navbar'

const STEPS = [
  {
    step: '01',
    icon: <Shield size={28} className="text-primary-600" />,
    title: 'Register Your Items',
    desc: "Create an account and register anything you own — keys, phone, laptop, bag. Every item gets a unique identity in FindIt's secure database.",
  },
  {
    step: '02',
    icon: <QrCode size={28} className="text-accent-500" />,
    title: 'Generate & Attach QR',
    desc: 'Download a branded QR code label for each item. Print it, stick it on, and forget about it. That small sticker is your safety net.',
  },
  {
    step: '03',
    icon: <Bell size={28} className="text-warn-500" />,
    title: 'Get Notified Instantly',
    desc: 'When a finder scans your QR code, they fill out a quick form. You receive an instant email with their contact info and location.',
  },
]

const FEATURES = [
  { icon: <Shield size={20} />, title: 'Privacy First', desc: 'Finders never see your personal details. Your identity stays protected.' },
  { icon: <MapPin size={20} />, title: 'GPS Location', desc: 'Finders can optionally share their GPS location so you know exactly where to go.' },
  { icon: <Zap size={20} />, title: 'Instant Alerts', desc: 'Email notifications delivered the moment someone submits a found report.' },
  { icon: <Heart size={20} />, title: 'Peace of Mind', desc: 'Stop worrying. Know that even if something is lost, you have a way back.' },
]

const Landing = () => {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            Smart QR-Based Recovery Platform
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-ink leading-[1.1] mb-6 animate-slide-up">
            Never Lose Your<br />
            <span className="gradient-text">Things Again.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Attach a FindIt QR code to your valuables. When someone finds your lost item,
            they scan it and you're instantly notified — no app required for the finder.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="btn-primary text-base px-8 py-4 shadow-glow">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-4">
              Sign In to Dashboard
            </Link>
          </div>

          {/* Walkthrough Video */}
          <div className="mt-12 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-video animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <video
              src="https://videotourl.com/videos/1782086808198-fe3f8030-4658-4186-84a8-b0e8b8f5eaff.mp4"
              controls
              className="w-full h-full object-cover"
              title="How FindIt Opens and Functions"
            />
          </div>

          {/* Hero stats */}
          <div className="flex justify-center gap-8 mt-14 flex-wrap animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {[
              { value: '100%', label: 'Privacy Protected' },
              { value: '< 1min', label: 'Alert Delivery' },
              { value: 'Free', label: 'Always & Forever' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="font-display text-4xl font-extrabold text-ink">Three Simple Steps</h2>
            <p className="text-slate-500 mt-3 text-lg max-w-xl mx-auto">From setup to recovery in minutes. No complicated setup, no app downloads.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div
                key={s.step}
                className="card p-8 text-center group hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-slate-300 tracking-widest mb-2">{s.step}</div>
                <h3 className="font-display text-xl font-bold text-ink mb-3">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Why FindIt</p>
            <h2 className="font-display text-4xl font-extrabold text-ink">Built for Peace of Mind</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6 group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-blue-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-extrabold text-white mb-4">
            Start Protecting Your Valuables Today
          </h2>
          <p className="text-primary-200 text-lg mb-8">
            Join FindIt and never lose anything permanently again.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-10 py-4 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-lg"
          >
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-slate-400 py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">🔍</span>
          <span className="font-display font-bold text-white text-xl">FindIt</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} FindIt. Never Lose Your Things Again.</p>
      </footer>
    </div>
  )
}

export default Landing
