import {useForm} from "react-hook-form";
import authService from "@/services/authService.ts";
import {FORM_REGISTER_OPTIONS} from "@/constants";
import {AuthInput} from "@/pages/AuthPage/components/AuthInput";
import {EditForm} from "@/components/EditForm";


type FormValues = {
  oldPassword: string,
  password: string,
  confirmPassword: string
}

interface EditPasswordProps {
  open: boolean,
  onClose: () => void,
}

export function EditPassword({open, onClose}: EditPasswordProps) {
  const {register, handleSubmit, formState: { errors }} = useForm<FormValues>();


  async function onSubmit({oldPassword, password}: FormValues) {
    await authService.updatePassword(oldPassword, password)
    onClose()
  }


  return (
    <EditForm
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      open={open}
      title="Изменить пароль"
    >

      <AuthInput
        type="password"
        title="Старый пароль"
        {...register("oldPassword", FORM_REGISTER_OPTIONS.PASSWORD)}
        error={!!errors.oldPassword}
      />
      <AuthInput
        type="password"
        title="Новый пароль"
        {...register("password", FORM_REGISTER_OPTIONS.PASSWORD)}
        error={!!errors.password}
      />
      <AuthInput
        type="password"
        title="Подтвердите пароль"
        {...register("confirmPassword", FORM_REGISTER_OPTIONS.CONFIRM_PASSWORD)}
        error={!!errors.confirmPassword}
      />

    </EditForm>
  );
}