'use client'
import { useState } from 'react';

const CreateGiveaway = () => {
  const [funds, setFunds] = useState(0);
  const [recipients, setRecipients] = useState(0);
  const [type, setType] = useState('cash');

  const handleSubmit = async () => {
    // Logic to create a new giveaway and generate a shareable link
  };

  return (
    <div>
      <h1>Create a New Giveaway</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Total Funds:
          <input type="number" value={funds} onChange={(e) => setFunds(Number(e.target.value))} />
        </label>
        <label>
          Number of Recipients:
          <input type="number" value={recipients} onChange={(e) => setRecipients(Number(e.target.value))} />
        </label>
        <label>
          Fund Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="recharge">Recharge Card</option>
            <option value="data">Data</option>
            <option value="meter">Meter Bill</option>
          </select>
        </label>
        <button type="submit">Generate Link</button>
      </form>
    </div>
  );
};

export default CreateGiveaway;
