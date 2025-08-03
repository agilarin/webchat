import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EditNameSchema } from "@/schemas/auth";
import { updateUserProfile } from "@/services/userService.ts";
import { useCurrentUser } from "@/hooks/store/useCurrentUser";
import { EditForm } from "@/components/Forms/EditForm";
import { AuthInput } from "@/components/Forms/AuthForm";

type EditNameFields = z.infer<typeof EditNameSchema>;

interface EditNameProps {
  open: boolean;
  onClose: () => void;
}

export function EditName({ open, onClose }: EditNameProps) {
  const user = useCurrentUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditNameFields>({
    resolver: zodResolver(EditNameSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  async function onSubmit({ firstName, lastName }: EditNameFields) {
    if (!user?.id) {
      return;
    }
    await updateUserProfile(user?.id, { firstName, lastName });
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
        title="Имя"
        {...register("firstName")}
        error={!!errors.firstName}
      />
      <AuthInput
        type="text"
        title="Фамилия"
        {...register("lastName")}
        error={!!errors.lastName}
      />
    </EditForm>
  );
}
