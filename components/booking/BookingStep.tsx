const BookingStep = ({ formData, handleChange }: any) => {
    const classes = "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"

    return(
  <>
    <select
      value={formData.booking.type}
      onChange={(e) => handleChange("booking", "type", e.target.value)}
      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
    >
      <option value="Mobile">Mobile</option>
      <option value="In-Store">Store</option>
    </select>
    <input
      placeholder="Invoice Number"
    className={classes}
      value={formData.booking.invoiceNumber}
      onChange={(e: any) =>
        handleChange("booking", "invoiceNumber", e.target.value)
      }
    />
    <input
      type="date"
    className={classes}
      placeholder="Date"
      value={formData.booking.date}
      onChange={(e: any) => handleChange("booking", "date", e.target.value)}
    />
    <input
      type="time"
    className={classes}
      placeholder="Time"
      value={formData.booking.time}
      onChange={(e: any) => handleChange("booking", "time", e.target.value)}
    />
    <textarea
    className={classes}
      placeholder="Notes"
      value={formData.booking.notes}
      onChange={(e: any) => handleChange("booking", "notes", e.target.value)}
    />
  </>
);
}
export default BookingStep