'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, userData } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Mt. Caramel H.E.L.P.S.
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">Home</Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link href="/dashboard" className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link href="/supply-tracker" className="nav-link">Supply Tracker</Link>
                </li>
                {userData?.role === 'admin' && (
                  <li className="nav-item">
                    <Link href="/admin" className="nav-link">Admin</Link>
                  </li>
                )}
              </>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                >
                  {user.email} ({userData?.role})
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/auth/signin" className="nav-link">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link href="/auth/signup" className="nav-link">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
