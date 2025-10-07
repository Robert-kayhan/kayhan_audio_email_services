import React, { useState } from "react";

const BookingStep = ({ formData, handleChange }: any) => {
  const [errors, setErrors] = useState<any>({});

  const classes =
    "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 my-2";

  // Validation for individual fields
  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "type":
        if (!value) error = "Booking type is required.";
        break;
      case "invoiceNumber":
        if (!value.trim()) error = "Invoice number is required.";
        else if (!/^[A-Za-z0-9-_]+$/.test(value))
          error = "Invalid invoice number format.";
        break;
      case "date":
        if (!value) error = "Date is required.";
        else if (new Date(value) < new Date(new Date().toDateString()))
          error = "Booking date cannot be in the past.";
        break;
      case "time":
        if (!value) error = "Time is required.";
        break;
      case "notes":
        if (value.length > 500) error = "Notes should be under 500 characters.";
        break;
    }

    setErrors((prev: any) => ({ ...prev, [field]: error }));
  };

  // Handle changes with validation
  const handleInputChange = (key: string, value: string) => {
    handleChange("booking", key, value);
    validateField(key, value);
  };

  return (
    <>
      {/* Booking Type */}
      <select
        value={formData.booking.type}
        onChange={(e) => handleInputChange("type", e.target.value)}
        onBlur={(e) => validateField("type", e.target.value)}
        className={classes}
      >
        <option value="">Select Booking Type</option>
        <option value="Mobile">Mobile</option>
        <option value="In-Store">In-Store</option>
      </select>
      {errors.type && <p className="text-red-400 text-sm">{errors.type}</p>}

      {/* Invoice Number */}
      <input
        placeholder="Invoice Number"
        className={classes}
        value={formData.booking.invoiceNumber}
        onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
        onBlur={(e) => validateField("invoiceNumber", e.target.value)}
      />
      {errors.invoiceNumber && (
        <p className="text-red-400 text-sm">{errors.invoiceNumber}</p>
      )}

      {/* Date */}
      <input
        type="date"
        className={classes}
        placeholder="Date"
        value={formData.booking.date}
        onChange={(e) => handleInputChange("date", e.target.value)}
        onBlur={(e) => validateField("date", e.target.value)}
      />
      {errors.date && <p className="text-red-400 text-sm">{errors.date}</p>}

      {/* Time */}
      <input
        type="time"
        className={classes}
        placeholder="Time"
        value={formData.booking.time}
        onChange={(e) => handleInputChange("time", e.target.value)}
        onBlur={(e) => validateField("time", e.target.value)}
      />
      {errors.time && <p className="text-red-400 text-sm">{errors.time}</p>}

      {/* Notes */}
      <textarea
        className={classes}
        placeholder="Notes"
        value={formData.booking.notes}
        onChange={(e) => handleInputChange("notes", e.target.value)}
        onBlur={(e) => validateField("notes", e.target.value)}
      />
      {errors.notes && <p className="text-red-400 text-sm">{errors.notes}</p>}
    </>
  );
};

export default BookingStep;
