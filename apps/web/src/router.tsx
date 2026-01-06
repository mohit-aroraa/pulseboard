import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "./screens/LoginPage";
import { BoardsListPage } from "./screens/BoardsListPage";
import { BoardPage } from "./screens/BoardPage";
import { AppShell } from "./components/layout/AppShell";
import { RegisterPage } from "./screens/RegisterPage";

function requireAuth() {
  const token = localStorage.getItem("token");
  return token ? null : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: requireAuth() ?? <AppShell />,
    children: [
      { index: true, element: <BoardsListPage /> },
      { path: "boards/:boardId", element: <BoardPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
