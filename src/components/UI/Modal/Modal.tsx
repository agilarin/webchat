import {ReactNode, MouseEvent} from "react";
import {createPortal} from "react-dom";
import classes from "./Modal.module.scss";
import clsx from "clsx";

interface ModalProps {
  open: boolean,
  onClose: () => void,
  children: ReactNode,
  mobileFull?: boolean,
}

export function Modal({ open, onClose, children, mobileFull = true }: ModalProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget.isEqualNode(event.target as Element)) {
      onClose()
    }
  }

  if (!open) {
    return;
  }

  return (createPortal(
    <div className={classes.overlay} onClick={handleClick}>
      <div className={clsx(classes.modal, mobileFull && classes.mobileFull)}>
        {children}
      </div>
    </div>,
    document.body
  ));
}