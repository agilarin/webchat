import {FormEvent, ReactNode} from "react";
import classes from "./AuthForm.module.scss";
import LogoIcon from "@/assets/icons/logo.svg?react";


interface AuthFormProps {
  title?: string,
  description?: string,
  children?: ReactNode,
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void,
}

export function AuthForm({ title, description, children, onSubmit }: AuthFormProps) {
  return (
    <div className={classes.authFormRoot}>
      <div className={classes.logoContainer}>
        <LogoIcon className={classes.logo}/>
      </div>
      <h1 className={classes.title}>
        {title}
      </h1>
      <p className={classes.description}>
        {description}
      </p>

      <form className={classes.form} onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
}