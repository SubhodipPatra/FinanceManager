import { useEffect, useState, memo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  PieChart, Pie, Cell, 
  LineChart, Line, CartesianGrid, ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';

// IMPORT THE NEW API HELPER
import api from '../services/api'; 
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// --- Sub-Components ---
const IncomeExpenseChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="type" tickFormatter={(str) => str?.toUpperCase()} />
      <YAxis />
      <Tooltip cursor={{ fill: 'var(--bg-color)' }} />
      <Bar dataKey="total" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={50} />
    </BarChart>
  </ResponsiveContainer>
));

const CategoryPieChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="total"
        nameKey="category"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend layout="vertical" verticalAlign="middle" align="right" />
    </PieChart>
  </ResponsiveContainer>
));

const MonthlyTrendChart = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="month" tickFormatter={(str) => {
        try { return format(new Date(str), 'MMM yyyy'); } catch { return str; }
      }} />
      <YAxis />
      <Tooltip 
        labelFormatter={(str) => {
          try { return format(new Date(str), 'MMMM yyyy'); } catch { return str; }
        }}
        formatter={(value) => [`₹${value}`, 'Expense']}
      />
      <Line 
        type="monotone" 
        dataKey="total" 
        stroke="var(--success-color)" 
        strokeWidth={3} 
        dot={{ r: 5 }} 
        activeDot={{ r: 7 }} 
      />
    </LineChart>
  </ResponsiveContainer>
));

// --- Main Dashboard Component ---
const Dashboard = () => {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true); 
      setError(null);
      
      // Use the api helper (no manual URL, no manual token)
      const response = await api.get('/dashboard/analytics');

      if (response.data) {
        setData(response.data);
      } else {
        throw new Error("No data received");
      }
      
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      if (err.response && err.response.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="loading-container">Loading analytics...</div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="error-alert">
        <p><strong>Error:</strong> {error}</p>
        <button className="btn btn-primary" onClick={fetchAnalytics}>Retry</button>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h2>Financial Overview</h2>
        </header>
        {data && (
          <div className="dashboard-grid">
            <div className="chart-card">
              <h3 className="chart-title">Income vs Expense</h3>
              <IncomeExpenseChart data={data.incomeExpense || []} />
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Spending by Category</h3>
              <CategoryPieChart data={data.categoryBreakdown || []} />
            </div>

            <div className="chart-card full-width">
              <h3 className="chart-title">Monthly Spending Trend</h3>
              <MonthlyTrendChart data={data.monthlySpending || []} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;