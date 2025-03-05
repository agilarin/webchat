import {Button} from "@/components/UI/Button";
import {Checkbox, CheckboxProps} from "@/components/UI/Checkbox";
import classes from "./AuthCheckbox.module.scss";


interface AuthCheckboxProps extends CheckboxProps {
  text: string
}

export function AuthCheckbox({text, ...otherProps}: AuthCheckboxProps) {
  return (
    <Button
      as="label"
      className={classes.authCheckboxRoot}
    >
      <Checkbox {...otherProps} />
      <span className={classes.text}>
          {text}
        </span>
    </Button>
  );
}