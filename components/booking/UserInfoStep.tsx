import React, { useState } from "react";

const UserInfoStep = ({ formData, handleChange }: any) => {
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  const classes =
    "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 my-1";

  // ✅ Validation logic
  const validateField = (field: string, value: string) => {
    let message = "";

    switch (field) {
      case "firstname":
        if (!value.trim()) message = "First name is required";
        break;

      case "lastname":
        if (!value.trim()) message = "Last name is required";
        break;

      case "email":
        if (!value.trim()) message = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          message = "Invalid email format";
        break;

      case "phone":
        if (!value.trim()) message = "Phone number is required";
        else if (!/^[0-9+\-()\s]{6,20}$/.test(value))
          message = "Invalid phone number";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  // ✅ Combined change + validation
  const handleInputChange = (section: string, field: string, value: string) => {
    handleChange(section, field, value);
    validateField(field, value);
  };

  return (
    <>
      {/* First Name */}
      <div>
        <input
          className={`${classes} ${
            errors.firstname ? "border-red-500 focus:border-red-500" : ""
          }`}
          placeholder="First Name"
          value={formData.userInfo.firstname}
          onChange={(e: any) =>
            handleInputChange("userInfo", "firstname", e.target.value)
          }
          onBlur={(e: any) => validateField("firstname", e.target.value)}
        />
        {errors.firstname && (
          <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <input
          className={`${classes} ${
            errors.lastname ? "border-red-500 focus:border-red-500" : ""
          }`}
          placeholder="Last Name"
          value={formData.userInfo.lastname}
          onChange={(e: any) =>
            handleInputChange("userInfo", "lastname", e.target.value)
          }
          onBlur={(e: any) => validateField("lastname", e.target.value)}
        />
        {errors.lastname && (
          <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          className={`${classes} ${
            errors.email ? "border-red-500 focus:border-red-500" : ""
          }`}
          placeholder="Email"
          value={formData.userInfo.email}
          onChange={(e: any) =>
            handleInputChange("userInfo", "email", e.target.value)
          }
          onBlur={(e: any) => validateField("email", e.target.value)}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <input
          type="text"
          className={`${classes} ${
            errors.phone ? "border-red-500 focus:border-red-500" : ""
          }`}
          placeholder="Phone"
          value={formData.userInfo.phone}
          onChange={(e: any) =>
            handleInputChange("userInfo", "phone", e.target.value)
          }
          onBlur={(e: any) => validateField("phone", e.target.value)}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>
    </>
  );
};

export default UserInfoStep;
