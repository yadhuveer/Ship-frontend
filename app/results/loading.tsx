
"use client";

import { Loader2 } from "lucide-react"; // optional icon
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-700 text-lg sm:text-xl font-medium">
          Loading results, please wait...
        </p>
      </motion.div>
    </div>
  );
}
