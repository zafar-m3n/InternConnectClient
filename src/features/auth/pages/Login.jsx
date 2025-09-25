import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { authService } from "../../../services/auth";
import { setToken } from "../../../lib/auth";
import { useAuth } from "../../../app/AuthProvider";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Card from "../../../components/Card";

const HOME_BY_ROLE = {
  student: "/student/dashboard",
  industry_liaison: "/industry/dashboard",
  liaison: "/industry/dashboard",
  super_admin: "/admin/dashboard",
};

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      setToken(response.token);
      setUser(response.user);
      toast.success("Login successful");

      const defaultHome = HOME_BY_ROLE[response.user.role] || "/login";
      navigate(defaultHome, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to InternConnect</h2>
          <p className="mt-2 text-gray-600">Connect with internship opportunities</p>
        </div>

        <Card>
          <Card.Content>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />

              <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

              <Button type="submit" loading={loading} className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link to="/forgot" className="text-sm text-primary-600 hover:text-primary-500">
                Forgot your password?
              </Link>
              <div>
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Link to="/register" className="text-sm text-primary-600 hover:text-primary-500">
                  Sign up
                </Link>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Login;
