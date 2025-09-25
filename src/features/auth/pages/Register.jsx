import { useState, useEffect } from "react";
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
import { ControlledSelect } from "../../../components/Select";
import Card from "../../../components/Card";

const HOME_BY_ROLE = {
  student: "/student/dashboard",
  industry_liaison: "/industry/dashboard",
  liaison: "/industry/dashboard",
  super_admin: "/admin/dashboard",
};

const schema = yup.object({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  university_id: yup.string().required("University is required"),
  role: yup.string().oneOf(["student", "industry_liaison"]).required("Role is required"),
});

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "student",
    },
  });

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await authService.getUniversities();
        setUniversities(data.map((uni) => ({ value: uni.id, label: uni.name })));
      } catch (error) {
        toast.error("Failed to load universities");
      }
    };

    fetchUniversities();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = data;
      const response = await authService.register(submitData);
      setToken(response.token);
      setUser(response.user);
      toast.success("Registration successful");

      const defaultHome = HOME_BY_ROLE[response.user.role] || "/login";
      navigate(defaultHome, { replace: true });
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "student", label: "Student" },
    { value: "liaison", label: "University Liaison" },
  ];

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Join InternConnect</h2>
          <p className="mt-2 text-gray-600">Create your account to get started</p>
        </div>

        <Card>
          <Card.Content>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input label="Full Name" {...register("full_name")} error={errors.full_name?.message} />

              <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />

              <ControlledSelect
                name="role"
                control={control}
                label="Role"
                options={roleOptions}
                error={errors.role?.message}
              />

              <ControlledSelect
                name="university_id"
                control={control}
                label="University"
                options={universities}
                placeholder="Select your university"
                error={errors.university_id?.message}
              />

              <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />

              <Input
                label="Confirm Password"
                type="password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />

              <Button type="submit" loading={loading} className="w-full">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Register;
