import React, { useState } from 'react';
import { useNotification } from './NotificationContext';


function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!username.trim()) errs.username = 'Le nom d’utilisateur est obligatoire';
    if (!password) errs.password = 'Le mot de passe est obligatoire';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validate()) return;

    setLoading(true);

    fetch('http://127.0.0.1:8000/api/users/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Identifiants invalides');
        return res.json();
      })
      .then(data => {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        onLogin(data.access, data.refresh);
      })
      .catch(err => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h3>Connexion</h3>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <label>Nom d’utilisateur</label><br />
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        disabled={loading}
      />
      {errors.username && <p className="error-message">{errors.username}</p>}

      <label>Mot de passe</label><br />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
      />
      {errors.password && <p className="error-message">{errors.password}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}


const { addNotification } = useNotification();

addNotification('Ton message ici', 'error');      // ou 'success', 'info'

export default Login;
