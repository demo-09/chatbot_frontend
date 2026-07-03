import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { IoCloudUploadOutline, IoImageOutline, IoClose, IoFlameOutline } from "react-icons/io5";
import Button from "./Button";

export default function ImageUploader({ onRoastImage, isLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    // Clear input so same image can be reselected
    e.target.value = "";
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setImageBase64(null);
  };

  const handleUploadSubmit = () => {
    if (imageBase64 && !isLoading) {
      onRoastImage(imageBase64);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex flex-col gap-6 text-center">
        {/* Title details */}
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Upload Image to <span className="bg-gradient-to-r from-brand-indigo to-brand-purple bg-clip-text text-transparent">Roast</span>
          </h2>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-2">
            Drag and drop a screenshot, selfie, or coding setup. AI will savagely review it.
          </p>
        </div>

        {/* Uploader Box */}
        <motion.div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={imagePreview ? undefined : triggerSelect}
          whileHover={imagePreview ? {} : { scale: 1.01 }}
          whileTap={imagePreview ? {} : { scale: 0.99 }}
          className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[300px] cursor-pointer
            ${
              dragActive
                ? "border-brand-indigo bg-brand-indigo/5 dark:bg-brand-indigo/10 shadow-lg shadow-indigo-500/10"
                : "border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 hover:border-slate-350 dark:hover:border-slate-700"
            }
            ${imagePreview ? "cursor-default" : ""}
          `}
        >
          {imagePreview ? (
            <div className="flex flex-col items-center gap-5 w-full relative">
              {/* Image box */}
              <div className="relative group max-w-full max-h-[220px] rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-850">
                <img
                  src={imagePreview}
                  alt="Roast preview"
                  className="max-h-[220px] object-contain w-auto rounded-xl"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
                  title="Remove image"
                >
                  <IoClose size={18} />
                </button>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Image attached</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ready to upload</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {/* Icon indicator */}
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-450 shadow-inner">
                <IoCloudUploadOutline size={26} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Drag & Drop image here
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  or <span className="text-brand-indigo dark:text-brand-purple hover:underline font-bold">browse folders</span>
                </p>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold">
                Supports JPG, PNG, WEBP (Max 5MB)
              </p>
            </div>
          )}
        </motion.div>

        {/* Submit Roast button */}
        {imagePreview && (
          <Button
            onClick={handleUploadSubmit}
            isLoading={isLoading}
            className="w-full py-4 text-base font-extrabold flex items-center gap-2 select-none"
            variant="primary"
          >
            <IoFlameOutline size={20} className={isLoading ? "" : "animate-bounce"} />
            <span>Generate Savage Roast!</span>
          </Button>
        )}
      </div>
    </div>
  );
}
