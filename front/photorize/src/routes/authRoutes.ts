import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

export const authRoutes = [
    {
      path: '/login',
      Component: Login
    },
    {
      path: '/register',
      Component: Register  
    }
  ];