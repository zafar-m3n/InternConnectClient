import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { internshipsService } from "../../../services/internships";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";

const stripWrappedQuotes = (v) => (typeof v === "string" ? v.replace(/^"|"$/g, "") : v);

const schema = yup.object({
  title: yup.string().required("Title is required"),
  company: yup.string().required("Company is required"),
  // Accept either a string or a { value, label } object and coerce to string
  location: yup
    .string()
    .transform((value, originalValue) => {
      if (originalValue && typeof originalValue === "object") {
        return stripWrappedQuotes(originalValue.value ?? "");
      }
      return stripWrappedQuotes(originalValue ?? value);
    })
    .required("Location is required"),
  description: yup.string().required("Description is required"),
  requirements: yup.string(),
  duration: yup.string(),
  stipend: yup
    .number()
    .transform((val, orig) => (orig === "" || orig === null ? undefined : val))
    .min(0, "Stipend must be positive"),
  skills: yup.array(),
  company_email: yup.string().email("Invalid email").required("Company email is required"),
  application_deadline: yup
    .date()
    .nullable()
    .transform((val, orig) => (orig === "" ? null : val)),
  status: yup
    .string()
    .transform((value, originalValue) => {
      if (originalValue && typeof originalValue === "object") {
        return stripWrappedQuotes(originalValue.value ?? "");
      }
      return stripWrappedQuotes(originalValue ?? value);
    })
    .oneOf(["draft", "published", "closed"])
    .required("Status is required"),
});

const LiaisonInternshipForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const isEdit = !!id;

  const locationOptions = [
    { value: "Colombo", label: "Colombo" },
    { value: "Kandy", label: "Kandy" },
    { value: "Galle", label: "Galle" },
    { value: "Jaffna", label: "Jaffna" },
    { value: "Kurunegala", label: "Kurunegala" },
  ];

  const skillOptions = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "UI/UX Design", label: "UI/UX Design" },
    { value: "Machine Learning", label: "Machine Learning" },
    { value: "SQL", label: "SQL" },
  ];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "closed", label: "Closed" },
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      skills: [],
      status: "published",
    },
  });

  useEffect(() => {
    if (isEdit) {
      fetchInternship();
    }
  }, [id, isEdit]);

  const fetchInternship = async () => {
    try {
      const data = await internshipsService.get(id);

      // Set form values
      Object.keys(data).forEach((key) => {
        if (key === "skills") {
          const skillsArray = data.skills
            ? data.skills.split(", ").map((skill) => ({ value: skill, label: skill }))
            : [];
          setValue("skills", skillsArray);
        } else if (key === "location") {
          setValue(
            "location",
            locationOptions.find((opt) => opt.value === stripWrappedQuotes(data.location))
          );
        } else if (key === "status") {
          setValue(
            "status",
            statusOptions.find((opt) => opt.value === stripWrappedQuotes(data.status))
          );
        } else if (key === "application_deadline") {
          setValue(
            "application_deadline",
            data.application_deadline ? new Date(data.application_deadline).toISOString().split("T")[0] : ""
          );
        } else {
          setValue(key, data[key] || "");
        }
      });
    } catch (error) {
      toast.error("Failed to load internship");
      navigate("/industry/internships");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        location: data.location?.value || stripWrappedQuotes(data.location),
        skills: Array.isArray(data.skills) ? data.skills.map((skill) => skill.value).join(", ") : "",
        status: data.status?.value || stripWrappedQuotes(data.status),
        stipend: data.stipend || null,
        application_deadline: data.application_deadline || null,
      };

      if (isEdit) {
        await internshipsService.update(id, submitData);
        toast.success("Internship updated successfully");
      } else {
        await internshipsService.create(submitData);
        toast.success("Internship created successfully");
      }

      navigate("/industry/internships");
    } catch (error) {
      toast.error(isEdit ? "Failed to update internship" : "Failed to create internship");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{isEdit ? "Edit Internship" : "Create New Internship"}</h1>
        <p className="text-gray-600">
          {isEdit ? "Update internship details" : "Fill in the details to create a new internship opportunity"}
        </p>
      </div>

      <Card>
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Job Title *" {...register("title")} error={errors.title?.message} />

              <Input label="Company *" {...register("company")} error={errors.company?.message} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Location *"
                    options={locationOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.location?.message}
                  />
                )}
              />

              <Input
                label="Company Email *"
                type="email"
                {...register("company_email")}
                error={errors.company_email?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
              <textarea
                {...register("description")}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              <textarea
                {...register("requirements")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="List the qualifications, skills, and experience required..."
              />
              {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>}
            </div>

            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <Select
                  label="Required Skills"
                  options={skillOptions}
                  value={field.value}
                  onChange={field.onChange}
                  isMulti
                  placeholder="Select required skills..."
                  error={errors.skills?.message}
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Duration"
                {...register("duration")}
                placeholder="e.g., 6 months"
                error={errors.duration?.message}
              />

              <Input
                label="Stipend (LKR)"
                type="number"
                {...register("stipend")}
                placeholder="Monthly stipend amount"
                error={errors.stipend?.message}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Status *"
                    options={statusOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.status?.message}
                  />
                )}
              />
            </div>

            <Input
              label="Application Deadline"
              type="date"
              {...register("application_deadline")}
              error={errors.application_deadline?.message}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="secondary" onClick={() => navigate("/industry/internships")}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {isEdit ? "Update Internship" : "Create Internship"}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default LiaisonInternshipForm;
