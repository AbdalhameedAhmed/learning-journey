import { ArrowLeft, Home, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnAuthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
            <Shield className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This area requires special permissions. Please contact an
            administrator if you believe this is a mistake.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Go Home
            <Home className="mr-2 h-5 w-5" />
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Go Back
            <ArrowLeft className="mr-2 h-5 w-5" />
          </button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need access?{" "}
            <Link
              to="/contact"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Request permissions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
