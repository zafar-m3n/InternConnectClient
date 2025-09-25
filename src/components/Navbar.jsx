import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";
import { clearToken } from "../lib/auth";
import { toast } from "react-toastify";
import Button from "./Button";
import Badge from "./Badge";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // helper: path is active if exact match OR current path starts with it (excluding '/')
  const isPathActive = (to) => location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">InternConnect</span>
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
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

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">{user.full_name}</span>
                    <Badge variant={user.role}>{user.role.replace("_", " ")}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
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
                  <span className="text-sm text-gray-700">{user.full_name}</span>
                  <Badge variant={user.role}>{user.role.replace("_", " ")}</Badge>
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
