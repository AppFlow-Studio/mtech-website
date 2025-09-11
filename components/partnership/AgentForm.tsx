"use client";

import { UploadCloud, CheckCircle, Mail as MailIcon, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { agentApplicationSchema, AgentApplicationValues } from "@/lib/validations/agent";
import { sendAgentApplicationEmails } from "@/utils/emails/actions/send-email";

const AgentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<AgentApplicationValues>({
    resolver: zodResolver(agentApplicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      phoneCode: "+1",
      phoneNumber: "",
      voidCheck: [],
      photoId: [],
      ein: [],
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: AgentApplicationValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add all form fields
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('companyName', data.companyName);
      formData.append('email', data.email);
      formData.append('phoneCode', data.phoneCode);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('acceptTerms', data.acceptTerms.toString());

      // Add files if any
      if (data.voidCheck && data.voidCheck.length > 0) {
        data.voidCheck.forEach((file) => {
          formData.append('voidCheck', file);
        });
      }

      if (data.photoId && data.photoId.length > 0) {
        data.photoId.forEach((file) => {
          formData.append('photoId', file);
        });
      }

      if (data.ein && data.ein.length > 0) {
        data.ein.forEach((file) => {
          formData.append('ein', file);
        });
      }

      const response = await sendAgentApplicationEmails(form.getValues())

      if (response.success) {
        form.reset();
        setSubmitStatus('success');
        setShowSuccessDialog(true);
        console.log('Agent application submitted successfully');
      } else {
        setSubmitStatus('error');
        console.error('Failed to submit agent application');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting agent application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#ECEBED] dark:bg-[#3C3447] p-8 rounded-2xl">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Become an Agent
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6 dark:text-gray-300">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      First Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        className="w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Last Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        className="w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Company Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your company name"
                      className="w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="demo@gmail.com"
                      className="w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Phone Number *
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="phoneCode"
                      render={({ field: phoneCodeField }) => (
                        <FormItem className="w-24">
                          <FormControl>
                            <Select value={phoneCodeField.value} onValueChange={phoneCodeField.onChange}>
                              <SelectTrigger className="px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] focus:ring-2 focus:ring-purple-500 outline-none">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+1">+1</SelectItem>
                                <SelectItem value="+880">+880</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="12345678"
                          className="w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 outline-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </FormItem>
              )}
            />

            {/* File Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="voidCheck"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Void Check
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            field.onChange(files);
                          }}
                        />
                        <div className="flex justify-between items-center w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] text-gray-400">
                          <span>{field.value?.length ? `${field.value.length} file(s) selected` : 'Choose File'}</span>
                          <UploadCloud className="h-5 w-5" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Photo ID
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            field.onChange(files);
                          }}
                        />
                        <div className="flex justify-between items-center w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] text-gray-400">
                          <span>{field.value?.length ? `${field.value.length} file(s) selected` : 'Choose File'}</span>
                          <UploadCloud className="h-5 w-5" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ein"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    EIN (Tax ID)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          field.onChange(files);
                        }}
                      />
                      <div className="flex justify-between items-center w-full px-3 py-2 rounded-lg border dark:bg-[#FAFAFA1A] border-[#B9C1D9] text-gray-400">
                        <span>{field.value?.length ? `${field.value.length} file(s) selected` : 'Choose File'}</span>
                        <UploadCloud className="h-5 w-5" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms and Conditions */}
            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-900 dark:text-gray-200">
                      I accept the Terms and Conditions. *
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  Sorry, there was an error submitting your agent application. Please try again or contact us directly.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-purple-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Success Confirmation Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600 animate-pulse" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
              Application Submitted!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2 text-center">
              Thank you for your interest in becoming an MTech Distributors agent. We've received your application and will review it within 2-3 business days.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg transition-all duration-300 hover:bg-blue-100">
              <MailIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Check Your Email</p>
                <p className="text-xs text-blue-700">We've sent you a confirmation email</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg transition-all duration-300 hover:bg-purple-100">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">Review Process</p>
                <p className="text-xs text-purple-700">We'll review your application within 2-3 business days</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-gradient-to-b from-[#662CB2] to-[#2C134C] hover:opacity-90"
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentForm;
