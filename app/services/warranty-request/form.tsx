'use client'
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { warrantyRequestSchema, WarrantyRequestValues } from "@/lib/validations/warranty";
import { sendWarrantyRequestEmails } from "@/utils/emails/actions/send-email";

const WarrantyForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const form = useForm<WarrantyRequestValues>({
        resolver: zodResolver(warrantyRequestSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            businessName: "",
            customerPO: "",
            phoneCode: "+1",
            phoneNumber: "",
            hasWarranty: undefined,
            manufacturer: "",
            repairTypes: [],
            partsSerialNumber: "",
            atmSerialNumber: "",
            message: "",
            issueDescription: "",
            files: [],
            acceptTerms: false,
        },
    });

    const onSubmit = async (data: WarrantyRequestValues) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Create FormData for file uploads
            const formData = new FormData();

            // Add all form fields
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            formData.append('businessName', data.businessName);
            formData.append('customerPO', data.customerPO);
            formData.append('phoneCode', data.phoneCode);
            formData.append('phoneNumber', data.phoneNumber);
            formData.append('hasWarranty', data.hasWarranty);
            formData.append('manufacturer', data.manufacturer);
            formData.append('repairTypes', JSON.stringify(data.repairTypes));
            formData.append('partsSerialNumber', data.partsSerialNumber);
            formData.append('atmSerialNumber', data.atmSerialNumber);
            formData.append('message', data.message);
            formData.append('issueDescription', data.issueDescription);
            formData.append('acceptTerms', data.acceptTerms.toString());

            // Add files if any
            if (data.files && data.files.length > 0) {
                data.files.forEach((file) => {
                    formData.append('files', file);
                });
            }

            const response = await fetch('/api/warranty-request', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                form.reset();
                setSubmitStatus('success');
                setShowSuccessDialog(true);
                console.log('Warranty request submitted successfully');
            } else {
                setSubmitStatus('error');
                console.error('Failed to submit warranty request');
            }
        } catch (error) {
            setSubmitStatus('error');
            console.error('Error submitting warranty request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const repairTypeOptions = [
        { id: 'cassette', label: 'Cassette' },
        { id: 'dispenser', label: 'Dispenser' },
        { id: 'keypad', label: 'Keypad' },
        { id: 'power-supply', label: 'Power Supply' },
    ];

    return (
        <>
            <div className="mt-12 max-w-4xl mx-auto p-6 sm:p-8 bg-[#FAFAFA] dark:bg-[#3C3447] rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Warranty Request Form
                </h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
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
                                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Last Name */}
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
                                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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
                                            placeholder="Enter your email"
                                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Business Name */}
                        <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        Business Name *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter company name"
                                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Customer PO */}
                        <FormField
                            control={form.control}
                            name="customerPO"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        Customer PO *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your PO"
                                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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
                                    <div className="flex gap-4">
                                        <FormField
                                            control={form.control}
                                            name="phoneCode"
                                            render={({ field: phoneCodeField }) => (
                                                <FormItem className="w-24">
                                                    <FormControl>
                                                        <Select value={phoneCodeField.value} onValueChange={phoneCodeField.onChange}>
                                                            <SelectTrigger className="px-3 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
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
                                                    className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Warranty Status */}
                        <FormField
                            control={form.control}
                            name="hasWarranty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        Warranty *
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex items-center gap-6 p-2 border border-[#B9C1D9] rounded-md"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="yes" id="warranty-yes" />
                                                <label htmlFor="warranty-yes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="no" id="warranty-no" />
                                                <label htmlFor="warranty-no" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    No
                                                </label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Manufacturer */}
                        <FormField
                            control={form.control}
                            name="manufacturer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        Manufacturer *
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                                                <SelectValue placeholder="Select Manufacturer" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Hyosung">Hyosung</SelectItem>
                                            <SelectItem value="Genmega">Genmega</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Repair Types */}
                        <FormField
                            control={form.control}
                            name="repairTypes"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        Repair Type *
                                    </FormLabel>
                                    <div className="grid grid-cols-2 gap-4 p-4 border border-[#B9C1D9] rounded-md">
                                        {repairTypeOptions.map((option) => (
                                            <FormField
                                                key={option.id}
                                                control={form.control}
                                                name="repairTypes"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={option.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(option.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, option.id])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== option.id
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-sm font-normal">
                                                                {option.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* File Upload */}
                        <FormField
                            control={form.control}
                            name="files"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        File Upload (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files || []);
                                                    field.onChange(files);
                                                }}
                                            />
                                            <div className="flex justify-between items-center w-full px-3 py-2 rounded-lg border border-[#B9C1D9] text-gray-400 bg-white dark:bg-[#FAFAFA1A]">
                                                <span>
                                                    {field.value?.length
                                                        ? `${field.value.length} file(s) selected`
                                                        : 'Choose files (PDF, JPG, PNG, DOC)'
                                                    }
                                                </span>
                                                <UploadCloud className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Parts Serial Number */}
                        <FormField
                            control={form.control}
                            name="partsSerialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        Parts Serial Number *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Parts Serial Number"
                                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ATM Serial Number */}
                        <FormField
                            control={form.control}
                            name="atmSerialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        ATM Serial Number *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter ATM number"
                                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Message */}
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        Message *
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type here"
                                            rows={4}
                                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Issue Description */}
                        <FormField
                            control={form.control}
                            name="issueDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300">
                                        Describe the issue *
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Please be sure to include the error code present on the atm and the representative contact name who you spoke to resolve the issue."
                                            rows={4}
                                            className="px-4 py-3 rounded-lg border border-[#475273] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                            {...field}
                                        />
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
                                <FormItem className="md:col-span-2 flex flex-row items-start space-x-3 space-y-0">
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

                        {/* Warranty Information */}
                        <div className="md:col-span-2 p-4 rounded-md text-xs bg-gray-50 dark:bg-gray-800">
                            <h4 className="font-bold mb-1">Warranty Information</h4>
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

                        {/* Error Message */}
                        {submitStatus === 'error' && (
                            <div className="md:col-span-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 font-medium">
                                    Sorry, there was an error submitting your warranty request. Please try again or contact us directly.
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[#662CB2] to-[#2C134C] hover:opacity-90 transition-opacity duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                            Warranty Request Submitted!
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2 text-center">
                            Thank you for submitting your warranty request. We've received your information and will process it within 24 hours.
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
                                <p className="text-sm font-medium text-purple-900">Processing Time</p>
                                <p className="text-xs text-purple-700">We'll process your request within 24 hours</p>
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
    )
}

export default WarrantyForm;