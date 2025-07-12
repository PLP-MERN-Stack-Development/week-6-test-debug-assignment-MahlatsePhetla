
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedPage() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  useEffect(() => {

    async function fetchProtected() {
      try {
        const res = await fetch('http://localhost:5000/api/auth/protected', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) setMessage(data.message);
        else setMessage('Access denied');
      } catch {
        setMessage('Error fetching data');
      }
    }
    fetchProtected();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      <p>{message || 'Loading...'}</p>
      <p>User Email: {user.email}</p>
    </div>
  );
}
