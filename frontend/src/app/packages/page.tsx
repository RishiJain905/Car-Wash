"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BookingCalendar } from "@/components/BookingCalendar";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";
import { MotionCard } from "@/components/Motion";
import toast, { Toaster } from "react-hot-toast";

interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isBestSeller?: boolean;
}

const PACKAGES: Package[] = [
  {
    id: "silver",
    name: "Silver",
    price: 70,
    description: "Essential care for everyday shine.",
    features: [
      "Exterior Hand Wash",
      "Wheel & Tire Cleaning",
      "Interior Vacuum",
      "Window Cleaning",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 140,
    description: "Deep cleaning for a showroom finish.",
    features: [
      "Everything in Silver +",
      "Hand Wax Protection",
      "Leather Conditioning",
      "Steam Clean Interior",
      "Door Jambs Detail",
    ],
    isBestSeller: true,
  },
  {
    id: "diamond",
    name: "Diamond",
    price: 200,
    description: "Ultimate luxury and protection.",
    features: [
      "Everything in Gold +",
      "Clay Bar Treatment",
      "Machine Polish (Paint Correction)",
      "Ceramic Sealant Application",
      "Engine Bay Detail",
    ],
  },
];

type PaymentMethod = "deposit" | "person";

// Utility functions outside component
function formatDate(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

function formatTimeSlot(slot: string): string {
  const [time, period] = slot.split(" ");
  const hour = parseInt(time, 10);
  const endHour = period === "AM" ? hour + 2 : hour + 2;
  const endPeriod = endHour >= 12 ? (endHour > 12 ? "PM" : "PM") : "AM";
  const displayEndHour = endHour > 12 ? endHour - 12 : endHour;
  return `${slot} - ${displayEndHour}:00 ${endPeriod}`;
}

// Package card component to avoid inline functions in map
interface PackageCardProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function PackageCard({ pkg, isSelected, onSelect }: PackageCardProps) {
  const handleClick = useCallback(() => {
    onSelect(pkg.id);
  }, [onSelect, pkg.id]);

  return (
    <MotionCard
      className={`
        bg-surface-light dark:bg-surface-dark border p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full relative group
        ${isSelected
          ? "border-2 border-primary dark:border-white shadow-xl z-10"
          : "border-border-light dark:border-border-dark"
        }
      `}
      // Animate selected state with transform instead of CSS class
      animate={isSelected ? { y: -8 } : { y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {pkg.isBestSeller && (
        <div className="absolute top-0 right-0 left-0 -mt-3 md:-mt-4 flex justify-center">
          <span className="bg-primary text-white text-[10px] md:text-xs font-bold px-3 md:px-4 py-1 uppercase tracking-widest shadow-sm">
            Best Seller
          </span>
        </div>
      )}
      <div className={`mb-6 ${pkg.isBestSeller ? "mt-3 md:mt-4" : ""}`}>
        <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {pkg.name.toUpperCase()}
        </h3>
        <div className="flex items-baseline">
          <span className="text-4xl font-extrabold text-primary dark:text-white">
            ${pkg.price}
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            / session
          </span>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
          {pkg.description}
        </p>
      </div>
      <ul className="space-y-4 mb-8 flex-1">
        {pkg.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span
              className={`material-icons ${
                pkg.isBestSeller
                  ? "text-primary dark:text-white"
                  : "text-green-500"
              } text-sm mr-2 mt-1`}
            >
              {feature.includes("Everything in") ? "star" : "check_circle"}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleClick}
        className={`
          w-full block font-bold py-3 px-4 transition-colors uppercase tracking-widest text-xs
          ${isSelected
            ? "bg-primary hover:bg-[#333333] text-white shadow-lg"
            : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          }
        `}
      >
        {isSelected ? "Selected" : "Select Package"}
      </button>
    </MotionCard>
  );
}

export default function Packages() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string>("gold");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("person");
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the current package lookup
  const currentPackage = useMemo(
    () => PACKAGES.find((p) => p.id === selectedPackage),
    [selectedPackage]
  );

  // Memoize scroll handler
  const scrollToBookingSection = useCallback(() => {
    document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePackageSelect = useCallback((packageId: string): void => {
    setSelectedPackage(packageId);
    setTimeout(() => {
      scrollToBookingSection();
    }, 100);
  }, [scrollToBookingSection]);

  const handleDateSelect = useCallback((date: Date): void => {
    setSelectedDate(date);
    setSelectedSlot(null);
  }, []);

  const handleSlotSelect = useCallback((slot: string): void => {
    setSelectedSlot(slot);
  }, []);

  const handlePaymentMethodChange = useCallback((method: PaymentMethod) => {
    setPaymentMethod(method);
  }, []);

  // Wrapper to call handler with specific value for radio buttons
  const handleDepositChange = useCallback(() => {
    handlePaymentMethodChange("deposit");
  }, [handlePaymentMethodChange]);

  const handlePersonChange = useCallback(() => {
    handlePaymentMethodChange("person");
  }, [handlePaymentMethodChange]);

  const handleConfirmBooking = useCallback(async (): Promise<void> => {
    // Validate all required fields
    if (!selectedPackage || !selectedDate || !selectedSlot) {
      toast.error("Please select a package, date, and time slot to continue.");
      return;
    }

    if (!currentPackage) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const bookingData = {
      package: currentPackage.name,
      price: currentPackage.price,
      date: selectedDate ? formatDate(selectedDate) : null,
      time: selectedSlot,
      paymentMethod,
      deposit: paymentMethod === "deposit" ? currentPackage.price / 2 : null,
      total: currentPackage.price,
    };

    setIsLoading(false);

    // Show success toast
    toast.success("Booking confirmed! Redirecting...");

    // Navigate to confirmation page with booking data as URL params
    const params = new URLSearchParams({
      package: bookingData.package,
      price: bookingData.price.toString(),
      date: bookingData.date || "",
      time: bookingData.time,
      payment: bookingData.paymentMethod,
      total: bookingData.total.toString(),
    });

    // Small delay to show the success toast
    setTimeout(() => {
      router.push(`/booking-confirmation?${params.toString()}`);
    }, 500);
  }, [selectedPackage, selectedDate, selectedSlot, currentPackage, paymentMethod, router]);

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <header className="py-16 md:py-24 bg-surface-light dark:bg-surface-dark text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-primary dark:text-white mb-6">
            Select Your Package
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
            Revitalize your ride with our premium detailing services. Choose the level of care your vehicle deserves.
          </p>
        </div>
      </header>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
          {PACKAGES.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              isSelected={selectedPackage === pkg.id}
              onSelect={handlePackageSelect}
            />
          ))}
        </div>
      </section>

      <section
        className="py-16 px-4 bg-gray-50 dark:bg-[#1a1a1a] border-t border-border-light dark:border-border-dark mt-8 overflow-x-hidden"
        id="booking-section"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl text-primary dark:text-white mb-2">
              Finalize Your Booking
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You selected the{" "}
              <span className="font-bold text-primary dark:text-white">
                {currentPackage?.name} Package
              </span>
              . Choose a time that works for you.
            </p>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark shadow-lg rounded-sm overflow-hidden border border-border-light dark:border-border-dark">
            <div className="md:flex">
              <div className="md:w-1/2 p-4 md:p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center">
                  <span className="material-icons mr-2 text-gray-400">calendar_today</span>{" "}
                  Select Date
                </h3>
                <div className="mb-4">
                  <BookingCalendar
                    selectedDate={selectedDate}
                    onSelectDate={handleDateSelect}
                  />
                </div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-6 md:mt-8 mb-3 uppercase tracking-wider">
                  Available Slots (2 hrs)
                </h4>
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  onSelectSlot={handleSlotSelect}
                />
              </div>
              <div className="md:w-1/2 p-4 md:p-8 bg-gray-50 dark:bg-[#1a1a1a] flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="material-icons mr-2 text-gray-400">receipt_long</span>{" "}
                    Booking Summary
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Service</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {currentPackage?.name} Package
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Date</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedDate ? formatDate(selectedDate) : "Select a date"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Time</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedSlot
                          ? formatTimeSlot(selectedSlot)
                          : "Select a time"}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-xl font-bold text-primary dark:text-white">
                        ${currentPackage?.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    Payment Options
                  </h4>
                  <div className="space-y-3">
                    <label
                      className={`
                        flex items-center p-3 border rounded bg-white dark:bg-gray-800 cursor-pointer transition-colors group
                        ${paymentMethod === "deposit"
                          ? "border-primary dark:border-white ring-1 ring-primary dark:ring-white"
                          : "border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-white"
                        }
                      `}
                    >
                      <input
                        className="form-radio text-primary focus:ring-primary h-4 w-4"
                        name="payment"
                        type="radio"
                        checked={paymentMethod === "deposit"}
                        onChange={handleDepositChange}
                      />
                      <div className="ml-3 flex-1">
                        <span className="block text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-white transition-colors">
                          Pay 50% Deposit Now
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          Secure credit card payment
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        ${((currentPackage?.price ?? 0) / 2).toFixed(2)}
                      </span>
                    </label>
                    <label
                      className={`
                        flex items-center p-3 border rounded bg-white dark:bg-gray-800 cursor-pointer transition-colors group
                        ${paymentMethod === "person"
                          ? "border-primary dark:border-white ring-1 ring-primary dark:ring-white"
                          : "border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-white"
                        }
                      `}
                    >
                      <input
                        className="form-radio text-primary focus:ring-primary h-4 w-4"
                        name="payment"
                        type="radio"
                        checked={paymentMethod === "person"}
                        onChange={handlePersonChange}
                      />
                      <div className="ml-3 flex-1">
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">
                          Pay in Person
                        </span>
                        <span className="block text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                          <span className="material-icons text-xs mr-1">payments</span>{" "}
                          Cash preferred
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        ${(currentPackage?.price ?? 0).toFixed(2)}
                      </span>
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isLoading}
                  className={`
                    w-full font-bold py-3 px-4 mt-8 transition-colors uppercase tracking-widest text-sm shadow-md flex items-center justify-center gap-2
                    ${!isLoading
                      ? "bg-primary hover:bg-[#333333] text-white cursor-pointer"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <span className="material-icons animate-spin text-sm">sync</span>
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
