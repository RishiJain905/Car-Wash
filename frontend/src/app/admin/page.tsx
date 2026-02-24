"use client";

import { useState, useCallback, useMemo } from "react";

// Types for the admin dashboard
type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

interface Booking {
  id: string;
  date: string;
  time: string;
  package: string;
  clientName: string;
  email: string;
  phone: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  status: BookingStatus;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: "New" | "Read" | "Archived";
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

// Password for admin (NOTE: This should be changed in production and moved to server-side)
const ADMIN_PASSWORD = "admin123";

type TabType = "bookings" | "inquiries" | "blocked-dates";

// Status color helper - moved outside component to avoid recreation
function getStatusColor(status: BookingStatus): string {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Confirmed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Payment status color helper - moved outside component
function getPaymentStatusColor(status: string): string {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Inquiry status color helper - moved outside component
function getInquiryStatusColor(status: string): string {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Read":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    case "Archived":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Format date helper - moved outside component
function formatDate(dateStr: string, options: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString("en-US", options);
}

// Mock data for bookings
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK001",
    date: "2026-02-24",
    time: "09:00 AM",
    package: "Premium Detail",
    clientName: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    paymentStatus: "Paid",
    status: "Confirmed",
  },
  {
    id: "BK002",
    date: "2026-02-24",
    time: "01:00 PM",
    package: "Express Wash",
    clientName: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    paymentStatus: "Pending",
    status: "Pending",
  },
  {
    id: "BK003",
    date: "2026-02-25",
    time: "10:00 AM",
    package: "Ceramic Coating",
    clientName: "Michael Brown",
    email: "m.brown@email.com",
    phone: "(555) 345-6789",
    paymentStatus: "Paid",
    status: "Completed",
  },
  {
    id: "BK004",
    date: "2026-02-26",
    time: "02:00 PM",
    package: "Interior Detail",
    clientName: "Emily Davis",
    email: "emily.d@email.com",
    phone: "(555) 456-7890",
    paymentStatus: "Paid",
    status: "Confirmed",
  },
  {
    id: "BK005",
    date: "2026-02-27",
    time: "11:00 AM",
    package: "Full Detailing",
    clientName: "Robert Wilson",
    email: "r.wilson@email.com",
    phone: "(555) 567-8901",
    paymentStatus: "Failed",
    status: "Cancelled",
  },
  {
    id: "BK006",
    date: "2026-02-28",
    time: "09:00 AM",
    package: "Premium Detail",
    clientName: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "(555) 678-9012",
    paymentStatus: "Paid",
    status: "Pending",
  },
];

// Mock data for inquiries
const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "INQ001",
    name: "David Thompson",
    email: "david.t@email.com",
    message: "Hi, I'm interested in getting my new Tesla Model 3 detailed. What packages do you recommend for a new car? Do you offer any ceramic coating options?",
    date: "2026-02-22",
    status: "New",
  },
  {
    id: "INQ002",
    name: "Jennifer Martinez",
    email: "j.martinez@email.com",
    message: "Hello, I would like to inquire about mobile detailing services. Do you come to the customer's location or is it only at your shop?",
    date: "2026-02-21",
    status: "Read",
  },
  {
    id: "INQ003",
    name: "Christopher Lee",
    email: "c.lee@email.com",
    message: "I have a vintage 1967 Mustang that needs restoration detailing. Do you have experience with classic cars? Looking for a full interior and exterior detail.",
    date: "2026-02-20",
    status: "Archived",
  },
];

// Mock blocked dates
const MOCK_BLOCKED_DATES: BlockedDate[] = [
  {
    id: "BLK001",
    date: "2026-03-15",
    reason: "Family vacation",
  },
  {
    id: "BLK002",
    date: "2026-03-20",
    reason: "Shop maintenance",
  },
];

