import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditUsernameSchema } from "@/schemas/auth";
import { useCurrentUser } from "@/hooks/store/useCurrentUser";
import { EditForm } from "@/components/Forms/EditForm";
import { AuthInput } from "@/components/Forms/AuthForm";
import { updateUsername } from "@/services/usernameService";

type FormValues = {
  newUsername: string;
};

type EditUsernameFields = z.infer<typeof EditUsernameSchema>;

interface EditUsernameProps {
  open: boolean;
  onClose: () => void;
}

export function EditUsername({ open, onClose }: EditUsernameProps) {
  const user = useCurrentUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUsernameFields>({
    resolver: zodResolver(EditUsernameSchema),
    defaultValues: {
      newUsername: user?.username || "",
    },
  });

  async function onSubmit({ newUsername }: FormValues) {
    if (!user?.id) {
      return;
    }
    await updateUsername(user.id, newUsername);
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
        title="Имя пользователя"
        {...register("newUsername")}
        error={!!errors.newUsername}
      />
    </EditForm>
  );
}
