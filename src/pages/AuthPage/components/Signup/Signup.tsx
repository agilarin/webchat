import {useState} from "react";
import {useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import authService from "@/services/authService.ts";
import {FORM_REGISTER_OPTIONS} from "@/constants";
import {Button} from "@/components/UI/Button";
import {AuthInput} from "@/pages/AuthPage/components/AuthInput";
import {Checkbox} from "@/pages/AuthPage/components/Checkbox";
import classes from "../../AuthPage.module.scss";



type FormValues = {
  email: string,
  username: string,
  firstName: string,
  password: string,
  confirmPassword: string,
}


export function Signup() {
  const {register, handleSubmit} = useForm<FormValues>();
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
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthInput
        title="Ваш username"
        {...register("username", FORM_REGISTER_OPTIONS.USERNAME)}
      />
      <AuthInput
        title="Ваше имя"
        {...register("firstName", {
          required: true,
          minLength: 2
        })}
      />
      <AuthInput
        title="Адрес эл. почты"
        {...register("email", FORM_REGISTER_OPTIONS.EMAIL)}
      />
      <AuthInput
        type={isShowPassword ? "text" : "password"}
        title="Пароль"
        {...register("password", FORM_REGISTER_OPTIONS.PASSWORD)}
      />
      <AuthInput
        type={isShowPassword ? "text" : "password"}
        title="Подтвердите пароль"
        {...register("confirmPassword", FORM_REGISTER_OPTIONS.CONFIRM_PASSWORD)}
      />

      <Button
        as="label"
        className={classes.checkbox}
      >
        <Checkbox
          onChange={(e) => setIsShowPassword(e.target.checked)}
          checked={isShowPassword}
        />
        <span className={classes.checkboxText}>
          Показать пароль
        </span>
      </Button>

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

    </form>
  );
}