import React, {useState} from "react";
import {AuthInput} from "@/pages/AuthPage/components/AuthInput";
import {Button} from "@/components/UI/Button";
import {useNavigate} from "react-router";
import authService from "@/services/authService.ts";
import classes from "../../AuthPage.module.scss";


function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    authService.signIn({email, password})
      .then(() => navigate("/"))
      .finally(() => setIsLoading(false));
  }

  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit}
    >
      <AuthInput
        title="Адрес эл. почты"
        name="emailInput"
        value={email}
        setValue={setEmail}
      />

      <AuthInput
        type="password"
        title="Пароль"
        name="password"
        value={password}
        setValue={setPassword}
      />


      <Button
        variant="solid"
        type="submit"
        className={classes.buttonSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Загрузка" :"Войти"}
      </Button>

      <Button
        className={classes.link}
        as="RouterLink"
        to={"/signup"}
      >
        Создать аккаунт
      </Button>
    </form>
  );
}

export default Signin;