import { useNavigate } from "react-router-dom"

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#ffffff", fontFamily: "'Georgia', serif" }}>

      {/* Navbar */}
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "1.2rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 10, height: 10, background: "#f97316", borderRadius: "50%" }} />
          <span style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "0.05em" }}>LOADLINK</span>
        </div>

        <div style={{ display: "flex", gap: "2rem", fontSize: "0.9rem" }}>
          <a href="#how" style={{ color: "#888", textDecoration: "none" }}>How it works</a>
          <a href="#truckers" style={{ color: "#888", textDecoration: "none" }}>For Truckers</a>
          <a href="#shippers" style={{ color: "#888", textDecoration: "none" }}>For Shippers</a>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => navigate("/login")}
            style={{ padding: "0.5rem 1.2rem", border: "1px solid #333", borderRadius: 6, background: "transparent", color: "#fff", fontSize: "0.9rem", cursor: "pointer" }}>
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{ padding: "0.5rem 1.2rem", background: "#f97316", border: "none", borderRadius: 6, color: "#fff", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "7rem 2rem 5rem" }}>
        <div style={{ display: "inline-block", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 20, padding: "0.3rem 1rem", fontSize: "0.75rem", color: "#f97316", marginBottom: "2rem", letterSpacing: "0.15em" }}>
          ● LIVE BIDDING PLATFORM
        </div>

        <h1 style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 700, lineHeight: 1.05, marginBottom: "1.5rem", maxWidth: 700 }}>
          Move Goods.<br />
          <span style={{ color: "#f97316" }}>Not Money.</span>
        </h1>

        <p style={{ fontSize: "1.15rem", color: "#666", maxWidth: 480, marginBottom: "3rem", lineHeight: 1.8 }}>
          Post your shipment. Get competitive bids from verified truckers within 100km. Pay only after safe delivery.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/register")}
            style={{ padding: "1rem 2rem", background: "#f97316", border: "none", borderRadius: 8, color: "#fff", fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
            Ship Your Goods →
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{ padding: "1rem 2rem", background: "transparent", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "1rem", cursor: "pointer" }}>
            I'm a Trucker
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "4rem", marginTop: "6rem", borderTop: "1px solid #1a1a1a", paddingTop: "3rem", flexWrap: "wrap" }}>
          {[
            { value: "2,400+", label: "Verified Truckers" },
            { value: "₹12Cr+", label: "Goods Moved"       },
            { value: "98%",    label: "On-time Delivery"   },
            { value: "100km",  label: "Live Radius Search"  },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: "2.2rem", fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: "0.85rem", color: "#555", marginTop: "0.3rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" style={{ background: "#0f0f0f", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", padding: "6rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: "#f97316", fontSize: "0.75rem", letterSpacing: "0.2em", marginBottom: "1rem" }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "4rem" }}>Simple. Fast. Secure.</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.5rem" }}>
            {[
              { step: "01", title: "Post Shipment",      desc: "Describe your goods, pickup and delivery location, and budget range." },
              { step: "02", title: "Receive Bids",        desc: "Verified truckers within 100km send competitive quotes instantly." },
              { step: "03", title: "Accept Best Bid",     desc: "Our scoring ranks by price, rating and reliability — not just cheapest." },
              { step: "04", title: "Pay After Delivery",  desc: "Money held in escrow. Released only after OTP delivery confirmation." },
            ].map((item) => (
              <div key={item.step} style={{ padding: "2rem", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12 }}>
                <div style={{ fontSize: "0.75rem", color: "#f97316", marginBottom: "1.2rem", letterSpacing: "0.15em" }}>{item.step}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.7rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Shippers */}
      <section id="shippers" style={{ maxWidth: 1100, margin: "0 auto", padding: "6rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <p style={{ color: "#f97316", fontSize: "0.75rem", letterSpacing: "0.2em", marginBottom: "1rem" }}>FOR SHIPPERS</p>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "1.5rem", lineHeight: 1.2 }}>Send goods with confidence</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                "Post shipment in under 2 minutes",
                "Get bids from verified truckers only",
                "Pay securely via escrow",
                "Track your shipment live",
                "OTP confirmation at delivery",
              ].map((point) => (
                <div key={point} style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#888", fontSize: "0.95rem" }}>
                  <div style={{ width: 6, height: 6, background: "#f97316", borderRadius: "50%", flexShrink: 0 }} />
                  {point}
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/register")}
              style={{ marginTop: "2rem", padding: "0.9rem 2rem", background: "#f97316", border: "none", borderRadius: 8, color: "#fff", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer" }}>
              Start Shipping
            </button>
          </div>

          <div style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 16, padding: "2rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#555", marginBottom: "1.5rem" }}>SAMPLE SHIPMENT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "1rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: "0.3rem" }}>PICKUP</div>
                <div style={{ fontSize: "0.95rem" }}>GT Road, Ludhiana, Punjab</div>
              </div>
              <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "1rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: "0.3rem" }}>DELIVERY</div>
                <div style={{ fontSize: "0.95rem" }}>Connaught Place, Delhi</div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1, background: "#1a1a1a", borderRadius: 8, padding: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: "0.3rem" }}>WEIGHT</div>
                  <div style={{ fontSize: "0.95rem" }}>2.5 Tons</div>
                </div>
                <div style={{ flex: 1, background: "#1a1a1a", borderRadius: 8, padding: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: "0.3rem" }}>BIDS</div>
                  <div style={{ fontSize: "0.95rem", color: "#f97316" }}>12 received</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Truckers */}
      <section id="truckers" style={{ background: "#0f0f0f", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", padding: "6rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: "#f97316", fontSize: "0.75rem", letterSpacing: "0.2em", marginBottom: "1rem" }}>FOR TRUCKERS</p>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "1rem" }}>Find loads near you</h2>
          <p style={{ color: "#555", marginBottom: "3rem", fontSize: "1rem" }}>See shipments within 100km of your location. Bid on what suits you.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {[
              { title: "Live Loads",       desc: "See shipments posted near you in real time"          },
              { title: "Fair Bidding",     desc: "Compete on price and reliability, not just price"    },
              { title: "Secure Payment",   desc: "Get paid directly after delivery confirmation"       },
              { title: "Build Reputation", desc: "Ratings and on-time delivery boost your bids"       },
            ].map((item) => (
              <div key={item.title} style={{ padding: "1.5rem", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12 }}>
                <div style={{ width: 8, height: 8, background: "#f97316", borderRadius: "50%", marginBottom: "1rem" }} />
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/register")}
            style={{ marginTop: "3rem", padding: "0.9rem 2rem", background: "transparent", border: "1px solid #f97316", borderRadius: 8, color: "#f97316", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer" }}>
            Register as Trucker
          </button>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "7rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "1rem" }}>Ready to get started?</h2>
        <p style={{ color: "#555", marginBottom: "2.5rem", fontSize: "1rem" }}>Join thousands of shippers and truckers already on the platform.</p>
        <button
          onClick={() => navigate("/register")}
          style={{ padding: "1rem 2.5rem", background: "#f97316", border: "none", borderRadius: 8, color: "#fff", fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "2rem", textAlign: "center", color: "#333", fontSize: "0.85rem" }}>
        © 2026 LoadLink. Built for India's logistics ecosystem.
      </footer>

    </div>
  )
}