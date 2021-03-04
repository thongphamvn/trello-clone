import { Layout } from "antd";
import { BoardContent } from "./Content";
import { BoardHeader } from "./Header";

const { Header, Content } = Layout;

export const Board = () => {
  return (
    <Layout
      style={{
        backgroundColor: "rgb(0, 121, 191)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header style={{ backgroundColor: "rgba(0,0,0,.15)", height: "40px" }}>
        <BoardHeader />
      </Header>
      <Content style={{ flex: 1 }}>
        <BoardContent />
      </Content>
    </Layout>
  );
};
