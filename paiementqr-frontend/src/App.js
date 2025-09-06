import React, { useState, useEffect } from 'react';
import Login from './Login';    // votre composant login
import ShopList from './ShopList';  // votre composant gestion boutiques

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token') || null);
  const [isSuperUser, setIsSuperUser] = useState(false);

  // Fonction pour rafraîchir le token d'accès
  const refreshAccessToken = () => {
    if (!refreshToken) {
      logout();
      return Promise.reject('No refresh token available');
    }

    return fetch('http://127.0.0.1:8000/api/users/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to refresh token');
        return res.json();
      })
      .then(data => {
        localStorage.setItem('access_token', data.access);
        setAccessToken(data.access);
        return data.access;
      })
      .catch(() => {
        logout();
      });
  };

  // Fonction logout : supprimer tokens et réinitialiser état
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setRefreshToken(null);
    setIsSuperUser(false);
  };

  // Après login avec succès : stocker les tokens et obtenir isSuperUser
  const handleLogin = (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setAccessToken(access);
    setRefreshToken(refresh);

    // Exemple appel API 'current_user' pour récupérer le statut superadmin
    fetch('http://127.0.0.1:8000/api/users/me/', {
      headers: { Authorization: `Bearer ${access}` }
    })
      .then(res => res.json())
      .then(data => setIsSuperUser(data.is_superuser))
      .catch(() => logout());
  };

  // Rafraîchissement automatique toutes les 4 minutes
  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(() => {
      refreshAccessToken();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [accessToken]);

  // Affichage conditionnel selon connexion
  if (!accessToken) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <button onClick={logout} style={{ float: "right", margin: "10px" }}>Déconnexion</button>
      <ShopList token={accessToken} isSuperUser={isSuperUser} />
    </div>
  );
}

export default App;
