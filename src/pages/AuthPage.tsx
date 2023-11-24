// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from "../imgs/logo.jpeg";
// @ts-check
import { Button, Form, Input } from "antd";
import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../store/store";

type FieldType = {
  email?: string;
  password?: string;
};

const AuthPage = () => {
  const store = useContext(StoreContext);
  const isLoading = store.isAuthLoading;

  const onFinish = (payload: { email: string; password: string }) => {
    store.login(payload);
  };

  useEffect(() => {
    store.validateToken();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <img style={{ maxWidth: "100%", maxHeight: "100%" }} src={logo} />
      </div>
      <div
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          backgroundColor: "#444375",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            style={{
              minWidth: 600,
              backgroundColor: "#fff",
              borderRadius: 10,
              border: "1px solid #35345c",
              padding: 20,
            }}
            initialValues={{ email: "artem@bk.ru", password: "Qwerty123" }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[{ required: true, message: "Введите почту" }]}
            >
              <Input disabled={isLoading} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Пароль"
              name="password"
              rules={[{ required: true, message: "Введите пароль" }]}
            >
              <Input.Password disabled={isLoading} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{ backgroundColor: "#444375", color: "#fff" }}
              >
                Войти
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default observer(AuthPage);
