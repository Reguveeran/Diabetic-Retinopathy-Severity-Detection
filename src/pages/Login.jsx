import { Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin@hospital.org');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        navigate('/patients');
      } else {
        setError('Invalid credentials. Check your demo account.');
      }
    } catch (err) {
      setError('Unable to connect to backend server.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand">
          <div className="brand-icon">
            <Eye size={18} />
          </div>
          RETINASCAN PLATFORM
        </div>
        
        <h1>
          Understanding<br />
          Diabetic<br />
          Retinopathy
        </h1>
        
        <p className="subtitle">
          Early detection is our best defense against irreversible vision loss.
        </p>

        <div className="info-card">
          <h3>What is DR?</h3>
          <p>
            A serious complication of diabetes that affects the eyes. It is caused by progressive 
            damage to the blood vessels within the light-sensitive retina tissue at the back of the eye.
          </p>
        </div>

        <div className="info-card">
          <h3>Why Screening Matters</h3>
          <p>
            DR often has no early symptoms. Regular screening and early detection form a critical 
            medical intervention to prevent significant visual impairment.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="auth-card">
          <h2>Access Portal</h2>
          <p className="auth-subtitle">Sign in to access the testing interface.</p>
          <p className="auth-demo">Demo: admin@hospital.org / admin123</p>

          {error && <div style={{color: '#ff4d4f', marginBottom: '1rem', fontSize: '0.9rem'}}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>MEDICAL ID / EMAIL</label>
              <input type="email" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label>PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-pw">Forgot Password?</a>
            </div>

            <button type="submit" className="btn-primary">
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div className="powered-by">
            Powered by <strong>APSO-GRESNET</strong> Architecture
          </div>
        </div>
      </div>
    </div>
  );
}
