import {useForm} from "react-hook-form";
import userService from "@/services/userService.ts";
import {FORM_REGISTER_OPTIONS} from "@/constants";
import {EditForm} from "@/components/EditForm";
import {AuthInput} from "@/pages/AuthPage/components/AuthInput";
import {useAuthContext} from "@/hooks/useAuthContext.ts";


type FormValues = {
  username: string,
}

interface EditUsernameProps {
  open: boolean,
  onClose: () => void,
}

export function EditUsername({ open, onClose }: EditUsernameProps) {
  const {currentUser, userInfo} = useAuthContext();
  const {register, handleSubmit, formState: { errors }} = useForm<FormValues>({
    defaultValues: {
      username: userInfo?.username || "",
    }
  });

  async function onSubmit({username}: FormValues) {
    if (!currentUser?.uid) {
      return;
    }
    await userService.updateUser(currentUser.uid, { username });
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
        title="Имя пользователя"
        {...register("username", FORM_REGISTER_OPTIONS.USERNAME)}
        error={!!errors.username}
      />
    </EditForm>
  );
}