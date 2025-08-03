import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignUpSchema } from "@/schemas/auth";
import { ROUTES } from "@/constants";
import { signUp } from "@/services/authService.ts";
import { Button } from "@/components/UI/Button";
import { AuthCheckbox, AuthForm, AuthInput } from "@/components/Forms/AuthForm";
import classes from "./Signup.module.scss";

type SignUpFields = z.infer<typeof SignUpSchema>;

export function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<SignUpFields>({
    resolver: zodResolver(SignUpSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpFields) => {
    setIsLoading(true);
    try {
      await signUp({
        email: data.email,
        password: data.password,
        username: data.username,
        firstName: data.firstName,
      });
      navigate("/", { replace: true });
    } catch {
      setValue("password", "");
      setValue("confirmPassword", "");
      setError("email", {
        type: "manual",
        message: "Пользователь с таким email уже существует",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Зарегистрироваться в WebChat"
      description="Введите имя пользователя, имя, адрес электроной почты и пароль."
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthInput
        title="Ваш username"
        {...register("username")}
        error={!!errors.username}
      />
      <AuthInput
        title="Ваше имя"
        {...register("firstName", {
          required: true,
          minLength: 2,
        })}
        error={!!errors.firstName}
      />
      <AuthInput
        title="Адрес эл. почты"
        {...register("email")}
        error={!!errors.email}
      />
      <AuthInput
        type={isShowPassword ? "text" : "password"}
        title="Пароль"
        {...register("password")}
        error={!!errors.password}
      />
      <AuthInput
        type={isShowPassword ? "text" : "password"}
        title="Подтвердите пароль"
        {...register("confirmPassword")}
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
        {isLoading ? "Загрузка" : "Зарегистрироваться"}
      </Button>

      <Button
        color="primary"
        className={classes.link}
        onClick={() => navigate(ROUTES.SIGNIN)}
      >
        Уже есть аккаунт
      </Button>
    </AuthForm>
  );
}
