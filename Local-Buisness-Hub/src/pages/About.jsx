
export default function About() {

  return (
    <section aria-labelledby="about-heading" className="px-6 py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 id="about-heading" className="text-4xl font-extrabold text-slate-900 tracking-tight">
            About <span className="text-slate-700">LocalBusinessHub</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
            Helping local people find affordable rooms and homes for rent — easily and without stress.
          </p>
        </header>

        {/* Card */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 leading-relaxed">
          <p className="text-slate-700 text-lg mb-6">
            LocalBusinessHub is a local-first platform created to help people find{" "}
            <strong className="font-semibold">affordable rooms and rental homes</strong> in their preferred nearby areas.
            We understand that not everyone can afford high rent, and many people struggle to find a place that fits their
            budget and basic needs.
          </p>

          <p className="text-slate-700 text-base mb-6">
            Our platform is made especially for <strong>students, working professionals, small families,</strong> and anyone
            searching for a low-budget room or home close to their workplace or required location. Our goal is to make the
            renting process simple, transparent, and stress-free.
          </p>

          <p className="text-slate-700 text-base mb-6">
            In many areas, people face a common problem — <strong>they lack information about available rooms</strong>. Because
            of this, they walk house-to-house asking “<em>room available hai?</em>”, waste hours or even days searching, or
            move to another locality without knowing that an affordable room was actually available nearby. LocalBusinessHub is
            built to solve this real problem.
          </p>

          <p className="text-slate-700 text-base mb-6">
            We prioritize renting and ensure you get access to <strong>real listings, verified prices, and genuine owners</strong> —
            with no middlemen and no hidden charges. While we also allow property sale listings, our main focus will always remain{" "}
            <strong className="text-slate-800">affordable rentals for everyone</strong>.
          </p>

          <p className="text-slate-700 text-base mb-6">
            LocalBusinessHub is committed to helping our community find safe, budget-friendly homes and making the overall experience
            easy and rewarding for each and every user.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-slate-600">
              <strong className="text-slate-800">Want to list a property or ask a question?</strong>
              <div className="mt-1">Create a listing or contact us — we'll help you get started.</div>
            </div>
          </div>
        </article>
      </div>
    </section>

  )
}