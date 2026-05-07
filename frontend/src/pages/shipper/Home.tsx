export default function ShipperHome() {
    return (
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Good morning 👋
        </h2>
        <p style={{ color: "#555", marginBottom: "2rem" }}>
          Here is what is happening with your shipments
        </p>
  
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Active Shipments", value: "0", color: "#f97316" },
            { label: "Pending Bids",     value: "0", color: "#3b82f6" },
            { label: "Completed",        value: "0", color: "#22c55e" },
            { label: "Total Spent",      value: "₹0", color: "#a855f7" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: "1.2rem" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "0.8rem", color: "#555", marginTop: "0.3rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
  
        {/* Quick action */}
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Ready to ship something?</h3>
            <p style={{ color: "#555", fontSize: "0.9rem" }}>Post a shipment and get bids from nearby truckers</p>
          </div>
          <button style={{ padding: "0.8rem 1.5rem", background: "#f97316", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            + Post Shipment
          </button>
        </div>
      </div>
    )
  }