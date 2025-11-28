// 
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

  const [refresh, setRefresh] = useState(0);  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get(`/transactions?page=${page}&limit=10`);
      setTransactions(data.transactions);
      setTotalPages(data.pages);
    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, refresh]);  

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
      setRefresh(r => r + 1);   
    } catch {
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

      setRefresh(r => r + 1); 
    } catch {
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

        <div style={{ height: "600px", width: "100%" }}>
          <VirtualTransactionList
            transactions={filteredTransactions}
            onEdit={openModal}
            onDelete={handleDelete}
            isReadOnly={isReadOnly}
          />
        </div>

        <div className="pagination" style={{ marginTop: '1rem' }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn">
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn">
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
