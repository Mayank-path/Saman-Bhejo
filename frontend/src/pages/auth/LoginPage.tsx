import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authApi } from "../../api/auth.api"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { setCredentials } from "../../store/slices/authSlice"
import toast from "react-hot-toast"

export default function LoginPage() {
  const navigate  = useNavigate()
  const dispatch  = useAppDispatch()

  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res  = await authApi.login(form)
      const { user, tokens } = res.data.data

      dispatch(setCredentials({ user, tokens }))
      toast.success(`Welcome back, ${user.name}!`)

      if (user.role === "shipper") navigate("/shipper")
      if (user.role === "trucker") navigate("/trucker")
      if (user.role === "admin")   navigate("/admin")

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>

      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 10, height: 10, background: "#f97316", borderRadius: "50%" }} />
            <span style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "0.05em", color: "#fff" }}>LOADLINK</span>
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>Welcome back</h1>
          <p style={{ color: "#555", fontSize: "0.9rem" }}>Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.5rem" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={{ width: "100%", padding: "0.85rem 1rem", background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.5rem" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{ width: "100%", padding: "0.85rem 1rem", background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: "0.95rem", background: loading ? "#7a3a0a" : "#f97316", border: "none", borderRadius: 8, color: "#fff", fontSize: "1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: "0.5rem" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", color: "#555", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#f97316", textDecoration: "none" }}>
            Create one
          </Link>
        </p>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/" style={{ color: "#333", fontSize: "0.85rem", textDecoration: "none" }}>
            ← Back to home
          </Link>
        </p>

      </div>
    </div>
  )
}
