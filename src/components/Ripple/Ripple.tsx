import React, {useRef, useState} from "react";
import {AnimatePresence} from "motion/react";
import {RippleItemProps, RippleItem} from "@/components/Ripple/components/RippleItem";
import classes from "./Ripple.module.scss";



const DURATION = 0.55;

type RippleItem = RippleItemProps & {
  id: number
}

export function Ripple() {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const rippleId = useRef(0);


  function removeRipple(id: number) {
    setTimeout(() => {
      setRipples((oldRipples) => {
        return oldRipples.filter((item) => item.id !== id);
      })
    }, DURATION * 1100);
  }

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const size = rect.width > rect.height ? rect.width / 2 : rect.height / 2;
    setRipples( [{
      id: rippleId.current,
      y: event.clientY - rect.top,
      x: event.clientX - rect.left,
      size: size,
      duration: DURATION
    }]);
    removeRipple(rippleId.current);
    rippleId.current += 1;
  }

  return (
    <div
      className={classes.root}
      onMouseDown={handleMouseDown}
    >
      <AnimatePresence>
        {ripples.map((item) => (
          <RippleItem key={item.id} {...item}/>
        ))}
      </AnimatePresence>
    </div>
  );
}