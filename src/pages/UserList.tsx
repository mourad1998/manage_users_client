import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Space, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useFetchUsers, useDeleteUser } from "../services/UserServices";
import { UpdateUserPage } from "../components/UpdateUser";
import { AddUserPage } from "../components/AddUser";
import { UserType } from "../types";

const { confirm } = Modal;

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserData, setSelectedUserData] = useState<UserType>(null!);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // fetch users
  const { data: usersData, isLoading, refetch } = useFetchUsers(currentPage, 6);

  // delete user by ID
  const deleteUserMutation = useDeleteUser();

  const handleDeleteUser = (userId: number) => {
    confirm({
      title: "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
      icon: <ExclamationCircleOutlined />,
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk() {
        deleteUserMutation.mutate(userId);
        message.success("L'utilisateur a été supprimé avec succès.");
      },
      onCancel() {
        message.info("Suppression annulée.");
      },
    });
  };

  useEffect(() => {
    refetch(); // Trigger a refetch whenever currentPage changes
  }, [currentPage, refetch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditUser = (userId: number) => {
    const selectedUser = usersData?.data.find((user) => user.id === userId);
    setSelectedUserId(userId);

    if (selectedUser) {
      setSelectedUserId(userId);
      setSelectedUserData({
        id: selectedUser.id,
        user: {
          id: selectedUser.user.id,
          username: selectedUser.user.username,
          email: selectedUser.user.email,
        },
        age: selectedUser.age,
        hometown: selectedUser.hometown,
        gender: selectedUser.gender,
      });
    }
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
    setIsAddModalVisible(false);
  };

  const handleAddSuccess = () => {
    setIsAddModalVisible(false);
  };

  const columns: TableColumnsType<UserType> = [
    {
      title: "Name",
      dataIndex: ["user", "username"],
      width: 150,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      width: 150,
    },
    {
      title: "Age",
      dataIndex: "age",
      width: 150,
    },
    {
      title: "Hometown",
      dataIndex: "hometown",
      width: 150,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: 150,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record.id as number)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id as number)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-3xl text-center font-semibold mb-4">
        Gestion utilisateurs
      </h1>
      <div className="flex justify-left m-5">
        <Button
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalVisible(true)}
        >
          Ajouter un utilisateur
        </Button>
      </div>
      <div className="mx-4">
        <Table
          loading={isLoading}
          dataSource={usersData?.data.map((user) => ({
            ...user,
            key: user.id,
          }))}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: 6,
            total: usersData?.count,
            onChange: handlePageChange,
          }}
        />
      </div>
      <Modal
        title={
          selectedUserId ? "Modifier l'utilisateur" : "Ajouter un utilisateur"
        }
        open={selectedUserId !== null || isAddModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedUserId !== null ? (
          <UpdateUserPage
            user={selectedUserData}
            onSuccess={() => setSelectedUserId(null)}
          />
        ) : (
          <AddUserPage onSuccess={handleAddSuccess} />
        )}
      </Modal>
    </div>
  );
};

export default UserList;
