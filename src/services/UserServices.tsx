import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiUrl } from "../config";
import { UserType } from "../types";

interface ApiResponse<T> {
  data: T[];
  count: number;
  num_pages: number;
  current_page: number;
}

export const useFetchUsers = (page: number, pageSize: number) => {
  const { data, isLoading, refetch } = useQuery<ApiResponse<UserType>>(
    ["users", page, pageSize],
    async () => {
      const response = await fetch(
        `${apiUrl}/profiles?page=${page}&pageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      return data;
    }
  );

  return { data, isLoading, refetch };
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>(
    async (userId) => {
      const response = await fetch(`${apiUrl}/user/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<UserType, Error, { userData: UserType }>(
    (variables) => {
      const { userData } = variables;
      return fetch(`${apiUrl}/profile/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        return response.json();
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation<UserType, Error, UserType>(
    (values) => {
      return fetch(`${apiUrl}/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add user");
        }
        return response.json();
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
};
