import {ReactNode, FormEvent} from "react";
import {Modal, ModalHeader} from "@/components/UI/Modal";
import {Button} from "@/components/UI/Button";
import classes from "./EditForm.module.scss";


interface EditFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void,
  onClose: () => void,
  open: boolean,
  title: string,
  children?: ReactNode,
}

export function EditForm({open, onClose, onSubmit, title, children}: EditFormProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title={title} />

      <form className={classes.editFormRoot} onSubmit={onSubmit}>
        <div className={classes.inputs}>
          {children}
        </div>

        <div className={classes.buttons}>
          <Button
            type="button"
            className={classes.button}
            color="primary"
            onClick={onClose}
          >
            Отмена
          </Button>

          <Button
            type="submit"
            className={classes.button}
            color="primary"
          >
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  );
}