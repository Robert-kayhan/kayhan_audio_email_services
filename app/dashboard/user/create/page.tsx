"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import { useCreateSingleUserMutation } from "@/store/api/UserApi";

const CreateUserPage = () => {
  const [createSingleUser] = useCreateSingleUserMutation();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    street: "",
    postcode: "",
  });

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const countryOptions = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((state) => ({
        label: state.name,
        value: state.isoCode,
      }))
    : [];

  const cityOptions = selectedState
    ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
        (city) => ({
          label: city.name,
          value: city.name,
        })
      )
    : [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { firstname, lastname, email, phone, street, postcode } = formData;
    if (!firstname.trim()) return toast.error("First name is required");
    if (!lastname.trim()) return toast.error("Last name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email");
    if (!phone.trim()) return toast.error("Phone number is required");
    if (!/^\d{10,15}$/.test(phone)) return toast.error("Invalid phone");
    if (!selectedCountry) return toast.error("Country is required");
    if (!selectedState) return toast.error("State is required");
    if (!selectedCity) return toast.error("City is required");
    if (!street.trim()) return toast.error("Street is required");
    if (!postcode.trim()) return toast.error("Postcode is required");

    const payload = {
      ...formData,
      country: selectedCountry.label,
      state: selectedState.label,
      city: selectedCity.label,
    };
    console.log(payload , "this is payload")
    try {
      const res = await createSingleUser(payload).unwrap();
      toast.success(res.message || "User created successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-semibold mb-2 text-center">Create New User</h2>
        <p className="text-center text-gray-400 mb-8">Fill in the details below</p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <InputField label="First Name" name="firstname" value={formData.firstname} onChange={handleInputChange} />
          <InputField label="Last Name" name="lastname" value={formData.lastname} onChange={handleInputChange} />
          <InputField type="email" label="Email" name="email" value={formData.email} onChange={handleInputChange} full />
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
          <div>
            <label className="block text-sm mb-1">Country</label>
            <Select
              options={countryOptions}
              value={selectedCountry}
              onChange={(value) => {
                setSelectedCountry(value);
                setSelectedState(null);
                setSelectedCity(null);
              }}
              className="text-black"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">State</label>
            <Select
              options={stateOptions}
              value={selectedState}
              onChange={(value) => {
                setSelectedState(value);
                setSelectedCity(null);
              }}
              isDisabled={!selectedCountry}
              className="text-black"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">City</label>
            <Select
              options={cityOptions}
              value={selectedCity}
              onChange={setSelectedCity}
              isDisabled={!selectedState}
              className="text-black"
              classNamePrefix="select"
            />
          </div>
          <InputField label="Street Address" name="street" value={formData.street} onChange={handleInputChange} full />
          <InputField label="Postcode" name="postcode" value={formData.postcode} onChange={handleInputChange} />

          <div className="md:col-span-2 text-right mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition font-medium"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  full = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  full?: boolean;
}) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
      className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default CreateUserPage;
