"use client";

import { useState } from "react";

interface TimeSlotPickerProps {
  selectedDate: Date | null;
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}

const TIME_SLOTS = [
  { id: "09:00 AM", label: "09:00 AM" },
  { id: "11:00 AM", label: "11:00 AM" },
  { id: "01:00 PM", label: "01:00 PM" },
  { id: "03:00 PM", label: "03:00 PM" },
];

export function TimeSlotPicker({ selectedDate, selectedSlot, onSelectSlot }: TimeSlotPickerProps) {
  const [bookedSlots] = useState<string[]>([]);

  const isSlotBooked = (slot: string): boolean => {
    return bookedSlots.includes(slot);
  };

  if (!selectedDate) {
    return (
      <div className="text-center py-8">
        <span className="material-icons text-gray-300 dark:text-gray-600 text-4xl mb-2">
          schedule
        </span>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please select a date first
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {TIME_SLOTS.map((slot) => {
        const booked = isSlotBooked(slot.id);
        const selected = selectedSlot === slot.id;

        return (
          <button
            key={slot.id}
            onClick={() => !booked && onSelectSlot(slot.id)}
            disabled={booked}
            className={`
              border py-2 px-3 text-sm transition-all duration-200 rounded
              ${booked
                ? "border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed line-through"
                : selected
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary dark:hover:border-white hover:text-primary dark:hover:text-white"
              }
            `}
          >
            {slot.label}
          </button>
        );
      })}
    </div>
  );
}
