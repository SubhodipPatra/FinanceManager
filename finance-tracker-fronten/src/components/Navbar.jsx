import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
   
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div className="nav-brand">FinanceManager</div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className="link" style={{ fontWeight: '500' }}>
            Dashboard
          </Link>
          <Link to="/transactions" className="link" style={{ fontWeight: '500' }}>
            Transactions
          </Link>
          

          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="link" 
              style={{ fontWeight: '500', color: 'var(--danger-color)' }}
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>


      <div className="nav-user">
       

        <span>
          Welcome, <strong>{user?.name}</strong> <small>({user?.role})</small>
        </span>
        
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;