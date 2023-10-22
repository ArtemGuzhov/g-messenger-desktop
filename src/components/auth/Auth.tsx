import { Button, Form, Input, Layout, Typography, message } from "antd";
import React, { useEffect } from "react";
import { useActions } from "../../hooks/use-actions";
import { useTypedSelector } from "../../hooks/use-typed-selector";

interface IFormFields {
  email: string;
  password: string;
}

function Auth() {
  const { loading, error } = useTypedSelector((state) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const { signIn } = useActions();

  const onSignIn = (form: IFormFields) => {
    signIn(form);
  };

  const callErrorMsg = () => {
    messageApi.open({
      type: "error",
      content: error,
    });
  };

  useEffect(() => {
    if (error !== null) {
      callErrorMsg();
    }
  }, [error]);

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {contextHolder}
      <Form
        name="basic"
        style={{
          maxWidth: 600,
          backgroundColor: "#ffff",
          padding: 10,
          borderRadius: 10,
          border: "1px solid #000",
          marginTop: "35vh",
          marginLeft: "30vw",
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ email: "artem@bk.ru", password: "Qwerty123" }}
        onFinish={onSignIn}
        autoComplete="off"
      >
        <Typography.Title italic style={{ textAlign: "center" }}>
          G-Messenger
        </Typography.Title>

        <Form.Item<IFormFields>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Пожалуйста, введите вашу почту" },
          ]}
        >
          <Input disabled={loading} />
        </Form.Item>

        <Form.Item<IFormFields>
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Пожалуйста, введите ваш пароль" },
          ]}
        >
          <Input.Password disabled={loading} />
        </Form.Item>

        <Form.Item
          wrapperCol={
            loading ? { offset: 18, span: 5 } : { offset: 19, span: 4 }
          }
        >
          <div style={{ display: "flex" }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Войти
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default Auth;
