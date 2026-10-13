
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/FormInput";
import { loginSchema } from "@/schema/login.schema";
import { login } from "@/utils/authData";


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoginError("");
    setIsLoggingIn(true);
    try {
      login(data);
      navigate("/", { replace: true });
    } catch (error) {
      setLoginError(error.message || "Could not sign in.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to log in.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {location.state?.registered && (
            <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Account created. Sign in with your new credentials.
            </p>
          )}
          <p className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Demo accounts: admin@workspace.com, olivia.rhye@example.com, or
            employee@workspace.com. Password: <strong>Demo1234</strong>
          </p>
          {loginError && (
            <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {loginError}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              registration={register("email")}
              error={errors.email?.message}
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              registration={register("password")}
              error={errors.password?.message}
            />

            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 underline underline-offset-4 hover:text-indigo-700"
              >
                Sign up
              </Link>
            </p>

            <Button
              type="submit"
              disabled={isSubmitting || isLoggingIn}
              className="w-full"
            >
              {isSubmitting || isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter />
      </Card>
    </div>
  );
};

export default Login;
