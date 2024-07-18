import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TicTacToe from "./pages/TicTacToe";
import { useState } from "react";
import ThemeContext from "./context";
import Login from "./pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/tictactoe",
    element: <TicTacToe />,
  },
]);

export default function App() {
  const [theme, setTheme] = useState("slate");
  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        setTheme: setTheme,
      }}
    >
      <RouterProvider router={router} />
    </ThemeContext.Provider>
  );
}
