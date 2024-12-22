import React, { useState, useEffect } from 'react';

const ClientInfo = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Load client data from local storage
    const savedName = localStorage.getItem('clientName');
    const savedEmail = localStorage.getItem('clientEmail');
    const savedPhone = localStorage.getItem('clientPhone');

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  const handleSave = () => {
    // Save client data to local storage
    localStorage.setItem('clientName', name);
    localStorage.setItem('clientEmail', email);
    localStorage.setItem('clientPhone', phone);
  };

  return (
    <div className="client-info-container">
      <h2>Client Information</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ClientInfo;
