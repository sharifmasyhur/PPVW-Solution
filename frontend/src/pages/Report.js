import React, { useState, useEffect } from "react";
import "./Report.css";

function Report() {
  const [userId, setUserId] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [financeHealthScore, setFinanceHealthScore] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID is missing. Please log in again.");
    }
  }, []);

  const fetchReportData = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      const incomeResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/report/${userId}/income`
      );
      const incomeData = await incomeResponse.json();

      if (incomeResponse.ok) {
        setTotalIncome(incomeData.total_income || 0);
      } else {
        throw new Error(incomeData.error || "Failed to fetch income data.");
      }
      
      const expensesResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/report/${userId}/expenses`
      );
      const expensesData = await expensesResponse.json();

      if (expensesResponse.ok) {
        setTotalExpenses(expensesData.total_expenses || 0);
      } else {
        throw new Error(expensesData.error || "Failed to fetch expenses data.");
      }

      const scoreResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/report/${userId}/score`
      );
      const scoreData = await scoreResponse.json();

      if (scoreResponse.ok) {
        setFinanceHealthScore(scoreData.score || 0);
      } else {
        throw new Error(scoreData.error || "Failed to fetch health score.");
      }
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [userId]);

  return (
    <div className="report-container">
      <h1>User Report</h1>
      {userId && <p>Logged in as User ID: {userId}</p>}

      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && !error && (
        <div className="report-content">
          <h2>Financial Summary</h2>
          <p>Total Income: Rp. {totalIncome}</p>
          <p>Total Expenses: Rp. {totalExpenses}</p>
          <p>Financial Health Score: {financeHealthScore}%</p>
        </div>
      )}
    </div>
  );
}

export default Report;