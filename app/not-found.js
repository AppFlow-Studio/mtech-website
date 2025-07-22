'use client'
import { Button } from "@/components/ui/button";
import { Ghost, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 12 }}
                className="flex flex-col items-center gap-6"
            >
                <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                    className="bg-muted rounded-full p-6 shadow-lg"
                >
                    <Ghost className="h-16 w-16 text-blue-500 animate-pulse" />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold text-foreground text-center"
                >
                    404 - Page Not Found
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-muted-foreground text-center max-w-md"
                >
                    Oops! The page you are looking for does not exist or has been moved.<br />
                    Let&apos;s get you back to safety.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link href="/">
                        <Button size="lg" className="gap-2">
                            <ArrowLeft className="h-5 w-5" />
                            Go Home
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
} 