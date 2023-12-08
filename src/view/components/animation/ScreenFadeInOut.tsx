import React from "react";

import { motion } from "framer-motion";

export default function ScreenFadeInOut({
    children,
    className,
    duration = 0.3,
}: {
    children: React.ReactNode;
    className?: string;
    duration?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, easings: "linear" }}
            exit={{ opacity: 0 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
