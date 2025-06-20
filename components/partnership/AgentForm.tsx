"use client";

import { UploadCloud } from "lucide-react";

const InputField = ({
  id,
  label,
  placeholder,
  isRequired = false,
}: {
  id: string;
  label: string;
  placeholder: string;
  isRequired?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium">
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
    <div className="mt-1">
      <input
        type="text"
        id={id}
        name={id}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
      />
    </div>
  </div>
);

const FileInput = ({ id, label }: { id: string; label: string }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type="file"
        id={id}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex justify-between items-center w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] text-gray-400">
        <span>Choose File</span>
        <UploadCloud className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const AgentForm = () => {
  return (
    <div className="bg-[#ECEBED] dark:bg-[#3C3447] p-8 rounded-2xl">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Become an Agent
      </h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-8 space-y-6 dark:text-gray-300"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            id="first-name"
            label="First Name"
            placeholder="Enter Childs first name"
            isRequired
          />
          <InputField
            id="last-name"
            label="Last Name"
            placeholder="Enter Childs last name"
            isRequired
          />
        </div>
        <InputField
          id="company-name"
          label="Company Name"
          placeholder="YYYY-MM-DD"
          isRequired
        />
        <InputField
          id="email"
          label="Email"
          placeholder="demo@gmail.com"
          isRequired
        />
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex gap-2">
            <select className="px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] focus:ring-2 focus:ring-purple-500 outline-none">
              <option>+880</option>
              <option>+1</option>
            </select>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="12345678"
              className="w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FileInput id="void-check" label="Void Check" />
          <FileInput id="photo-id" label="Photo ID" />
        </div>
        <FileInput id="ein" label="EIN (Tax ID)" />
        <div>
          <button
            type="submit"
            className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 hover:opacity-90 transition-opacity"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentForm;
