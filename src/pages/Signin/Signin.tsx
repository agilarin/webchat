import {useForm} from "react-hook-form";
import {useState} from "react";
import {useNavigate} from "react-router";
import authService from "@/services/authService.ts";
import {AuthForm, AuthInput} from "@/components/AuthForm";
import {Button} from "@/components/UI/Button";
import classes from "./Signin.module.scss";

type FormValues = {
  email: string,
  password: string,
}

export function Signin() {
  const {register, handleSubmit, formState: { errors }, setValue, setError} = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  async function onSubmit(data: FormValues) {
    if (!data.email || !data.password) {
      return;
    }
    setIsLoading(true);
    try {
      await authService.signIn({
        email: data.email,
        password: data.password
      })
      navigate("/")
    } catch (error) {
      setValue("password", "")
      setError("email", {
        type: "error",
        message: "Invalid email address"
      })
      setError("password", {
        type: "error",
        message: "Invalid password"
      })
    }
    setIsLoading(false)
  }

  return (
    <AuthForm
      title="Войти в WebChat"
      description="Введите адрес электроной почты и пароль."
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthInput
        title="Адрес эл. почты"
        {...register("email", { required: true })}
        error={!!errors.email}
      />

      <AuthInput
        type="password"
        title="Пароль"
        {...register("password", { required: true })}
        error={!!errors.password}
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
    </AuthForm>
  );
}