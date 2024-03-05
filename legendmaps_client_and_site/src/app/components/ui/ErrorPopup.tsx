import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { RootStoreContext } from "../../../stores/with-root-store";
import { css } from "@emotion/react";
export const ErrorPopup = observer(() => {
    const { errorStore } = useContext(RootStoreContext);

    return (
        <div>
            <AnimatePresence>
                {errorStore.popupMessage !== "" && (
                    <motion.div
                        css={css`
                            position: fixed;
                            top: 10px;
                            right: 10px;
                            padding: 10px;
                            z-index: 10000000;
                            background: #fff;
                            color: #000;
                            border-radius: 5px;
                            width: 300px;
                            min-height: 100px;
                            color: red;
                        `}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {errorStore.popupMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
