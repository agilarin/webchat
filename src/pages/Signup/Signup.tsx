import {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router";
import authService from "@/services/authService.ts";
import {FORM_REGISTER_OPTIONS} from "@/constants";
import {Button} from "@/components/UI/Button";
import {AuthCheckbox, AuthForm, AuthInput} from "@/components/AuthForm";
import classes from "./Signup.module.scss";

type FormValues = {
  email: string,
  username: string,
  firstName: string,
  password: string,
  confirmPassword: string,
}

export function Signup() {
  const {register, handleSubmit, formState: { errors }, setValue, setError} = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      await authService.createUser({
        email: data.email,
        password: data.password,
        username: data.username,
        firstName: data.firstName,
      });
      navigate("/")
    } catch (error) {
      setValue("password", "")
      setValue("confirmPassword", "")
      setError("email", {
        type: "error",
        message: "Invalid email address"
      })
    }
    setIsLoading(false);
  }

  return (
    <AuthForm
      title="Зарегистрироваться в WebChat"
      description="Введите имя пользователя, имя, адрес электроной почты и пароль."
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthInput
        title="Ваш username"
        {...register("username", FORM_REGISTER_OPTIONS.USERNAME)}
        error={!!errors.username}
      />
      <AuthInput
        title="Ваше имя"
        {...register("firstName", {
          required: true,
          minLength: 2
        })}
        error={!!errors.firstName}
      />
      <AuthInput
        title="Адрес эл. почты"
        {...register("email", FORM_REGISTER_OPTIONS.EMAIL)}
        error={!!errors.email}
      />
      <AuthInput
        type={isShowPassword ? "text" : "password"}
        title="Пароль"
        {...register("password", FORM_REGISTER_OPTIONS.PASSWORD)}
        error={!!errors.password}
      />
      <AuthInput
        type={isShowPassword ? "text" : "password"}
        title="Подтвердите пароль"
        {...register("confirmPassword", FORM_REGISTER_OPTIONS.CONFIRM_PASSWORD)}
        error={!!errors.confirmPassword}
      />

      <AuthCheckbox
        text="Показать пароль"
        onChange={(e) => setIsShowPassword(e.target.checked)}
        checked={isShowPassword}
      />

      <Button
        color="primary"
        variant="solid"
        type="submit"
        className={classes.buttonSubmit}
        disabled={isLoading}
      >
        {isLoading? "Загрузка" : "Зарегистрироваться"}
      </Button>

      <Button
        color="primary"
        className={classes.link}
        onClick={() => navigate("/signin")}
      >
        Уже есть аккаунт
      </Button>
    </AuthForm>
  );
}