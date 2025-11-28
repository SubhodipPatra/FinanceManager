import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';
import VirtualTransactionList from '../components/VirtualTransactionList';
import '../styles/Transactions.css';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);


  const [searchTerm, setSearchTerm] = useState('');


  const fetchTransactions = async () => {
    try {
      const { data } = await api.get(`/transactions?page=${page}&limit=10`);
    
      setTransactions(data.transactions);
      setTotalPages(data.pages);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);


  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);


  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete transaction");
    }
  }, []);


  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/transactions/${editingItem.id}`, formData);
      } else {
        await api.post('/transactions', formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchTransactions(); 
    } catch (err) {
      alert("Failed to save transaction");
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const isReadOnly = user.role === 'read-only';

  return (
    <>
      <Navbar />
      
      <div className="transactions-container">
        
        <div className="page-header">
          <h2 className="text-2xl font-bold">Transaction History</h2>
          {!isReadOnly && (
            <button onClick={() => openModal()} className="btn btn-primary">
              + Add Transaction
            </button>
          )}
        </div>

        <div className="filter-bar">
          <input 
            type="text" 
            placeholder="Search description or category..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>


        {filteredTransactions.length > 0 ? (
        
          <div style={{ height: '600px', width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <VirtualTransactionList
              transactions={filteredTransactions}
              onEdit={openModal}
              onDelete={handleDelete}
              isReadOnly={isReadOnly}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            No transactions found.
          </div>
        )}


        <div className="pagination" style={{ marginTop: '1rem' }}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="btn" 
            style={{ padding: '0.5rem 1rem', background: '#e5e7eb' }}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="btn"
            style={{ padding: '0.5rem 1rem', background: '#e5e7eb' }}
          >
            Next
          </button>
        </div>

        <TransactionForm 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
          initialData={editingItem}
        />
      </div>
    </>
  );
};

export default Transactions;