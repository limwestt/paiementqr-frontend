import React, { useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';


function ShopForm({ token, shop = null, onShopCreated, onCancel }) {
  const [name, setName] = useState(shop ? shop.name : '');
  const [address, setAddress] = useState(shop ? shop.address : '');
  const [description, setDescription] = useState(shop ? shop.description : '');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Validation simple
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Le nom est obligatoire";
    if (description.length > 200) errs.description = "Description trop longue (200 caractères max)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validate()) return;

    setLoading(true);

    const url = shop ? `http://127.0.0.1:8000/api/shops/${shop.id}/` : 'http://127.0.0.1:8000/api/shops/';
    const method = shop ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, address, description }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
        return res.json();
      })
      .then(data => {
        onShopCreated(data);
        setSuccessMessage(shop ? "Boutique mise à jour avec succès !" : "Boutique créée avec succès !");
        setErrors({});
        // Réinitialiser le formulaire si création
        if (!shop) {
          setName('');
          setAddress('');
          setDescription('');
        }
      })
      .catch(() => setErrors({submit: "Erreur serveur, veuillez réessayer."}))
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="shop-form">
      <h3>{shop ? 'Modifier la boutique' : 'Créer une nouvelle boutique'}</h3>

      {errors.submit && <p className="error-message">{errors.submit}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <label>Nom *</label><br />
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={loading}
      />
      {errors.name && <p className="error-message">{errors.name}</p>}

      <label>Adresse</label><br />
      <input
        type="text"
        value={address}
        onChange={e => setAddress(e.target.value)}
        disabled={loading}
      />

      <label>Description</label><br />
      <textarea
        rows="4"
        value={description}
        onChange={e => setDescription(e.target.value)}
        disabled={loading}
      />
      {errors.description && <p className="error-message">{errors.description}</p>}

      <button type="submit" disabled={loading}>
        {loading ? (shop ? 'Mise à jour...' : 'Création...') : (shop ? 'Mettre à jour' : 'Créer')}
      </button>

      {shop && <button type="button" onClick={onCancel} disabled={loading}>Annuler</button>}
    </form>
  );
}

const { addNotification } = useNotification();
addNotification('Ton message ici', 'error');      // ou 'success', 'info'


export default ShopForm;
