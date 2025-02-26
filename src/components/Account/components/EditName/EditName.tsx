import {useForm} from "react-hook-form";
import userService from "@/services/userService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {EditForm} from "@/components/EditForm";
import {AuthInput} from "@/pages/AuthPage/components/AuthInput";


type FormValues = {
  firstName: string,
  lastName: string,
}

interface EditNameProps {
  open: boolean,
  onClose: () => void,
}

export function EditName({open, onClose}: EditNameProps) {
  const {currentUser, userInfo} = useAuthContext();
  const {register, handleSubmit, formState: { errors }} = useForm<FormValues>({
    defaultValues: {
      firstName: userInfo?.firstName || "",
      lastName: userInfo?.lastName || "",
    }
  });


  async function onSubmit({firstName, lastName}: FormValues) {
    if (!currentUser?.uid) {
      return
    }
    await userService.updateUser(currentUser?.uid, { firstName, lastName })
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
        title="Имя"
        {...register("firstName", {
          minLength: 2,
          validate: (value, formValues) => {
            if (value === "" && formValues.lastName === "") {
              return "";
            }
          }
        })}
        error={!!errors.firstName}
      />
      <AuthInput
        type="text"
        title="Фамилия"
        {...register("lastName", {
          minLength: 2
        })}
        error={!!errors.lastName}
      />

    </EditForm>
  );
}