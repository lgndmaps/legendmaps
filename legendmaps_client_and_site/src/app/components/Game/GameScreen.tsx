import { AnimatePresence, motion } from "framer-motion";

export const GameScreen = ({ children, isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ ease: "easeInOut" }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
