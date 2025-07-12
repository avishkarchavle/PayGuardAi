import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Activity,
  Send,
  Clock,
  MapPin,
  Smartphone,
  User,
  Eye,
  EyeOff,
  Key,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Lock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  Pie,
} from "recharts";

type Transaction = {
  id: string;
  amount: number;
  time: string;
  device: string;
  location: string;
  receiver: string;
  label: number;
  status: "completed" | "flagged" | "pending";
  timestamp: Date;
};

type PredictionResult = {
  prediction: string;
  confidence: number;
};

type User = {
  id: string;
  pin: string;
  secretQuestion: string;
  secretAnswer: string;
  name: string;
};

const PayGuardApp = () => {
  const [currentStep, setCurrentStep] = useState<
    "login" | "dashboard" | "transaction" | "verification"
  >("login");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );
  const [stats, setStats] = useState({ Safe: 0, "High Risk": 0, Total: 0 });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  const [formData, setFormData] = useState({
    userId: "",
    amount: "",
    time: "",
    device: "known",
    location: "Mumbai",
    receiver: "known",
    prev_locations: [],
    prev_times: [],
  });

  // Mock users database
  const mockUsers: User[] = [
    {
      id: "user123",
      pin: "1234",
      secretQuestion: "What is your mother's maiden name?",
      secretAnswer: "sharma",
      name: "Raj Patel",
    },
    {
      id: "user456",
      pin: "5678",
      secretQuestion: "What was your first pet's name?",
      secretAnswer: "buddy",
      name: "Priya Singh",
    },
  ];

  // Generate realistic transaction history
  const generateTransactionHistory = () => {
    const history: Transaction[] = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      const isRisky = Math.random() < 0.2; // 20% risky transactions

      history.push({
        id: `txn_${i}`,
        amount: Math.floor(Math.random() * 100000) + 1000,
        time: timestamp.toTimeString().slice(0, 5),
        device: Math.random() > 0.7 ? "new" : "known",
        location: Math.random() > 0.5 ? "Mumbai" : "Delhi",
        receiver: Math.random() > 0.3 ? "known" : "unknown",
        label: isRisky ? 1 : 0,
        status: isRisky
          ? Math.random() > 0.5
            ? "flagged"
            : "completed"
          : "completed",
        timestamp,
      });
    }

    return history.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  };

  useEffect(() => {
    const history = generateTransactionHistory();
    setTransactionHistory(history);

    const safeCount = history.filter((t) => t.label === 0).length;
    const riskCount = history.filter((t) => t.label === 1).length;

    setStats({
      Safe: safeCount,
      "High Risk": riskCount,
      Total: history.length,
    });
  }, []);

  const handlePinSubmit = () => {
    const user = mockUsers.find(
      (u) => u.id === formData.userId && u.pin === pinInput
    );
    if (user) {
      setCurrentUser(user);
      setCurrentStep("dashboard");
      setPinInput("");
    } else {
      alert("Invalid User ID or PIN");
    }
  };

  const handleTransactionAnalysis = async () => {
    if (!formData.amount || !formData.time) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const amount = parseFloat(formData.amount);
      const hour = parseInt(formData.time.split(":")[0]);

      // Risk assessment logic
      const isHighRisk =
        amount > 50000 ||
        (formData.device === "new" && formData.receiver === "unknown") ||
        hour < 6 ||
        hour > 22 ||
        (amount > 25000 && formData.receiver === "unknown");

      const confidence = isHighRisk ? 0.85 : 0.15;

      const predictionResult = {
        prediction: isHighRisk ? "High Risk" : "Safe",
        confidence: confidence,
      };

      setPrediction(predictionResult);
      setCurrentTransaction({ ...formData, amount });

      if (isHighRisk) {
        setCurrentStep("verification");
      } else {
        // Process transaction directly
        processTransaction(predictionResult);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const processTransaction = (predictionResult: PredictionResult) => {
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      amount: parseFloat(formData.amount),
      time: formData.time,
      device: formData.device,
      location: formData.location,
      receiver: formData.receiver,
      label: predictionResult.prediction === "High Risk" ? 1 : 0,
      status: "completed",
      timestamp: new Date(),
    };

    setTransactionHistory((prev) => [newTransaction, ...prev]);
    setStats((prev) => ({
      ...prev,
      [predictionResult.prediction === "High Risk" ? "High Risk" : "Safe"]:
        prev[
          predictionResult.prediction === "High Risk" ? "High Risk" : "Safe"
        ] + 1,
      Total: prev.Total + 1,
    }));

    alert(`Transaction of ₹${formData.amount} completed successfully!`);
    resetForm();
  };

  const handleSecretQuestionSubmit = () => {
    if (
      currentUser &&
      secretAnswer.toLowerCase() === currentUser.secretAnswer.toLowerCase()
    ) {
      if (prediction) {
        processTransaction(prediction);
      }
      setSecretAnswer("");
      setCurrentStep("dashboard");
    } else {
      const flaggedTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        amount: parseFloat(formData.amount),
        time: formData.time,
        device: formData.device,
        location: formData.location,
        receiver: formData.receiver,
        label: 1,
        status: "flagged",
        timestamp: new Date(),
      };

      setTransactionHistory((prev) => [flaggedTransaction, ...prev]);
      alert("Transaction flagged due to incorrect security answer!");
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      userId: currentUser?.id || "",
      amount: "",
      time: "",
      device: "known",
      location: "Mumbai",
      receiver: "known",
      prev_locations: [],
      prev_times: [],
    });
    setPrediction(null);
    setCurrentTransaction(null);
    setCurrentStep("dashboard");
  };

  const getFilteredHistory = () => {
    const now = new Date();
    const days =
      selectedTimeRange === "7d" ? 7 : selectedTimeRange === "30d" ? 30 : 90;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return transactionHistory.filter((t) => t.timestamp >= cutoff);
  };

  const getChartData = () => {
    const filtered = getFilteredHistory();
    const grouped = filtered.reduce((acc, txn) => {
      const date = txn.timestamp.toDateString();
      if (!acc[date]) {
        acc[date] = { date, safe: 0, risky: 0, total: 0 };
      }
      acc[date].total += 1;
      if (txn.label === 0) acc[date].safe += 1;
      else acc[date].risky += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).slice(-14); // Last 14 days
  };

  const getPieData = () => {
    const filtered = getFilteredHistory();
    const safe = filtered.filter((t) => t.label === 0).length;
    const risky = filtered.filter((t) => t.label === 1).length;

    return [
      { name: "Safe", value: safe, color: "#10b981" },
      { name: "High Risk", value: risky, color: "#ef4444" },
    ];
  };

  const getAmountDistribution = () => {
    const filtered = getFilteredHistory();
    const ranges = [
      { name: "< ₹10K", min: 0, max: 10000 },
      { name: "₹10K-50K", min: 10000, max: 50000 },
      { name: "₹50K-1L", min: 50000, max: 100000 },
      { name: "> ₹1L", min: 100000, max: Infinity },
    ];

    return ranges.map((range) => ({
      name: range.name,
      count: filtered.filter(
        (t) => t.amount >= range.min && t.amount < range.max
      ).length,
    }));
  };

  // Login Step
  if (currentStep === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">PayGuard AI</h1>
            <p className="text-gray-600">Secure Transaction Analysis</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your User ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  maxLength={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter 4-digit PIN"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handlePinSubmit}
              disabled={!formData.userId || pinInput.length !== 4}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Key className="h-4 w-4 mr-2" />
              Login
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo Users:</p>
            <p>user123 (PIN: 1234) | user456 (PIN: 5678)</p>
          </div>
        </div>
      </div>
    );
  }

  // Security Question Step
  if (currentStep === "verification") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200">
          <div className="text-center mb-8">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">
              Security Verification
            </h1>
            <p className="text-gray-600">High-risk transaction detected</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">
              Transaction Details:
            </h3>
            <p className="text-sm text-red-700">Amount: ₹{formData.amount}</p>
            <p className="text-sm text-red-700">Time: {formData.time}</p>
            <p className="text-sm text-red-700">
              Location: {formData.location}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Question
              </label>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {currentUser?.secretQuestion}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer
              </label>
              <input
                type="text"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your answer"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSecretQuestionSubmit}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Verify & Process
              </button>

              <button
                onClick={() => {
                  setSecretAnswer("");
                  setCurrentStep("dashboard");
                  resetForm();
                }}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PayGuard AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="h-4 w-4" />
                <span>Welcome, {currentUser?.name}</span>
              </div>
              <button
                onClick={() => {
                  setCurrentStep("login");
                  setCurrentUser(null);
                  resetForm();
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Transactions
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.Total}
                </p>
              </div>
              <Activity className="h-12 w-12 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Safe Transactions
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.Safe}
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats["High Risk"]}
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.Total > 0
                    ? Math.round((stats.Safe / stats.Total) * 100)
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Transaction Trends */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Transaction Trends
              </h2>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="safe"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Safe"
                />
                <Line
                  type="monotone"
                  dataKey="risky"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Risky"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Risk Distribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={getPieData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getPieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Amount Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Amount Distribution
          </h2>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getAmountDistribution()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction Analysis Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              New Transaction Analysis
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Smartphone className="inline h-4 w-4 mr-1" />
                    Device
                  </label>
                  <select
                    name="device"
                    value={formData.device}
                    onChange={(e) =>
                      setFormData({ ...formData, device: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="known">Known Device</option>
                    <option value="new">New Device</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receiver
                </label>
                <select
                  name="receiver"
                  value={formData.receiver}
                  onChange={(e) =>
                    setFormData({ ...formData, receiver: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="known">Known Receiver</option>
                  <option value="unknown">Unknown Receiver</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleTransactionAnalysis}
                  disabled={loading || !formData.amount || !formData.time}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Process Transaction
                    </>
                  )}
                </button>

                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Prediction Result */}
            {prediction && (
              <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold mb-3">Analysis Result</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {prediction.prediction === "High Risk" ? (
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                    <span
                      className={`text-xl font-bold ${
                        prediction.prediction === "High Risk"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {prediction.prediction}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-lg font-semibold">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <History className="h-5 w-5 mr-2 text-blue-600" />
              Recent Transactions
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactionHistory.slice(0, 10).map((txn, index) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          txn.status === "completed"
                            ? txn.label === 0
                              ? "bg-green-500"
                              : "bg-red-500"
                            : txn.status === "flagged"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                      {txn.status === "flagged" && (
                        <Lock className="h-3 w-3 text-red-600 mt-1" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        ₹{txn.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {txn.time} • {txn.location}
                      </p>
                      <p className="text-xs text-gray-500">
                        {txn.timestamp.toDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        txn.status === "completed"
                          ? txn.label === 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          : txn.status === "flagged"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {txn.status === "completed"
                        ? txn.label === 0
                          ? "Safe"
                          : "High Risk"
                        : txn.status === "flagged"
                        ? "Flagged"
                        : "Pending"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {txn.device} • {txn.receiver}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayGuardApp;
