

import { useState, useEffect } from 'react';
import '../styles/TransactionForm.css';

const TransactionForm = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: ''
  });


  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ type: 'expense', amount: '', category: '', description: '' });
    }
  }, [initialData]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ type: 'expense', amount: '', category: '', description: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: '1rem' }}>
          {initialData ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <select 
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group">
            <input 
              type="number" placeholder="Amount" className="form-input" required
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className="form-group">
            <input 
              type="text" placeholder="Category" className="form-input" required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          </div>

          <div className="form-group">
            <input 
              type="text" placeholder="Description" className="form-input"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" onClick={onClose} className="btn" style={{ background: '#e5e7eb' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
