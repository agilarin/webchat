import {ComponentPropsWithoutRef} from "react";
import { Check } from 'lucide-react';
import classes from "./Checkbox.module.scss";


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
        <Check
          size={15}
          strokeWidth={3}
          className={classes.boxIcon}
        />
      </div>
    </div>
  );
}