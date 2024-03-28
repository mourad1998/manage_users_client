import { useUpdateUser } from "../services/UserServices";
import UserForm from "../components/UserForm";
import { UserType } from "../types";

interface UpdateUserPageProps {
  user: UserType;
  onSuccess: () => void;
}

export const UpdateUserPage = ({ user, onSuccess }: UpdateUserPageProps) => {
  console.log(user, "user");
  const updateUserMutation = useUpdateUser();
  const handleSubmit = async (values: UserType) => {
    await updateUserMutation.mutateAsync({
      userData: values,
    });
  };

  return (
    <UserForm
      onSubmit={handleSubmit}
      initialValues={user}
      onCloseModal={onSuccess}
    />
  );
};
