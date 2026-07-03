import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import Input from "./Input";
import { IoPerson, IoMail, IoPhonePortrait, IoLockClosed } from "react-icons/io5";
import toast from "react-hot-toast";

export default function ProfileCard({ onClose }) {
  const { user, updateProfile, changePassword } = useAuth();
  
  // Profile Update Form State
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error("Please fill in all profile fields");
      return;
    }
    
    setIsUpdating(true);
    try {
      const res = await updateProfile({ name, email, phone });
      if (res.success) {
        toast.success("Profile details updated successfully!");
        onClose();
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred during update");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-slate-800 dark:text-slate-200">
      {/* Profile Details Section */}
      <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
        <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1">
          Profile Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            id="name-update"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={IoPerson}
            required
          />
          <Input
            label="Email"
            id="email-update"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={IoMail}
            type="email"
            required
          />
        </div>
        <Input
          label="Phone Number"
          id="phone-update"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={IoPhonePortrait}
          type="tel"
          required
        />
        <Button type="submit" variant="primary" isLoading={isUpdating} className="w-full">
          Update Profile Details
        </Button>
      </form>

      {/* Change Password Section */}
      <form onSubmit={handleChangePassword} className="flex flex-col gap-4 mt-2">
        <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1">
          Change Password
        </h4>
        <Input
          label="Current Password"
          id="curr-pass"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          icon={IoLockClosed}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="New Password"
            id="new-pass"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={IoLockClosed}
            required
          />
          <Input
            label="Confirm New Password"
            id="conf-pass"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={IoLockClosed}
            required
          />
        </div>
        <Button type="submit" variant="secondary" isLoading={isChangingPass} className="w-full">
          Change Account Password
        </Button>
      </form>
    </div>
  );
}
