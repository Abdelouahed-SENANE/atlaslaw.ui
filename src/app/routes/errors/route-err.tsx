import { isRouteErrorResponse, useRouteError } from "react-router-dom";

 function RouteError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <div>Not found.</div>;
    if (error.status === 403) return <div>Forbidden.</div>;

    return (
      <div>
        {error.status} - {error.statusText}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Route Error</h1>
      <pre>{(error as any)?.message}</pre>
    </div>
  );
}

export default RouteError;
