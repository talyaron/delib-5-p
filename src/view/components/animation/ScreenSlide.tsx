import React from "react"

import { motion } from "framer-motion"

export default function ScreenSlide({
    children,
    toSubStatement,
}: {
    children: React.ReactNode
    toSubStatement: boolean
}) {
    return (
        <motion.div
            initial={{ x: toSubStatement ? 1000 : -1000 }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            exit={{ opacity: 0 }}
            className="page__main"
        >
            {children}
        </motion.div>
    )
}
