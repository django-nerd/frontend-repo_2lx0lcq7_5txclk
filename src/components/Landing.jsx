import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div>
      <section className="bg-emerald-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">EcoPlates – Reduce Food Waste, Feed Communities</h1>
            <p className="mt-5 text-lg text-emerald-50">Connect donors, NGOs, and admins to match surplus food with those who need it most. Simple, fast, and sustainable.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup" className="inline-flex items-center px-5 py-3 rounded-md bg-white text-emerald-700 font-semibold hover:bg-emerald-50">Donate Food</Link>
              <Link to="/login" className="inline-flex items-center px-5 py-3 rounded-md bg-emerald-700 text-white font-semibold hover:bg-emerald-800">Find Food</Link>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><span className="font-bold">Mission:</span><span>End hunger by redistributing surplus food responsibly.</span></li>
              <li className="flex items-start gap-3"><span className="font-bold">How it works:</span><span>Donors post leftovers → NGOs request pickup → Admins oversee quality.</span></li>
              <li className="flex items-start gap-3"><span className="font-bold">Real-time:</span><span>Live updates on new donations and request statuses.</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-6">Impact at a glance</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <StatCard label="Total Donations" value="1,245" />
            <StatCard label="Meals Saved" value="18,900+" />
            <StatCard label="NGOs Helped" value="76" />
          </div>
        </div>
      </section>

      <section className="bg-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-emerald-900">Why EcoPlates?</h3>
            <p className="mt-4 text-emerald-800">We make it effortless for restaurants and individuals to donate safely while NGOs get instant visibility of nearby food.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-700">Role-based access ensures donors, NGOs, and admins see only what matters to them. Start by creating an account and choosing your role.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-gray-600">{label}</p>
      <p className="text-3xl font-extrabold mt-2 text-emerald-600">{value}</p>
    </div>
  )
}
