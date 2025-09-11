"use client";

import { Phone, Mail, CheckCircle, Mail as MailIcon, Clock } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { contactFormSchema, ContactFormValues } from "@/lib/validations/contact";
import { sendContactForm } from "./actions/send-contact-form";
import { sendContactFormEmails } from "@/utils/emails/actions/send-email";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await sendContactFormEmails(form.getValues())

      if (response instanceof Error) {
        // Reset form on successful submission
        setSubmitStatus('error');
        console.error('Failed to submit contact form', response.message);
      } 
      else {
        form.reset();
        setSubmitStatus('success');
        setShowSuccessDialog(true);
        console.log('Contact form submitted successfully');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* --- Section Header --- */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white ">
            Let's Start a Conversation
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Have a question, need support, or just want to learn more about our
            services? We're here to help. Fill out the form below and a member
            of our team will get back to you promptly.
          </p>
        </div>

        {/* --- Main Content Grid (Form and Info) --- */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Column 1: Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              Contact With Us
            </h2>
            <Form {...form}>
              <form className="mt-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@gmail.com"
                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="0123 456 789"
                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type here"
                          rows={5}
                          className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">
                      Sorry, there was an error sending your message. Please try again or contact us directly.
                    </p>
                  </div>
                )}

                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={onSubmit}
                    className="
                      inline-flex items-center justify-center 
                      px-10 py-3 rounded-full font-semibold text-white
                      bg-gradient-to-b from-[#662CB2] to-[#2C134C]
                      hover:opacity-90 transition-opacity duration-300 shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Column 2: Company Info */}
          <div className="mt-12 lg:mt-0 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Company Contact Info
            </h2>
            <ul className="mt-8 space-y-4 text-lg">
              <li className="flex items-center gap-3">
                <Phone className="h-6 w-6" />
                <span className="text-gray-700 dark:text-gray-300">
                  888-411-7583
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-6 w-6" />
                <a
                  href="mailto:support@mtechdistributor.com"
                  className="text-gray-700 dark:text-gray-300 hover:underline"
                >
                  support@mtechdistributor.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Confirmation Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 ">
              <CheckCircle className="h-8 w-8 text-green-600 animate-pulse" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
              Message Sent Successfully!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2 text-center">
              Thank you for contacting MTech Distributors. We've received your message and will get back to you within 24 hours.
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
                <p className="text-sm font-medium text-purple-900">Response Time</p>
                <p className="text-xs text-purple-700">We'll respond within 24 hours</p>
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
            {/* <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
                // Scroll to top of form
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full"
            >
              Send Another Message
            </Button> */}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Contact;
