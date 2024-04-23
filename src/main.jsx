import React from "react";
import ReactDOM from "react-dom/client";
import "@/assets/styles/style.css";
import { RouterProvider } from "react-router-dom";
import route from "@/routes";
import AuthContext from "@/hooks/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContext>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={route} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthContext>
  </React.StrictMode>
);
