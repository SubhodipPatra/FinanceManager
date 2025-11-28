import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import AutoSizer from "react-virtualized-auto-sizer";


const ROW_HEIGHT = 60; 
const GRID_LAYOUT = "110px 140px 100px 140px 1fr 120px 140px";

export default function VirtualTransactionList({ transactions, onEdit, onDelete, isReadOnly }) {
  const parentRef = useRef(null);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: GRID_LAYOUT, 
          padding: '0 10px', 
          height: '40px', 
          alignItems: 'center',
          backgroundColor: '#f3f4f6', 
          borderBottom: '2px solid #e5e7eb',
          fontWeight: 'bold',
          color: '#374151',
          fontSize: '0.875rem'
        }}
      >
        <span>Date</span>
        <span>User</span> 
        <span>Type</span>
        <span>Category</span>
        <span>Description</span>
        <span className="text-right">Amount</span>
        <span className="text-center">Actions</span>
      </div>


      <div style={{ flex: 1 }}>
        <AutoSizer>
          {({ height, width }) => (
            <div
              ref={parentRef}
              style={{ 
                height: height, 
                width: width, 
                overflow: "auto", 
                position: 'relative'
              }}
            >
              <VirtualList
                parentRef={parentRef}
                transactions={transactions}
                onEdit={onEdit}
                onDelete={onDelete}
                isReadOnly={isReadOnly}
              />
            </div>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

function VirtualList({ parentRef, transactions, onEdit, onDelete, isReadOnly }) {
  const rowVirtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  return (
    <div
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const transaction = transactions[virtualRow.index];

        return (
          <div
            key={virtualRow.key}
            ref={rowVirtualizer.measureElement} 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${ROW_HEIGHT}px`,
              transform: `translateY(${virtualRow.start}px)`,
              display: "grid",
              gridTemplateColumns: GRID_LAYOUT,
              alignItems: "center",
              padding: "0 10px",
              boxSizing: "border-box",
              borderBottom: "1px solid #f0f0f0",
              backgroundColor: virtualRow.index % 2 === 0 ? "#ffffff" : "#f9fafb",
            }}
          >
            <TransactionRow
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
              isReadOnly={isReadOnly}
            />
          </div>
        );
      })}
    </div>
  );
}

function TransactionRow({ transaction, onEdit, onDelete, isReadOnly }) {
  const { type, category, amount, description, createdAt } = transaction;


  const userData = transaction.User || transaction.user; 
  const displayUser = userData ? userData.name : "Unknown";


  return (
    <>

      <span className="text-sm text-gray-600">
        {new Date(createdAt).toLocaleDateString("en-IN")}
      </span>


      <span className="text-sm font-medium text-gray-800 truncate pr-2" title={displayUser}>
        {displayUser}
      </span>


      <div>
        <span className={`
          px-2 py-1 rounded-full text-xs font-semibold capitalize
          ${type === 'income' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'}
        `}>
          {type}
        </span>
      </div>


      <span className="text-sm text-gray-800 truncate pr-2">
        {category}
      </span>


      <span className="text-sm text-gray-500 truncate pr-2" title={description}>
        {description}
      </span>


      <div className={`text-right font-bold text-sm ${type === "income" ? "text-green-600" : "text-red-600"}`}>
        {type === "income" ? "+" : "-"} ₹{amount}
      </div>

      <div className="flex justify-center gap-2">
        {!isReadOnly && (
          <>
            <button
              onClick={() => onEdit(transaction)}
              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs rounded transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs rounded transition"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </>
  );
}