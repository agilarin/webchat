import {Button} from "@/components/UI/Button";
import CloseIcon from "@/assets/icons/close.svg?react";
import classes from "./ModalHeader.module.scss";

interface ModalHeaderProps {
  onClose?: () => void,
  title?: string,
}

export function ModalHeader({onClose, title}: ModalHeaderProps) {
  return (
    <div className={classes.header}>
      <h3 className={classes.title}>
        {title}
      </h3>

      {onClose && (
        <Button
          icon={true}
          shape="round"
          onClick={onClose}
        >
          <CloseIcon className={classes.closeIcon}/>
        </Button>
      )}
    </div>
  );
}