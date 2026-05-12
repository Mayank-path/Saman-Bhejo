import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authApi } from "../../api/auth.api"
import toast from "react-hot-toast"

export default function RegisterPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "shipper",

    vehicleType: "",
    vehicleNumber: "",
    vehicleCapacityTons: "",

    address: "",
    city: "",
    state: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...form,

        vehicleCapacityTons: Number(form.vehicleCapacityTons),

        location: {
          type: "Point",
          coordinates: [0, 0],
          address: form.address,
          city: form.city,
          state: form.state,
        },
      }

      await authApi.register(payload)

      toast.success("Account created successfully!")
      navigate("/login")

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background: "#f97316",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: "1.2rem",
                letterSpacing: "0.05em",
                color: "#fff",
              }}
            >
              LOADLINK
            </span>
          </div>

          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "0.5rem",
            }}
          >
            Create account
          </h1>

          <p style={{ color: "#555", fontSize: "0.9rem" }}>
            Join the LoadLink network
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}
        >

          {/* Name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#888",
                marginBottom: "0.5rem",
              }}
            >
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#888",
                marginBottom: "0.5rem",
              }}
            >
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#888",
                marginBottom: "0.5rem",
              }}
            >
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
              required
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#888",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={8}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Role */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#888",
                marginBottom: "0.5rem",
              }}
            >
              Account Type
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            >
              <option value="shipper">Shipper</option>
              <option value="trucker">Trucker</option>
            </select>
          </div>

          {/* Trucker Fields */}
          {form.role === "trucker" && (
            <>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "#888",
                    marginBottom: "0.5rem",
                  }}
                >
                  Vehicle Type
                </label>

                <input
                  type="text"
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  placeholder="Truck, Container, Trailer..."
                  required
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "#888",
                    marginBottom: "0.5rem",
                  }}
                >
                  Vehicle Number
                </label>

                <input
                  type="text"
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  placeholder="PB10AB1234"
                  required
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "#888",
                    marginBottom: "0.5rem",
                  }}
                >
                  Capacity (Tons)
                </label>

                <input
                  type="number"
                  name="vehicleCapacityTons"
                  value={form.vehicleCapacityTons}
                  onChange={handleChange}
                  placeholder="10"
                  required
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </>
          )}

          {/* Address */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#888",
                marginBottom: "0.5rem",
              }}
            >
              Address
            </label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street address"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* City */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#888",
                marginBottom: "0.5rem",
              }}
            >
              City
            </label>

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Ludhiana"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* State */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#888",
                marginBottom: "0.5rem",
              }}
            >
              State
            </label>

            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Punjab"
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 8,
                color: "#fff",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.95rem",
              background: loading ? "#7a3a0a" : "#f97316",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "#555",
            fontSize: "0.9rem",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#f97316",
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link
            to="/"
            style={{
              color: "#333",
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}