export default function AdminPage() {
  // Initialize auth state from sessionStorage lazily (only runs once on client)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("adminAuthenticated") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("bookings");
  
  // Booking state
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  
  // Inquiry state
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  
  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(MOCK_BLOCKED_DATES);
  const [selectedDate, setSelectedDate] = useState("");
  const [blockReason, setBlockReason] = useState("");

  // Memoized values for expensive computations
  const newInquiriesCount = useMemo(
    () => inquiries.filter((i) => i.status === "New").length,
    [inquiries]
  );

  // Memoize today's date to avoid recomputation on each render
  const todayStr = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // Handle login
  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuthenticated", "true");
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  }, [password]);

  // Handle logout
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuthenticated");
    setPassword("");
  }, []);

  // Update booking status
  const updateBookingStatus = useCallback((bookingId: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  }, []);

  // Handle booking status change from select
  const handleBookingStatusChange = useCallback((bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus(bookingId, newStatus);
  }, [updateBookingStatus]);

  // Update inquiry status
  const updateInquiryStatus = useCallback((inquiryId: string, newStatus: Inquiry["status"]) => {
    setInquiries((prev) =>
      prev.map((inquiry) =>
        inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
      )
    );
  }, []);

  // Add blocked date
  const addBlockedDate = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    const newBlockedDate: BlockedDate = {
      id: `BLK${Date.now()}`,
      date: selectedDate,
      reason: blockReason || "Blocked",
    };
    
    setBlockedDates((prev) => [...prev, newBlockedDate]);
    setSelectedDate("");
    setBlockReason("");
  }, [selectedDate, blockReason]);

  // Remove blocked date
  const removeBlockedDate = useCallback((id: string) => {
    setBlockedDates((prev) => prev.filter((date) => date.id !== id));
  }, []);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
        <div className="max-w-md w-full">
          <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <span className="material-icons text-5xl text-primary dark:text-white">admin_panel_settings</span>
              <h1 className="mt-4 text-2xl font-bold font-display text-primary dark:text-white">
                Admin Login
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Enter your password to access the dashboard
              </p>
            </div>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Login
              </button>
            </form>
            
            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              Note: Default password is &quot;admin123&quot; - Change in production
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-surface-light dark:bg-surface-dark shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-icons text-3xl text-primary dark:text-white">dashboard</span>
              <h1 className="text-2xl font-bold font-display text-primary dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <span className="material-icons text-sm">logout</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => handleTabChange("bookings")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "bookings"
                ? "border-b-2 border-primary text-primary dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-icons text-sm">event</span>
              Bookings
              <span className="ml-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                {bookings.length}
              </span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange("inquiries")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "inquiries"
                ? "border-b-2 border-primary text-primary dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-icons text-sm">mail</span>
              Inquiries
              <span className="ml-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                {newInquiriesCount}
              </span>
            </span>
          </button>
          <button
            onClick={() => handleTabChange("blocked-dates")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "blocked-dates"
                ? "border-b-2 border-primary text-primary dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-icons text-sm">event_busy</span>
              Blocked Dates
            </span>
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(booking.date, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {booking.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {booking.package}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {booking.clientName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.status}
                          onChange={(e) => handleBookingStatusChange(booking.id, e.target.value as BookingStatus)}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-surface-light dark:bg-surface-dark rounded-lg shadow p-6 border-l-4 border-primary"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {inquiry.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {inquiry.email}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDate(inquiry.date, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getInquiryStatusColor(inquiry.status)}`}>
                    {inquiry.status}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 whitespace-pre-wrap">
                  {inquiry.message}
                </p>
                <div className="flex gap-2">
                  {inquiry.status !== "Read" && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, "Read")}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  {inquiry.status !== "Archived" && (
                    <button
                      onClick={() => updateInquiryStatus(inquiry.id, "Archived")}
                      className="px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-md transition-colors"
                    >
                      Archive
                    </button>
                  )}
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="px-3 py-1.5 text-sm font-medium text-primary dark:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    Reply
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blocked Dates Tab */}
        {activeTab === "blocked-dates" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Blocked Date Form */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Block a Date
              </h3>
              <form onSubmit={addBlockedDate}>
                <div className="mb-4">
                  <label htmlFor="blockDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    id="blockDate"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="blockReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    id="blockReason"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="e.g., Vacation, Maintenance, etc."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Block Date
                </button>
              </form>
            </div>

            {/* Calendar Preview */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Blocked Dates Calendar
              </h3>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                  {/* Simple calendar for current month */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 5; // Start from approximate month start
                    const dateStr = day > 0 
                      ? `2026-02-${day.toString().padStart(2, "0")}`
                      : null;
                    const isBlocked = dateStr && blockedDates.some((bd) => bd.date === dateStr);
                    const isToday = dateStr === todayStr;
                    
                    return (
                    <div
                      key={i}
                      className={`
                        p-2 text-sm rounded-md
                        ${isBlocked 
                          ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 font-medium" 
                          : day > 0 && day <= 28
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-300 dark:text-gray-600"
                        }
                        ${isToday ? "ring-2 ring-primary" : ""}
                      `}
                    >
                      {day > 0 && day <= 28 ? day : ""}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blocked Dates List */}
            <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  All Blocked Dates
                </h3>
              </div>
              {blockedDates.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {blockedDates.map((blocked) => (
                    <li key={blocked.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(blocked.date, {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {blocked.reason}
                        </p>
                      </div>
                      <button
                        onClick={() => removeBlockedDate(blocked.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                        aria-label="Remove blocked date"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <span className="material-icons text-4xl mb-2">event_available</span>
                  <p>No blocked dates</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
