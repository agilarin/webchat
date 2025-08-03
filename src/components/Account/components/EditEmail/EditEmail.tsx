import { z } from "zod/v4";
import { useForm } from "react-hook-form";

import { EditEmailSchema } from "@/schemas/auth";
import { updateEmail } from "@/services/authService.ts";
import { useCurrentUser } from "@/hooks/store/useCurrentUser";
import { EditForm } from "@/components/Forms/EditForm";
import { AuthInput } from "@/components/Forms/AuthForm";
import { zodResolver } from "@hookform/resolvers/zod";

type EditEmailFields = z.infer<typeof EditEmailSchema>;

interface EditEmailProps {
  open: boolean;
  onClose: () => void;
}

export function EditEmail({ open, onClose }: EditEmailProps) {
  const user = useCurrentUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditEmailFields>({
    resolver: zodResolver(EditEmailSchema),
    defaultValues: {
      newEmail: user?.email || "",
    },
  });

  async function onSubmit({ newEmail, password }: EditEmailFields) {
    await updateEmail({ newEmail, password });
    onClose();
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
        {...register("newEmail")}
        error={!!errors.newEmail}
      />
      <AuthInput
        type="password"
        title="Пароль"
        {...register("password")}
        error={!!errors.password}
      />
    </EditForm>
  );
}
