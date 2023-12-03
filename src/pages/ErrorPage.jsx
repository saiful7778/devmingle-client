import { Helmet } from "react-helmet";
import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const routerError = useRouteError();
  console.error(routerError);
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Helmet>
        <title>404! not found</title>
      </Helmet>
      <div className="space-y-3 text-center">
        <h3 className="text-3xl font-bold">404! not found</h3>
        <p>
          <i>{routerError.statusText}</i>
        </p>
        <p>
          <i>{routerError.data}</i>
        </p>
        <Link to="/" className="text-blue-600 underline italic capitalize">
          go to home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
