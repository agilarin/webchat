import authService from "@/services/authService.ts";
import {useForm} from "react-hook-form";
import {FORM_REGISTER_OPTIONS} from "@/constants";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {EditForm} from "@/components/EditForm";
import {AuthInput} from "@/components/AuthForm";


type FormValues = {
  email: string,
  password: string,
}

interface EditEmailProps {
  open: boolean,
  onClose: () => void,
}

export function EditEmail({ open, onClose }: EditEmailProps) {
  const {currentUser} = useAuthContext();
  const {register, handleSubmit, formState: { errors }} = useForm<FormValues>({
    defaultValues: {
      email: currentUser?.email || "",
    }
  });


  async function onSubmit({email, password}: FormValues) {
    await authService.updateEmail(email, password)
    onClose()
  }

  return (
    <EditForm
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      open={open}
      title="Изменить имя"
    >

      <AuthInput
        type="text"
        title="Эл. почта"
        {...register("email", FORM_REGISTER_OPTIONS.EMAIL)}
        error={!!errors.email}
      />
      <AuthInput
        type="password"
        title="Пароль"
        {...register("password", FORM_REGISTER_OPTIONS.PASSWORD)}
        error={!!errors.password}
      />

    </EditForm>
  );
}