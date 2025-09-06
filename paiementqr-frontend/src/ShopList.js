import React, { useEffect, useState } from 'react';
import ShopForm from './ShopForm';
import './ShopList.css';
import { useNotification } from './NotificationContext';



function ShopList({ token, isSuperUser }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingShop, setEditingShop] = useState(null);

  const fetchShops = () => {
    fetch('http://127.0.0.1:8000/api/shops/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setShops(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchShops();
  }, [token]);

  const handleShopCreated = (newShop) => {
    setShops((prev) => [...prev, newShop]);
  };

  const handleDelete = (shopId) => {
    if (!window.confirm('Confirmer la suppression ?')) return;

    fetch(`http://127.0.0.1:8000/api/shops/${shopId}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setShops((prev) => prev.filter(shop => shop.id !== shopId));
        if (editingShop && editingShop.id === shopId) {
          setEditingShop(null);
        }
      })
      .catch(err => alert('Erreur suppression: ' + err));
  };

  const handleEditClick = (shop) => {
    setEditingShop(shop);
  };

  const handleUpdate = (updatedShop) => {
    setShops((prev) =>
      prev.map(shop => (shop.id === updatedShop.id ? updatedShop : shop))
    );
    setEditingShop(null);
  };

  if (loading) return <p className="loading-text">Chargement...</p>;

  return (
    <div>
      {isSuperUser && !editingShop && (
        <ShopForm token={token} onShopCreated={handleShopCreated} />
      )}

      {isSuperUser && editingShop && (
        <ShopForm
          token={token}
          shop={editingShop}
          onShopCreated={handleUpdate}
          onCancel={() => setEditingShop(null)}
        />
      )}

      <h2>Liste des boutiques</h2>
      <ul className="shop-list">
        {shops.map(shop => (
          <li key={shop.id} className="boutique">
            <strong>{shop.name}</strong><br />
            Adresse: {shop.address}<br />
            Description: {shop.description}<br />
            <img
              src={shop.qr_code_url}
              alt={`QR Code pour ${shop.name}`}
              className="qr-code"
              width={150}
              height={150}
            /><br />
            {isSuperUser && (
              <div className="boutique-buttons">
                <button onClick={() => handleEditClick(shop)}>Modifier</button>
                <button onClick={() => handleDelete(shop.id)}>Supprimer</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const { addNotification } = useNotification();
addNotification('Ton message ici', 'error');      // ou 'success', 'info'


export default ShopList;
