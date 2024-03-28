import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Space, message, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useFetchUsers, useDeleteUser } from "../services/UserServices";
import { UpdateUserPage } from "./UpdateUser";
import { AddUserPage } from "./AddUser";
import { SearchCriteria, UserType } from "../types";
import SearchCriteriaSelect from "../components/SearchCriteriaSelect";

const { confirm } = Modal;
const { Search } = Input;

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserData, setSelectedUserData] = useState<UserType>(null!);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(
    SearchCriteria.Username
  );

  // fetch users
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useFetchUsers(currentPage, 6, searchText, searchCriteria);

  // delete user by ID
  const deleteUserMutation = useDeleteUser();

  useEffect(() => {
    refetch(); // Trigger a refetch whenever currentPage, searchText, or searchCriteria changes
  }, [currentPage, searchText, searchCriteria, refetch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditUser = (userId: number) => {
    const selectedUser = usersData?.data.find((user) => user.id === userId);
    setSelectedUserId(userId);

    if (selectedUser) {
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

  const handleCloseModal = () => {
    setSelectedUserId(null);
    setIsAddModalVisible(false);
  };

  const handleAddSuccess = () => {
    setIsAddModalVisible(false);
  };

  const handleSearch = (value: string) => {
    if (value.trim() === "") {
      setSearchText("");
      setCurrentPage(1);
    } else {
      setSearchText(value);
    }
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
      <div className="flex justify-between items-center m-5">
        <div>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
          >
            Ajouter un utilisateur
          </Button>
        </div>
        <div>
          <SearchCriteriaSelect
            defaultValue={searchCriteria}
            onChange={setSearchCriteria}
          />
          <Search
            placeholder={`Rechercher par ${
              searchCriteria === "username"
                ? "nom d'utilisateur"
                : searchCriteria === "age"
                ? "âge"
                : "ville"
            }`}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>
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
