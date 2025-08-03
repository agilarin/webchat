import { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignInSchema } from "@/schemas/auth";
import { ROUTES } from "@/constants";
import { signIn } from "@/services/authService.ts";
import { AuthForm, AuthInput } from "@/components/Forms/AuthForm";
import { Button } from "@/components/UI/Button";
import classes from "./Signin.module.scss";

type SignInFields = z.infer<typeof SignInSchema>;

export function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm<SignInFields>({
    resolver: zodResolver(SignInSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: SignInFields) => {
    setIsLoading(true);
    try {
      await signIn({
        email: data.email,
        password: data.password,
      });
      navigate("/", { replace: true });
    } catch (error) {
      setValue("password", "");
      setError("email", {
        type: "manual",
        message: "Неверный адрес эл. почты или пароль",
      });
      setError("password", {
        type: "manual",
        message: "Неверный адрес эл. почты или пароль",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Войти в WebChat"
      description="Введите адрес электроной почты и пароль."
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthInput
        title="Адрес эл. почты"
        {...register("email")}
        error={!!errors.email}
      />

      <AuthInput
        type="password"
        title="Пароль"
        {...register("password")}
        error={!!errors.password}
      />

      <Button
        color="primary"
        variant="solid"
        type="submit"
        className={classes.buttonSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Загрузка" : "Войти"}
      </Button>

      <Button
        color="primary"
        className={classes.link}
        onClick={() => navigate(ROUTES.SIGNUP)}
      >
        Создать аккаунт
      </Button>
    </AuthForm>
  );
}
