import React, { useState } from "react";
import { CircleArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCreateUser from "../../hooks/user/CreateUser";

const FileInput = ({ label, value, onChange, placeholder, type = "text", required = false, id }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium flex items-center">
      <FileText className="mr-2 h-4 w-4 text-blue-500" />
      {label}
    </label>
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      className="h-12 w-full border rounded px-4"
      required={required}
    />
  </div>
);

const AddUser = () => {
  const navigate = useNavigate()
  const createUser = useCreateUser();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "", // Added confirmPassword
    isAdmin: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState(""); // To store password error
  const [passwordMatch, setPasswordMatch] = useState(true); // To track if passwords match

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
    // Check password length and matching in real-time
    if (id === "password" && value.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else if (id === "password") {
      setPasswordError(""); // Clear error if it meets the length requirement
    }

    if (id === "confirmPassword") {
      setPasswordMatch(value === formData.password); // Check if passwords match
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit the form data to the API or handle it here
      setIsSubmitting(false);
      const response = await createUser(formData);
      navigate('/manage-user'); // Redirect to user management page
    } catch (err) {
      setError("Failed to add user.");
      setIsSubmitting(false);
    }
  };

  const handleCloseView = () => {
    navigate("/manage-user");
  };

  return (

      <div className="w-full shadow-2xl p-5">
        <div className="flex items-center gap-2">
          <i onClick={handleCloseView} className="text-gray-600 hover:text-gray-700 cursor-pointer">
            <CircleArrowLeft />
          </i>
          <h2 className="text-lg text-gray-600 font-semibold">Add Users Form</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 p-6">
            <FileInput
              label="Unit"
              value={formData.fname}
              onChange={handleInputChange}
              id="fname"
              placeholder="Enter unit name"
              required
            />
            <FileInput
              label="Description"
              value={formData.lname}
              onChange={handleInputChange}
              id="lname"
              placeholder="Enter description"
              required
            />
            <FileInput
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              id="email"
              placeholder="Enter email"
              type="email"
              required
            />
            <FileInput
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              id="password"
              placeholder="Enter password"
              type="password"
              required
            />
            {passwordError && <div className="text-red-500">{passwordError}</div>} {/* Show password length error */}
            <FileInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              id="confirmPassword"
              placeholder="Confirm password"
              type="password"
              required
            />
            {!passwordMatch && <div className="text-red-500">Passwords do not match.</div>} {/* Show real-time password match error */}
            {error && <div className="text-red-500">{error}</div>} {/* Show error message if passwords don't match */}
            <div className="space-y-2">
              <label htmlFor="isAdmin" className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4 text-blue-500" />
                Role
              </label>
              <select
                id="isAdmin"
                value={formData.isAdmin}
                onChange={(e) => setFormData({ ...formData, isAdmin: e.target.value === "true" })}
                className="h-12 w-full border rounded px-4 dark:bg-[#333334]"
                required
              >
                <option value={true}>Client/Unit</option>
                <option value={false}>Admin</option>
                
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 border-t bg-blue-50 dark:bg-[#252728]  px-6 py-4">
            <button type="button" onClick={handleCloseView} className="h-12 px-6 border rounded">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="h-12 px-6 bg-blue-600 text-white rounded">
              {isSubmitting ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
  );
};

export default AddUser;
