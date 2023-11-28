import React from "react";

import { motion } from "framer-motion";

export default function ScreenSlide({
    children,
    toSubStatement,
    className = "page__main",
}: {
    children: React.ReactNode;
    toSubStatement: boolean;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ x: toSubStatement ? 1000 : -1000 }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            exit={{ opacity: 0 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
