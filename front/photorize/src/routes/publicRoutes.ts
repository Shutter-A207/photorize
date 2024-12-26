import Loading from "../pages/Loading";
import NotFound from "../pages/NotFound";

export const publicRoutes = [
    {
      path: '/',
      Component: Loading
    },
    {
      path: '*', 
      Component: NotFound
    }
  ];