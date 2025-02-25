import {InputHTMLAttributes, forwardRef} from "react";
import clsx from "clsx";
import {RequiredFields} from "@/types";
import classes from "./AuthInput.module.scss";


interface AuthInputProps extends RequiredFields<InputHTMLAttributes<HTMLInputElement>, "name"> {
  title: string,
  error?: boolean,
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  function(
    {title, name, id, className, error, ...otherProps},
    ref
  ) {

    return (
      <div className={clsx(classes.root, error && classes.error, className)}>
        <input
          ref={ref}
          type="text"
          autoComplete="off"
          placeholder=""
          name={name}
          {...otherProps}
          className={classes.input}
          id={id || name}
        />
        <div className={classes.inputOutline}/>
        <label
          htmlFor={id || name}
          className={classes.name}
        >
          {title}
        </label>
      </div>
    );
  }
);

export default AuthInput;