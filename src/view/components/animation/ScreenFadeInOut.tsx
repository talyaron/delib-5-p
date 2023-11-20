import React from "react"

import { motion } from "framer-motion"

export default function ScreenFadeInOut({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            exit={{ opacity: 0 }}
            className="page__main"
        >
            {children}
        </motion.div>
    )
}
