import React, {CSSProperties, ReactNode, useLayoutEffect, useState} from "react";
import {createPortal} from "react-dom";
import clsx from "clsx";
import classes from "./Menu.module.scss";
import useWindowSize from "@/components/UI/Menu/useWindowSize.ts";


interface MenuProps {
  open: boolean,
  onClose: () => void,
  children?: ReactNode,
  className?: string,
  toggleEl?: HTMLElement | null,
}

function Menu({ open, onClose, className, children, toggleEl }: MenuProps) {
  const [styles, setStyles] = useState<CSSProperties>({});
  const size = useWindowSize();


  useLayoutEffect(() => {
    if (!open || !toggleEl) {
      return
    }
    const toggleRect = toggleEl.getBoundingClientRect();
    const newStyles: CSSProperties = {}

    if (toggleRect.left + toggleRect.width / 2 < window.innerWidth / 2) {
      newStyles.left = toggleRect.left;
    } else {
      newStyles.right = window.innerWidth - toggleRect.right;
    }

    if (toggleRect.top + toggleRect.height / 2 < window.innerHeight / 2) {
      newStyles.top = toggleRect.bottom;
    } else {
      newStyles.bottom = window.innerHeight - toggleRect.top;
    }

    setStyles(newStyles);
  }, [toggleEl, open, size])


  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.currentTarget.isEqualNode(event.target as Element)) {
      onClose()
    }
  }


  if (!open) {
    return null;
  }


  return (
    createPortal((
        <div className={classes.overlay} onClick={handleClick}>
          <ul className={clsx(classes.menu, className)} style={styles}>
            {children}
          </ul>
        </div>
      ),
      document.body
    )
  );
}

export default Menu;