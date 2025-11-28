# Personal Finance Manager

A robust, full-stack financial tracking application designed to help users manage income and expenses, visualize spending habits, and maintain financial health. The application features role-based access control (Admin/User), interactive dashboards, and high-performance list rendering.

## Live Demo

- **Frontend (Vercel):** https://finance-manager-qudh.vercel.app/
- **Backend (Render):** https://financemanager-api.onrender.com/

## Key Features

### Dashboard & Analytics
- **Income vs. Expense:** Bar charts comparing total cash flow.
- **Category Breakdown:** Pie charts visualizing spending distribution (Food, Rent, etc.).
- **Monthly Trends:** Line charts showing spending habits over time.
- **Dynamic Colors:** Visual indicators for income (green) and expenses (red).

### Transaction Management
- **CRUD Operations:** Add, Edit, Delete, and View transactions.
- **Virtual Scrolling:** Utilizes `@tanstack/react-virtual` to efficiently render thousands of transactions without performance lag.
- **Search & Filter:** Real-time filtering by description, category, or user name.
- **Pagination:** Server-side pagination for optimized data fetching.

### Authentication & Roles
- **Secure Auth:** JWT (JSON Web Token) based authentication.
- **Role-Based Access:**
  - **User:** Can only view and manage their own data.
  - **Admin:** Can view all transactions across the system and search by User Name.
  - **Read-Only:** Specific restricted access modes.

## Tech Stack

### Frontend
- **Framework:** React.js
- **Styling:** CSS Modules / Tailwind CSS
- **Charts:** Recharts
- **Performance:** @tanstack/react-virtual (Virtual List)
- **HTTP Client:** Axios
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** jsonwebtoken (JWT)
- **Deployment:** Render

## Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/finance-manager.git](https://github.com/your-username/finance-manager.git)
cd finance-manager
