import { motion } from "framer-motion";

/**
 * @namespace Layout
 */
/**
 * @typedef {Object} Layout.Page
 * @property {boolean} animate
 */
/**
 * @param {React.PropsWithChildren & Layout.Page} props
 * @returns
 */
export default function Page(props) {
  if (props.animate) {
    const variants = {
      hidden: { opacity: 0, /* display: "none" */ },
      visible: { opacity: 1, /* display: "block" */ },
    };

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.65 }}
      >
        {props.children}
      </motion.div>
    );
  } else {
    return <>{props.children}</>;
  }
}
