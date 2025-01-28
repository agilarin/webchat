import React, {InputHTMLAttributes, useState} from "react";
import {RequiredFields} from "@/types";
import classes from "./AuthInput.module.scss";
import clsx from "clsx";


interface AuthInputProps extends RequiredFields<InputHTMLAttributes<HTMLInputElement>, "name"> {
  title: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
}

function AuthInput({title, name, setValue, id, ...otherProps}: AuthInputProps) {
  const [isFilled, setIsFilled] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsFilled(e.target.value !== "");
    setValue(e.target.value)
  }

  return (
    <div className={clsx(classes.root, isFilled && classes.filled)}>
      <input
        type="text"
        autoComplete="off"
        {...otherProps}
        className={classes.input}
        id={id || name}
        onChange={handleChange}
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

export default AuthInput;