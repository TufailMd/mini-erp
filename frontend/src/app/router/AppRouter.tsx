import {
  createBrowserRouter,
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import MiniErpApp from "../../pages/MiniErpApp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MiniErpApp />,
  },
]);