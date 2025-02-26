import {Navigate} from "react-router";
import {Signin} from "@/pages/AuthPage/components/Signin";
import {Signup} from "@/pages/AuthPage/components/Signup";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import LogoIcon from "@/assets/icons/logo.svg?react";
import classes from "./AuthPage.module.scss";

type AuthType = "signin" | "signup";

const forms = {
  signin: {
    title: "Войти в Chatapp",
    render: () => <Signin/>
  },
  signup: {
    title: "Зарегистрироваться в Chatapp",
    render: () => <Signup/>
  },
}

interface AuthProps {
  type: AuthType
}

export function AuthPage({type}: AuthProps) {
  const formElement = forms[type];
  const {currentUser} = useAuthContext();

  if (currentUser) {
    return (
      <Navigate to="/"/>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.logoContainer}>
          <LogoIcon className={classes.logo}/>
        </div>

        <h1 className={classes.title}>
          Chatapp
        </h1>

        <p className={classes.description}>
          Введите адрес электроной почты и пароль.
        </p>

        {formElement.render()}
      </div>
    </div>
  );
}