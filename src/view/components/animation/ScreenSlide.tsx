import React, { ReactNode } from "react"

import { motion } from "framer-motion"

export default function ScreenSlide({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            exit={{ x: "-100%" }}
            className="page__main"
        >
            {children}
        </motion.div>
    )
}
