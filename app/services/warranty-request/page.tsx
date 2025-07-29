"use client";

import Contact from "@/components/Contact";
import { UploadCloud } from "lucide-react";
import React from "react";

// --- Reusable Form Field Components ---

interface FormGroupProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FormGroup = ({
  label,
  htmlFor,
  required,
  className,
  children,
}: FormGroupProps) => (
  <div className={className}>
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-black dark:text-white mb-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

const InputField = ({ id, ...props }: InputFieldProps) => (
  <input
    id={id}
    className="block w-full px-3 py-2 border border-[#B9C1D9] rounded-md placeholder-[#475273] dark:placeholder-[#CBCCDB] focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
    {...props}
  />
);

const SelectField = ({
  id,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    id={id}
    className="block w-full px-3 py-2 border border-[#B9C1D9] rounded-md shadow-sm placeholder-[#475273] dark:placeholder-[#CBCCDB] focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
    {...props}
  >
    {children}
  </select>
);

const TextareaField = ({
  id,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    id={id}
    rows={4}
    className="block w-full px-3 py-2 border border-[#B9C1D9] rounded-md shadow-sm placeholder-[#475273] dark:placeholder-[#CBCCDB] focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
    {...props}
  ></textarea>
);

// --- Main Warranty Form Component ---
const WarrantyForm = () => {
  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
              Warranty Request Form
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              The Warranty Request Form allows customers to submit claims for
              products covered under manufacturer or store warranty. This form
              is used to report issues, request repairs, or replacements for
              defective or malfunctioning equipment purchased through our store.
            </p>
          </div>

          {/* Form Container */}
          <div className="mt-12 max-w-4xl mx-auto p-6 sm:p-8 bg-[#FAFAFA] dark:bg-[#3C3447] rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Warranty Request Form
            </h3>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <FormGroup label="First Name" htmlFor="first-name" required>
                <InputField
                  id="first-name"
                  type="text"
                  placeholder="Enter first name"
                />
              </FormGroup>
              <FormGroup label="Last Name" htmlFor="last-name" required>
                <InputField
                  id="last-name"
                  type="text"
                  placeholder="Enter last name"
                />
              </FormGroup>
              <FormGroup label="Email" htmlFor="email" required>
                <InputField
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                />
              </FormGroup>
              <FormGroup label="Business Name" htmlFor="business-name" required>
                <InputField
                  id="business-name"
                  type="text"
                  placeholder="Enter company name"
                />
              </FormGroup>
              <FormGroup label="Customer PO" htmlFor="customer-po" required>
                <InputField
                  id="customer-po"
                  type="text"
                  placeholder="Enter your PO"
                />
              </FormGroup>
              <FormGroup label="Phone Number" htmlFor="phone-number" required>
                <div className="flex gap-4">
                  <div>
                    <SelectField id="phone-code" defaultValue="+880">
                      <option>+880</option>
                      <option>+1</option>
                    </SelectField>
                  </div>
                  <div className="flex-1">
                    <InputField
                      id="phone-number"
                      type="tel"
                      placeholder="12345678"
                    />
                  </div>
                </div>
              </FormGroup>
              <FormGroup label="Warranty" htmlFor="warranty-yes" required>
                <div className="flex items-center gap-6 p-2 border border-[#B9C1D9] rounded-md">
                  <div className="flex items-center">
                    <input
                      id="warranty-yes"
                      name="warranty"
                      type="radio"
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 dark:border-gray-600"
                    />
                    <label
                      htmlFor="warranty-yes"
                      className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="warranty-no"
                      name="warranty"
                      type="radio"
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 dark:border-gray-600"
                    />
                    <label
                      htmlFor="warranty-no"
                      className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      No
                    </label>
                  </div>
                </div>
              </FormGroup>
              <FormGroup label="Manufacturer" htmlFor="manufacturer" required>
                <SelectField id="manufacturer" defaultValue="">
                  <option disabled value="">
                    Select Manufacturer
                  </option>
                  <option>Manufacturer A</option>
                  <option>Manufacturer B</option>
                  <option>Manufacturer C</option>
                </SelectField>
              </FormGroup>
              <FormGroup label="Repair Type" htmlFor="repair-type" required>
                <div className="grid grid-cols-2 gap-4 p-4 border border-[#B9C1D9] rounded-md">
                  <div className="flex items-center">
                    <input
                      id="cassette1"
                      type="checkbox"
                      className="h-4 w-4 rounded"
                    />
                    <label htmlFor="cassette1" className="ml-2 text-sm">
                      Cassette
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="cassette2"
                      type="checkbox"
                      className="h-4 w-4 rounded"
                    />
                    <label htmlFor="cassette2" className="ml-2 text-sm">
                      Cassette
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="cassette3"
                      type="checkbox"
                      className="h-4 w-4 rounded"
                    />
                    <label htmlFor="cassette3" className="ml-2 text-sm">
                      Cassette
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="cassette4"
                      type="checkbox"
                      className="h-4 w-4 rounded"
                    />
                    <label htmlFor="cassette4" className="ml-2 text-sm">
                      Cassette
                    </label>
                  </div>
                </div>
              </FormGroup>
              <FormGroup
                label="File Upload"
                htmlFor="file-upload"
                className="flex flex-col"
              >
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-purple-600 dark:text-purple-300 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 flex-1"
                >
                  <div className="flex justify-between items-center border border-dotted border-[#B9C1D9] rounded-md px-3 py-2 h-full">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Chose file
                    </span>
                    <UploadCloud className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
              </FormGroup>
              <FormGroup
                label="Parts Serial Number"
                htmlFor="parts-serial"
                required
              >
                <InputField
                  id="parts-serial"
                  type="text"
                  placeholder="Enter Parts Serial Number"
                />
              </FormGroup>
              <FormGroup
                label="ATM Serial Number"
                htmlFor="atm-serial"
                required
              >
                <InputField
                  id="atm-serial"
                  type="text"
                  placeholder="Enter ATM number"
                />
              </FormGroup>
              <FormGroup label="Message" htmlFor="message" required>
                <TextareaField id="message" placeholder="Type here" />
              </FormGroup>
              <FormGroup
                label="Describe the issue"
                htmlFor="describe-issue"
                required
              >
                <TextareaField
                  id="describe-issue"
                  placeholder="Please be sure to include the error code present on the atm and the representative contact name who you spoke to resolve the issue."
                />
              </FormGroup>
              <div className="md:col-span-2 p-4 rounded-md text-xs">
                <h4 className="font-bold mb-1">File Upload</h4>
                <p>
                  Warranties are subject to manufacturer warranty policies.
                  Defective part has to be shipped back to manufacturer in same
                  safe manner as you received the replacement part within 20
                  days of receiving replacement. If warranty claim is not
                  accepted by manufacturer RMA department, MTech Distributors
                  shall charge the amount billed by manufacturer plus $50
                  processing fee to the account described below. A credit hold
                  is authorized hereby statement.
                </p>
              </div>
              <div className="md:col-span-2 flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
                >
                  I accept the Terms and Conditions.
                </label>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
};

export default WarrantyForm;
