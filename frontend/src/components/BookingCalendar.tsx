"use client";

import { useState, useCallback, useMemo } from "react";

interface BookingCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Pure utility functions - no need for useCallback
const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month: number, year: number): number => {
  return new Date(year, month, 1).getDay();
};

// Memoized date utilities outside component to avoid recreation
const createStartOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export function BookingCalendar({ selectedDate, onSelectDate }: BookingCalendarProps) {
  const [today] = useState(() => createStartOfDay(new Date()));
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const isDateInPast = useCallback((date: Date): boolean => {
    const checkDate = createStartOfDay(date);
    return checkDate < today;
  }, [today]);

  const handlePrevMonth = useCallback((): void => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback((): void => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  }, [currentMonth]);

  const handleDateClick = useCallback((day: number): void => {
    const selected = new Date(currentYear, currentMonth, day);
    if (!isDateInPast(selected)) {
      onSelectDate(selected);
    }
  }, [currentYear, currentMonth, isDateInPast, onSelectDate]);

  // Memoize calendar days to prevent unnecessary re-renders
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: React.ReactNode[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <span key={`empty-${i}`} className="py-2">
          {""}
        </span>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const inPast = isDateInPast(date);
      const selected = selectedDate?.getDate() === day &&
        selectedDate?.getMonth() === currentMonth &&
        selectedDate?.getFullYear() === currentYear;
      const isTodayDate = day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={inPast}
          className={`
            py-2 rounded-full text-sm font-medium transition-all duration-200 relative
            ${inPast 
              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            }
            ${selected 
              ? "bg-primary text-white shadow-md" 
              : "text-gray-700 dark:text-gray-300"
            }
            ${isTodayDate && !selected 
              ? "ring-1 ring-primary dark:ring-white" 
              : ""
            }
          `}
        >
          {day}
          {isTodayDate && (
            <span className="absolute -top-1 -right-1 bg-accent-yellow text-primary text-[8px] font-bold px-1 rounded">
              Today
            </span>
          )}
        </button>
      );
    }

    return days;
  }, [currentMonth, currentYear, isDateInPast, selectedDate, handleDateClick, today]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
          aria-label="Previous month"
        >
          <span className="material-icons">chevron_left</span>
        </button>
        <span className="font-bold text-gray-800 dark:text-gray-200">
          {MONTHS[currentMonth]} {currentYear}
        </span>
        <button
          onClick={handleNextMonth}
          className="text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
          aria-label="Next month"
        >
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {DAYS_OF_WEEK.map((day) => (
          <span key={day} className="text-gray-400 text-xs font-medium">
            {day}
          </span>
        ))}
        {calendarDays}
      </div>
    </div>
  );
}
