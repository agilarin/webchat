import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditPasswordSchema } from "@/schemas/auth";
import { updatePassword } from "@/services/authService.ts";
import { AuthInput } from "@/components/Forms/AuthForm";
import { EditForm } from "@/components/Forms/EditForm";

type EditPasswordFields = z.infer<typeof EditPasswordSchema>;

interface EditPasswordProps {
  open: boolean;
  onClose: () => void;
}

export function EditPassword({ open, onClose }: EditPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPasswordFields>({
    resolver: zodResolver(EditPasswordSchema),
  });

  async function onSubmit({ oldPassword, newPassword }: EditPasswordFields) {
    await updatePassword({ oldPassword, newPassword });
    onClose();
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
        {...register("oldPassword")}
        error={!!errors.oldPassword}
      />
      <AuthInput
        type="password"
        title="Новый пароль"
        {...register("newPassword")}
        error={!!errors.newPassword}
      />
      <AuthInput
        type="password"
        title="Подтвердите пароль"
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
      />
    </EditForm>
  );
}
