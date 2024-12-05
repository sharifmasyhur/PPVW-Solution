import React, { useState, useEffect } from "react";
import "./Transaction.css";

function Transaction() {
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    payment_type: "",
    destination: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const paymentTypes = [
    "Food",
    "Health",
    "Education",
    "Entertainment",
    "Lifestyle",
    "General",
    "Other",
    "Transportation",
    "Transfer",
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID is missing. Please log in again.");
    }
  }, []);

  const fetchAllTransactions = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/transaction/${userId}/history`
      );
      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions || []);
      } else {
        setError(data.error || "Failed to fetch transactions.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const filterByType = async () => {
    if (!userId || !transactionType) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/transaction/${userId}/history/type?transactionType=${transactionType}`
      );
      const data = await response.json();

      if (response.ok) {
        setFilteredTransactions(data.transactions || []);
      } else {
        setError(data.error || "No transactions found for the specified type.");
      }
    } catch (err) {
      console.error("Error filtering transactions:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePayment = async () => {
    if (!userId) return;

    const { amount, payment_type, destination } = paymentDetails;

    if (!amount || !payment_type || !destination) {
      setError("Please fill in all payment details.");
      return;
    }

    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/transaction/${userId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, payment_type, destination }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSuccess("Payment successful!");
        setPaymentDetails({ amount: "", payment_type: "", destination: "" });
        fetchAllTransactions();
      } else {
        setError(data.error || "Payment failed.");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, [userId]);

  return (
    <div className="transaction-container">
      <h1>Transaction Management</h1>
      {userId && <p>Logged in as User ID: {userId}</p>}

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {loading && <p>Loading...</p>}

      {/* Payment Form */}
      <div className="payment-form">
        <h2>Make a Payment</h2>
        <input
          type="number"
          placeholder="Amount"
          value={paymentDetails.amount}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, amount: e.target.value })
          }
        />
        <select
          value={paymentDetails.payment_type}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, payment_type: e.target.value })
          }
          required
        >
          <option value="">Select Payment Type</option>
          {paymentTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Destination (ID)"
          value={paymentDetails.destination}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, destination: e.target.value })
          }
        />
        <button onClick={handlePayment}>Submit Payment</button>
      </div>

      {/* Filter Transactions */}
      <div className="filter-section">
        <h2>Filter Transactions</h2>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="">Select Transaction Type</option>
          {paymentTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button onClick={filterByType}>Filter</button>

        <h3>Filtered Transactions</h3>
        {filteredTransactions.length === 0 && <p>No filtered transactions found.</p>}
        <ul>
          {filteredTransactions.map((tx, index) => (
            <li key={index}>
              {tx.transaction_type}: Rp. {tx.amount} on{" "}
              {new Date(tx.transaction_date).toLocaleDateString()} to {tx.receiver_name}
            </li>
          ))}
        </ul>
      </div>

      {/* All Transactions */}
      <div className="all-transactions">
        <h2>All Transactions</h2>
        {transactions.length === 0 && <p>No transactions available.</p>}
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              {tx.transaction_type}: Rp. {tx.amount} on{" "}
              {new Date(tx.transaction_date).toLocaleDateString()} to {tx.receiver_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Transaction;