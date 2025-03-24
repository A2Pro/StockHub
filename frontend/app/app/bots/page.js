"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from '../components/navbar.js';

const BotSettingsPage = () => {
  const [settings, setSettings] = useState({
    starting_fund: 50000,
    risk_tolerance: "Medium",
    investment_sector: "Tech",
    asset_type: "Stocks",
    trade_frequency: "Weekly",
    stop_loss: 0.05,
    take_profit: 0.1,
  });

  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Fetch settings on component mount
  useEffect(() => {
    setLoading(true);
    fetch("/get_user_profile")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        return response.json();
      })
      .then((data) => {
        setSettings(data); // Assume the API returns the settings directly
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    setError(null);
    setSubmissionSuccess(false);

    fetch("/update_user_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update settings");
        }
        return response.json();
      })
      .then((data) => {
        setConfirmed(true);
        setSubmissionSuccess(true);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleActivate = () => {
    alert("Bot is now active and trading!");
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      
        <Navbar />
  

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8">Bot Configuration Settings</h2>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500 text-white p-4 rounded-lg mb-6"
            >
              Successfully Fetched Settings
            </motion.div>
          )}
          <form className="space-y-6">
            <FormField
              label="Starting Fund"
              type="number"
              name="starting_fund"
              value={settings.starting_fund}
              onChange={handleChange}
            />
            <FormField
              label="Risk Tolerance"
              type="select"
              name="risk_tolerance"
              value={settings.risk_tolerance}
              onChange={handleChange}
              options={["Low", "Medium", "High"]}
            />
            <FormField
              label="Investment Sector"
              type="select"
              name="investment_sector"
              value={settings.investment_sector}
              onChange={handleChange}
              options={["Tech", "Healthcare", "Energy", "Finance"]}
            />
            <FormField
              label="Asset Type"
              type="select"
              name="asset_type"
              value={settings.asset_type}
              onChange={handleChange}
              options={["Stocks", "Bonds", "Crypto"]}
            />
            <FormField
              label="Trade Frequency"
              type="select"
              name="trade_frequency"
              value={settings.trade_frequency}
              onChange={handleChange}
              options={["Daily", "Weekly", "Monthly"]}
            />
            <FormField
              label="Stop Loss"
              type="number"
              name="stop_loss"
              step="0.01"
              value={settings.stop_loss}
              onChange={handleChange}
            />
            <FormField
              label="Take Profit"
              type="number"
              name="take_profit"
              step="0.01"
              value={settings.take_profit}
              onChange={handleChange}
            />
            <div className="flex items-center space-x-4">
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
              >
                {loading ? "Submitting..." : "Submit Configuration"}
              </motion.button>
              {submissionSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-500"
                >
                  Configuration submitted successfully!
                </motion.div>
              )}
            </div>
          </form>

          {confirmed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-green-600 rounded-lg text-center"
            >
              <h3 className="text-2xl font-bold mb-4">Configuration Confirmed!</h3>
              <motion.button
                onClick={handleActivate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-700 text-white py-2 px-6 rounded-lg hover:bg-green-800 transition-all"
              >
                Activate Bot
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const FormField = ({ label, type, name, value, onChange, options, step }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          step={step}
          className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
};

export default BotSettingsPage;