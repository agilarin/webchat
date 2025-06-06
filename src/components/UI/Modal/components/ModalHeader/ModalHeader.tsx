import {Button} from "@/components/UI/Button";
import { X as XIcon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import classes from "./ModalHeader.module.scss";

interface ModalHeaderProps {
  onClose?: () => void,
  title?: string,
}

export function ModalHeader({onClose, title}: ModalHeaderProps) {
  return (
    <div className={classes.header}>
      <div className={classes.left}>
        {onClose && (
          <Button
            icon={true}
            shape="round"
            onClick={onClose}
            className={classes.buttonBack}
          >
            <ArrowLeft/>
          </Button>
        )}

        <h3 className={classes.title}>
          {title}
        </h3>
      </div>

      {onClose && (
        <Button
          icon={true}
          shape="round"
          onClick={onClose}
          className={classes.buttonClose}
        >
          <XIcon/>
        </Button>
      )}
    </div>
  );
}