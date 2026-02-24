"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface BookingData {
  package: string;
  price: number;
  date: string;
  time: string;
  paymentMethod: string;
  total: number;
}

// Input validation constants
const MIN_PRICE = 0;
const MAX_PRICE = 10000;
const VALID_PAYMENT_METHODS = ["deposit", "person"];

/**
 * Sanitize user input to prevent XSS attacks
 * Strips any HTML tags and script content from the input
 */
function sanitizeInput(input: string): string {
  // Remove any HTML tags
  const stripped = input.replace(/<[^>]*>/g, "");
  // Remove script tags and their content
  const noScript = stripped.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  // Remove event handlers (onclick, onerror, etc.)
  const noEvents = noScript.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  // Trim and return
  return noEvents.trim();
}

/**
 * Validate numeric values are within reasonable bounds
 */
function validateNumericValue(value: number, min: number, max: number): boolean {
  return !isNaN(value) && value >= min && value <= max;
}

function generateConfirmationNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `NS-${timestamp}-${random}`;
}

function parseTimeToISO(dateStr: string, timeStr: string): { start: string; end: string } {
  // Parse date like "Mon, Feb 23"
  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };

  // Extract day and month from date string
  const parts = dateStr.split(", ")[1]?.split(" ") || [];
  const month = months[parts[0]] || "01";
  const day = parts[1]?.padStart(2, "0") || "01";
  const year = new Date().getFullYear().toString();

  // Parse time like "9:00 AM"
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hours = 0;
  let minutes = "00";

  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    minutes = timeMatch[2];
    const period = timeMatch[3].toUpperCase();

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    hours = hour;
  }

  const startISO = `${year}${month}${day}T${hours.toString().padStart(2, "0")}${minutes}00`;
  
  // End time is 2 hours later
  const endHours = (hours + 2) % 24;
  const endISO = `${year}${month}${day}T${endHours.toString().padStart(2, "0")}${minutes}00`;

  return { start: startISO, end: endISO };
}

function formatPaymentMethod(method: string): string {
  if (method === "deposit") {
    return "Pay 50% Deposit Now";
  }
  return "Pay in Person";
}

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const [confirmationNumber] = useState(() => generateConfirmationNumber());

  const bookingData = useMemo<BookingData | null>(() => {
    const packageName = searchParams.get("package");
    const price = searchParams.get("price");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const paymentMethod = searchParams.get("payment");
    const total = searchParams.get("total");

    if (!packageName || !date || !time || !paymentMethod) {
      return null;
    }

    // Parse numeric values
    const parsedPrice = price ? parseInt(price, 10) : 0;
    const parsedTotal = total ? parseInt(total, 10) : 0;

    // Validate price is within reasonable bounds
    if (!validateNumericValue(parsedPrice, MIN_PRICE, MAX_PRICE)) {
      console.error("Invalid price value:", price);
      return null;
    }

    // Validate total is within reasonable bounds
    if (!validateNumericValue(parsedTotal, MIN_PRICE, MAX_PRICE)) {
      console.error("Invalid total value:", total);
      return null;
    }

    // Validate payment method
    if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
      console.error("Invalid payment method:", paymentMethod);
      return null;
    }

    // Sanitize package name to prevent XSS
    const sanitizedPackage = sanitizeInput(packageName);

    return {
      package: sanitizedPackage,
      price: parsedPrice,
      date,
      time,
      paymentMethod,
      total: parsedTotal,
    };
  }, [searchParams]);

  const googleCalendarUrl = useMemo(() => {
    if (!bookingData) return "";

    const { start, end } = parseTimeToISO(bookingData.date, bookingData.time);
    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const textParam = `&text=Car+Detailing+Appointment`;
    const datesParam = `&dates=${start}/${end}`;
    const detailsParam = `&details=Package:+${encodeURIComponent(bookingData.package)}%0APayment:+${encodeURIComponent(formatPaymentMethod(bookingData.paymentMethod))}`;

    return `${baseUrl}${textParam}${datesParam}${detailsParam}`;
  }, [bookingData]);

  if (!bookingData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">
          error_outline
        </span>
        <h1 className="font-display text-3xl text-primary dark:text-white mb-4">
          Invalid Booking
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We couldn&apos;t find your booking details. Please start a new booking.
        </p>
        <Link
          href="/packages"
          className="bg-primary hover:bg-[#333333] text-white font-bold py-3 px-8 transition-colors uppercase tracking-widest text-sm"
        >
          Start New Booking
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
            <span className="material-icons text-4xl text-green-600 dark:text-green-400">
              check_circle
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-primary dark:text-white mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your booking has been confirmed. We look forward to seeing you!
          </p>
        </motion.div>

        {/* Confirmation Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-surface-light dark:bg-surface-dark shadow-xl rounded border border-border-light dark:border-border-dark overflow-hidden mb-8"
        >
          <div className="bg-primary dark:bg-gray-800 px-6 py-4 text-center">
            <p className="text-white/80 text-sm uppercase tracking-wider">
              Confirmation Number
            </p>
            <p className="text-white font-mono text-xl font-bold mt-1">
              {confirmationNumber}
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Package */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <span className="material-icons mr-2 text-gray-400">inventory_2</span>
                Package
              </span>
              <span className="font-bold text-gray-900 dark:text-white text-lg">
                {bookingData.package} Package
              </span>
            </div>

            {/* Date & Time */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <span className="material-icons mr-2 text-gray-400">schedule</span>
                Date & Time
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {bookingData.date} at {bookingData.time}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <span className="material-icons mr-2 text-gray-400">payment</span>
                Payment
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatPaymentMethod(bookingData.paymentMethod)}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-primary dark:text-white">
                ${bookingData.total.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 transition-colors uppercase tracking-widest text-sm"
          >
            <span className="material-icons">event_available</span>
            Add to Calendar
          </a>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-[#333333] text-white font-bold py-3 px-8 transition-colors uppercase tracking-widest text-sm"
          >
            <span className="material-icons">home</span>
            Back to Home
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A confirmation email will be sent to your registered email address.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Need to make changes? Call us at{" "}
            <span className="font-medium text-primary dark:text-white">(555) 123-4567</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function BookingConfirmation() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="material-icons animate-spin text-4xl text-primary">
            sync
          </span>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
