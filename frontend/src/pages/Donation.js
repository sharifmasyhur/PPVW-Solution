import React, { useState, useEffect } from "react";
import "./Donation.css";

function Donation() {
  const [userId, setUserId] = useState(null);
  const [donation, setDonation] = useState(0);
  const [donationDetails, setDonationDetails] = useState({
    amount: "",
    cause: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const causes = [
    "Education",
    "Health",
    "Environment",
    "Animal Welfare",
    "Community Development",
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID is missing. Please log in again.");
    }
  }, []);

  const fetchAllDonations = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/donation/${userId}`
      );
      const data = await response.json();

      if (response.ok) {
        setDonation(data.donation || 0);
      } else {
        setError(data.error || "Failed to fetch donation data.");
      }
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = async () => {
    if (!userId) return;

    const { amount, cause } = donationDetails;

    if (!amount || !cause) {
      setError("Please fill in all donation details.");
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
        `${process.env.REACT_APP_API_URL}/donation/${userId}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: parseFloat(amount) }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSuccess("Donation successful!");
        setDonationDetails({ amount: "", cause: "" });
        fetchAllDonations();
      } else {
        setError(data.error || "Donation failed.");
      }
    } catch (err) {
      console.error("Error processing donation:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDonations();
  }, [userId]);

  return (
    <div className="donation-container">
      <h1>Donation Management</h1>
      {userId && <p>Logged in as User ID: {userId}</p>}

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {loading && <p>Loading...</p>}

      {/* Donation Form */}
      <div className="donation-form">
        <h2>Make a Donation</h2>
        <input
          type="number"
          placeholder="Amount"
          value={donationDetails.amount}
          onChange={(e) =>
            setDonationDetails({ ...donationDetails, amount: e.target.value })
          }
        />
        <select
          value={donationDetails.cause}
          onChange={(e) =>
            setDonationDetails({ ...donationDetails, cause: e.target.value })
          }
          required
        >
          <option value="">Select a Cause</option>
          {causes.map((cause, index) => (
            <option key={index} value={cause}>
              {cause}
            </option>
          ))}
        </select>
        <button onClick={handleDonation}>Submit Donation</button>
      </div>

      {/* Donation Total */}
      <div className="donation-history">
        <h2>Total Donation</h2>
        <p>Rp. {donation}</p>
      </div>
    </div>
  );
}

export default Donation;