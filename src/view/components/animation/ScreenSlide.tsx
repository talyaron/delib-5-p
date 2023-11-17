import React from "react"

import { motion } from "framer-motion"

export default function ScreenSlide({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            exit={{ x: "-100%", opacity: 0 }}
            className="page__main"
        >
            {children}
        </motion.div>
    )
}
