import { useAddUser } from "../services/UserServices";
import { UserType } from "../types";
import UserForm from "../components/UserForm";

interface AddUserPageProps {
  onSuccess: () => void; // Callback function to notify success
}

export const AddUserPage = ({ onSuccess }: AddUserPageProps) => {
  const addUserMutation = useAddUser();

  const handleSubmit = async (values: UserType) => {
    await addUserMutation.mutateAsync(values);
  };

  return <UserForm onSubmit={handleSubmit} onCloseModal={onSuccess} />;
};
