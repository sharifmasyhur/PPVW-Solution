import React, { useState, useEffect } from "react";
import "./Profile.css";

function Profile() {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const [topUpAmount, setTopUpAmount] = useState("");
  const [donate, setDonate] = useState(false);
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError("");
    setMessage("");

    fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setError(data.error || "Failed to fetch user details.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setError("Unable to connect to the server.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleTopUp = () => {
    if (!userId) return;

    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid top-up amount.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/topup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        donate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.balance !== undefined) {
          setMessage("Top-up successful!");
          setUser((prev) => ({
            ...prev,
            balance: data.balance,
          }));
          setTopUpAmount("");
          setDonate(false);
        } else {
          setError(data.error || "Failed to top up balance.");
        }
      })
      .catch((error) => {
        console.error("Error topping up:", error);
        setError("Unable to connect to the server.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {userId && (
        <>
          <p><strong>User ID:</strong> {userId}</p>
          <p><strong>Name:</strong> {user.name || "N/A"}</p>
          <p><strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Balance:</strong> Rp. {user.balance || "0.00"}</p>
        </>
      )}

      <div className="topup-section">
        <h2>Top-Up Balance</h2>
        <input
          type="number"
          placeholder="Top-up Amount"
          value={topUpAmount}
          onChange={(e) => setTopUpAmount(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={donate}
            onChange={() => setDonate(!donate)}
          />
          Donate 2% of this amount
        </label>
        <button onClick={handleTopUp}>Top Up</button>
      </div>
    </div>
  );
}

export default Profile;