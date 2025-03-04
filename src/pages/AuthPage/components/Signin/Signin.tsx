import {useState} from "react";
import {useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import {AuthInput} from "@/pages/AuthPage/components/AuthInput";
import {Button} from "@/components/UI/Button";
import authService from "@/services/authService.ts";
import classes from "../../AuthPage.module.scss";


type FormValues = {
  email: string,
  password: string,
}

export function Signin() {
  const {register, handleSubmit} = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const onSubmit = (data: FormValues) => {
    if (!data.email || !data.password) {
      return;
    }
    setIsLoading(true);
    authService.signIn({
      email: data.email,
      password: data.password
    }).then(() => navigate("/"))
      .finally(() => setIsLoading(false));
  }

  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthInput
        title="Адрес эл. почты"
        {...register("email", { required: true })}
      />

      <AuthInput
        type="password"
        title="Пароль"
        {...register("password", { required: true })}
      />


      <Button
        color="primary"
        variant="solid"
        type="submit"
        className={classes.buttonSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Загрузка" :"Войти"}
      </Button>

      <Button
        color="primary"
        className={classes.link}
        onClick={() => navigate("/signup")}
      >
        Создать аккаунт
      </Button>
    </form>
  );
}