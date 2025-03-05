import {ComponentPropsWithoutRef} from "react";
import classes from "./Checkbox.module.scss";
import CheckmarkIcon from "@/assets/icons/checkmark.svg?react";


type InputComponentProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "children">

export interface CheckboxProps extends InputComponentProps {}

export function Checkbox(props: CheckboxProps) {

  return (
    <div className={classes.CheckboxRoot}>
      <input
        className={classes.input}
        type="checkbox"
        {...props}
      />
      <div className={classes.box}>
        <div className={classes.boxBorder}/>
        <div className={classes.boxBackground}/>
        <CheckmarkIcon className={classes.boxIcon}/>
      </div>
    </div>
  );
}