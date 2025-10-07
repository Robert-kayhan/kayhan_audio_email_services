export const validateFormData = (data: any) => {
  const errors: any = {};

  // ✅ User Info Validation
  if (!data.userInfo.firstname.trim())
    errors.firstname = "First name is required";

  if (!data.userInfo.lastname.trim()) errors.lastname = "Last name is required";

  if (!data.userInfo.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userInfo.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.userInfo.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[0-9+\-()\s]{6,20}$/.test(data.userInfo.phone)) {
    errors.phone = "Invalid phone number format";
  }

  // ✅ Vehicle Validation
  if (!data.vehicle.make.trim()) errors.make = "Vehicle make is required";
  if (!data.vehicle.model.trim()) errors.model = "Vehicle model is required";
  if (!data.vehicle.year.trim()) errors.year = "Vehicle year is required";
  if (!/^\d{4}$/.test(data.vehicle.year)) errors.year = "Year must be 4 digits";
  if (!data.vehicle.vin.trim()) errors.vin = "Register is required";

  // ✅ Booking Validation
  if (!data.booking.type.trim())
    errors.bookingType = "Booking type is required";
  if (!data.booking.invoiceNumber.trim())
    errors.invoiceNumber = "Invoice number is required";

  if (!data.booking.date.trim()) {
    errors.bookingDate = "Booking date is required";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.booking.date)) {
    errors.bookingDate = "Invalid date format (use YYYY-MM-DD)";
  }

  if (!data.booking.time.trim())
    errors.bookingTime = "Booking time is required";

  // ✅ Items Validation
  if (!Array.isArray(data.items.list) || data.items.list.length === 0) {
    errors.items = "At least one item must be added";
  }

  if (data.items.totalAmount <= 0) {
    errors.totalAmount = "Total amount must be greater than 0";
  }

  // ✅ Mobile Booking Details (only if Mobile type)
  if (data.booking.type === "Mobile") {
    if (!data.mobileDetails.pickup.trim())
      errors.pickup = "Pickup address is required";
    if (!data.mobileDetails.drop.trim())
      errors.drop = "Drop address is required";
  }

  // ✅ Payment Validation
  if (!data.payment.category.trim())
    errors.paymentCategory = "Payment category required";
  if (!data.payment.type.trim()) errors.paymentType = "Payment type required";

  if (data.payment.type === "Partial" && !data.payment.partialAmount) {
    errors.partialAmount = "Partial amount required";
  }

  return errors;
};
