import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { UserType } from "../types";

interface UserFormProps {
  onSubmit: (values: UserType) => Promise<void>;
  initialValues?: UserType;
  onCloseModal: () => void;
}

const { Option } = Select;

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  initialValues,
  onCloseModal,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Formatted values
      const formattedValues: UserType = {
        user: {
          username: values.user,
          email: values.email,
          id: initialValues?.user.id || 0,
        },
        hometown: values.hometown,
        age: values.age,
        gender: values.gender,
        id: initialValues?.id || 0,
      };

      //
      await onSubmit(formattedValues);
      form.resetFields();
      onCloseModal();
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
    setLoading(false);
  };

  return (
    <Form form={form} onFinish={handleSubmit} initialValues={initialValues}>
      <Form.Item
        name="user"
        label="Username"
        rules={[{ required: true, message: "Please input username!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input email!" },
          { type: "email", message: "Invalid email address" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="age"
        label="Age"
        rules={[{ required: true, message: "Please input age!" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="hometown"
        label="Hometown"
        rules={[{ required: true, message: "Please input hometown!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: "Please select gender!" }]}
      >
        <Select>
          <Option value="M">Male</Option>
          <Option value="F">Female</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
