import classes from "../../Ripple.module.scss";
import {motion} from "motion/react";


const rippleVariants = (duration: number) => ({
  initial: {
    scale: 0,
    opacity: 0.1,
  },
  animate: {
    top: "50%",
    left: "50%",
    translateX: "-50%",
    translateY: "-50%",
    scale: 2,
    opacity: 0.3,
    transition: {
      default: { duration: duration * 2 },
      scale: { duration:  duration },
      opacity: { duration: duration },
    }
  }
})

const rippleChildVariants = (duration: number) => ({
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 0,
    transition: { duration: duration }
  }
})


export interface RippleItemProps {
  duration: number,
  y: number,
  x: number,
  size: number,
}

function RippleItem({duration, size, y, x}: RippleItemProps) {
  const rippleStyle = {
    width: size,
    height: size,
    top: y - (size / 2),
    left: x - (size / 2),
  }

  return (
    <motion.div
      className={classes.ripple}
      initial="initial"
      animate="animate"
      variants={rippleVariants(duration)}
      style={rippleStyle}
    >
      <motion.div
        className={classes.rippleChild}
        initial="initial"
        animate="animate"
        variants={rippleChildVariants(duration)}
      />
    </motion.div>
  );
}

export default RippleItem;