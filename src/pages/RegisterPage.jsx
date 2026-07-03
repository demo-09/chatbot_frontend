import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import {
  IoPersonOutline,
  IoMailOutline,
  IoPhonePortraitOutline,
  IoLockClosedOutline,
  IoSparkles,
  IoAlertCircle
} from "react-icons/io5";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation & Error State
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Full Name is required";
    if (!email) {
      tempErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!phone) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      tempErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long";
    }
    if (!confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await register(name, email, phone, password);
      if (res.success) {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        setApiError(res.message);
        toast.error(res.message);
      }
    } catch (err) {
      setApiError("A network error occurred. Please try again.");
      toast.error("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-chat-bg dark:bg-chat-bg-dark text-slate-800 dark:text-white p-4 relative overflow-hidden transition-colors duration-300">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-indigo/10 dark:bg-brand-indigo/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 dark:bg-brand-purple/15 rounded-full blur-3xl" />

      {/* Main card */}
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/20 dark:border-slate-800 shadow-2xl relative z-10 flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-purple flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 select-none">
            <IoSparkles size={24} />
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-brand-indigo to-brand-purple bg-clip-text text-transparent select-none mt-2">
            SAVAGE.AI
          </h2>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            Sign up to build your roasting profile
          </p>
        </div>

        {/* Global Error Alert */}
        {apiError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-2.5">
            <IoAlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="font-semibold">{apiError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <Input
            label="Full Name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="John Doe"
            icon={IoPersonOutline}
            required
          />

          <Input
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="john@example.com"
            icon={IoMailOutline}
            required
          />

          <Input
            label="Phone Number"
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            placeholder="1234567890"
            icon={IoPhonePortraitOutline}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••"
              icon={IoLockClosedOutline}
              required
            />

            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              placeholder="••••••"
              icon={IoLockClosedOutline}
              required
            />
          </div>

          <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3.5 mt-2">
            Create Account
          </Button>
        </form>

        {/* Bottom footer link */}
        <div className="text-center text-sm font-semibold text-slate-400 dark:text-slate-500 mt-1 select-none">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-indigo dark:text-brand-purple hover:underline font-extrabold ml-1"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
