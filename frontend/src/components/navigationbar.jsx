import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-20 border-b border-violet-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link to="/events" className="brand"><span className="brand-mark">✦</span>GiftWise</Link>
        {user ? <>
          <div className="order-3 flex w-full gap-1 text-sm sm:order-none sm:w-auto sm:flex-1">
            {[["/events", "My events"], ["/feed", "Discover"], ["/friends", "Friends"]].map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `rounded-lg px-3 py-2 font-semibold transition ${isActive ? "bg-violet-100 text-violet-800" : "text-slate-600 hover:bg-violet-50 hover:text-violet-800"}`}>{label}</NavLink>)}
          </div>
          <div className="ml-auto flex items-center gap-3"><span className="hidden text-sm font-semibold text-slate-600 sm:inline">Hi, {user.name}</span><button onClick={logout} className="btn btn-secondary !px-3 !py-2">Log out</button></div>
        </> : <div className="ml-auto flex gap-2"><Link to="/login" className="btn btn-secondary">Log in</Link><Link to="/register" className="btn btn-primary">Get started</Link></div>}
      </div>
    </nav>
  );
}
