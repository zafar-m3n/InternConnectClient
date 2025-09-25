import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";
import { clearToken } from "../lib/auth";
import { toast } from "react-toastify";
import Badge from "./Badge";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false); // mobile menu
  const [isProfileOpen, setIsProfileOpen] = useState(false); // desktop dropdown

  const profileRef = useRef(null);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    navigate("/login", { replace: true });
    toast.success("Logged out successfully");
  };

  const getNavLinks = () => {
    if (!user) return [];

    if (user.role === "student") {
      return [
        { to: "/student/dashboard", label: "Dashboard" },
        { to: "/student/profile", label: "Profile" },
        { to: "/student/internships", label: "Internships" },
        { to: "/student/applications", label: "Applications" },
        { to: "/notifications", label: "Notifications" },
      ];
    }

    if (user.role === "industry_liaison" || user.role === "liaison") {
      return [
        { to: "/industry/dashboard", label: "Dashboard" },
        { to: "/industry/internships", label: "Internships" },
        { to: "/industry/applicants", label: "Applicants" },
        { to: "/industry/cv-pending", label: "CV Queue" },
        { to: "/notifications", label: "Notifications" },
      ];
    }

    if (user.role === "super_admin") {
      return [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/tenants", label: "Tenants" },
        { to: "/admin/settings", label: "Settings" },
        { to: "/notifications", label: "Notifications" },
      ];
    }

    return [{ to: "/notifications", label: "Notifications" }];
  };

  const navLinks = getNavLinks();

  // active if exact match OR current path starts with it (excluding '/')
  const isPathActive = (to) => location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  const initials =
    user?.full_name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "U";

  // Close profile dropdown on outside click or ESC
  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setIsProfileOpen(false);
    };
    if (isProfileOpen) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isProfileOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">InternConnect</span>
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                {navLinks.map((link) => {
                  const active = isPathActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "text-primary-600 border-b-2 border-primary-600"
                          : "text-gray-700 hover:text-primary-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Profile initials -> dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((v) => !v)}
                    className="h-9 w-9 grid place-items-center rounded-full bg-gray-100 text-gray-700 text-xs font-semibold ring-1 ring-gray-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                    aria-label="Open profile menu"
                  >
                    {initials}
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-150 ${
                      isProfileOpen ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"
                    }`}
                    role="menu"
                  >
                    {/* Header */}
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 text-gray-700 grid place-items-center text-sm font-semibold ring-1 ring-gray-200">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-gray-900">{user.full_name}</div>
                          <div className="mt-1">
                            <Badge variant={user.role}>{user.role.replace("_", " ")}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Logout */}
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        role="menuitem"
                      >
                        <span>Logout</span>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 hover:text-primary-600"
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="px-3 py-2 flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 grid place-items-center text-xs font-semibold ring-1 ring-gray-200">
                    {initials}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm text-gray-900">{user.full_name}</span>
                    <div className="mt-0.5">
                      <Badge variant={user.role}>{user.role.replace("_", " ")}</Badge>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
