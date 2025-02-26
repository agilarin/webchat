import React, {ReactNode} from "react";
import {createPortal} from "react-dom";
import classes from "./Modal.module.scss";



interface ModalProps {
  open: boolean,
  onClose: () => void,
  children: ReactNode,
}

export function Modal({ open, onClose, children }: ModalProps) {


  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.currentTarget.isEqualNode(event.target as Element)) {
      onClose()
    }
  }


  if (!open) {
    return;
  }


  return (createPortal(
    <div className={classes.overlay} onClick={handleClick}>
      <div className={classes.modal}>
        {children}
      </div>
    </div>,
    document.body
  ));
}