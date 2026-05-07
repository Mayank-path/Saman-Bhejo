import React, { useEffect, useRef, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useSelector } from "react-redux"


import { logout } from "../../store/slices/authSlice"
import { authApi } from "../../api/auth.api"

import toast from "react-hot-toast"

interface NavItem {
  path: string
  label: string
  icon: string
}

interface Props {
  children: React.ReactNode
  navItems: NavItem[]
  title?: string
}

export default function DashboardLayout({
  children,
  navItems,
  title,
}: Props) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { user } = useSelector((state: any) => state.auth)
  const [open, setOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout API failed:", error)
    }

    dispatch(logout())

    toast.success("Logged out successfully")

    navigate("/login")
  }

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U"

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Top Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#0f0f0f",
          borderBottom: "1px solid #1a1a1a",
          padding: "0 1.5rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: "#f97316",
              borderRadius: "50%",
            }}
          />

          <span
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.05em",
            }}
          >
            LOADLINK
          </span>
        </div>

        {/* Title */}
        {title && (
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#d4d4d4",
            }}
            className="desktop-title"
          >
            {title}
          </div>
        )}

        {/* Desktop Navigation */}
        <div
          className="desktop-nav"
          style={{
            display: "flex",
            gap: "0.5rem",
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                padding: "0.45rem 0.9rem",
                borderRadius: 8,
                fontSize: "0.85rem",
                color: isActive ? "#f97316" : "#a1a1aa",
                background: isActive ? "#1a1a1a" : "transparent",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.2s ease",
              })}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* User Menu */}
        <div
          ref={dropdownRef}
          style={{
            position: "relative",
          }}
        >
          <button
            type="button"
            aria-label="User menu"
            onClick={(e) => {
              e.stopPropagation()
              setOpen((prev) => !prev)
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "#1a1a1a",
              border: "1px solid #222",
              borderRadius: 8,
              padding: "0.4rem 0.8rem",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: "#f97316",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {userInitial}
            </div>

            <span
              style={{
                maxWidth: 100,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name || "User"}
            </span>

            <span style={{ color: "#666" }}>▾</span>
          </button>

          {open && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                background: "#111",
                border: "1px solid #222",
                borderRadius: 10,
                padding: "0.5rem",
                minWidth: 180,
                maxWidth: "90vw",
                zIndex: 100,
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
              }}
            >
              <div
                style={{
                  padding: "0.5rem 0.8rem",
                  borderBottom: "1px solid #1a1a1a",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {user?.name || "Unknown User"}
                </div>

                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#777",
                    marginTop: "0.2rem",
                    wordBreak: "break-word",
                  }}
                >
                  {user?.email || "No Email"}
                </div>

                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#f97316",
                    marginTop: "0.35rem",
                    textTransform: "capitalize",
                  }}
                >
                  {user?.role || "User"}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "0.7rem 0.8rem",
                  background: "transparent",
                  border: "none",
                  color: "#ff4d4d",
                  fontSize: "0.85rem",
                  textAlign: "left",
                  cursor: "pointer",
                  borderRadius: 6,
                  transition: "background 0.2s ease",
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "1.5rem",
          paddingBottom: "80px",
        }}
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div
        className="mobile-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#0f0f0f",
          borderTop: "1px solid #1a1a1a",
          display: "flex",
          zIndex: 50,
          backdropFilter: "blur(10px)",
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.7rem 0",
              fontSize: "0.65rem",
              color: isActive ? "#f97316" : "#666",
              textDecoration: "none",
              gap: "0.2rem",
              transition: "all 0.2s ease",
            })}
          >
            <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 768px) {
          .mobile-nav {
            display: none !important;
          }

          .desktop-nav {
            display: flex !important;
          }

          .desktop-title {
            display: block !important;
          }
        }

        @media (max-width: 767px) {
          .mobile-nav {
            display: flex !important;
          }

          .desktop-nav {
            display: none !important;
          }

          .desktop-title {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}