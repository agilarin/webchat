import React, {ComponentPropsWithoutRef} from "react";
import classes from "./Checkbox.module.scss";
import CheckmarkIcon from "@/assets/icons/checkmark.svg?react";




interface CheckboxProps extends ComponentPropsWithoutRef<"input"> {
  children?: React.ReactNode;
}

function Checkbox({children, ...otherProps}: CheckboxProps) {

  return (
    <div className={classes.root}>
      <input
        className={classes.input}
        type="checkbox"
        {...otherProps}
      />
      <div className={classes.box}>
        <div className={classes.boxBorder}/>
        <div className={classes.boxBackground}/>
        <CheckmarkIcon className={classes.boxIcon}/>
      </div>

    </div>
  );
}

export default Checkbox;