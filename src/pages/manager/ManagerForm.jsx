import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import FormInput from "../../components/common/FormInput";
import FormSelect from "../../components/common/FormSelect";
import { managerSchema } from "../../schema/manager.schema";
import {
  addDummyManager,
  editDummyManager,
  getDummyManager,
} from "../../utils/dummyManagerData";

const emptyManager = {
  name: "",
  email: "",
  phone: "",
  department: "",
  status: "Active",
};

const ManagerForm = () => {
  const { managerId } = useParams();
  let manager = null;
  let loadError = "";
  if (managerId) {
    try {
      manager = getDummyManager(managerId);
    } catch (error) {
      loadError = error.message;
    }
  }

  if (loadError) {
    return (
      <section className="mx-auto w-full max-w-7xl">
        <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Could not load manager: {loadError}
        </div>
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600" to="/manager">
          <ArrowLeft size={16} /> Back to managers
        </Link>
      </section>
    );
  }

  return (
    <ManagerFormFields
      key={managerId || "new-manager"}
      managerId={managerId}
      manager={manager}
    />
  );
};

const ManagerFormFields = ({ managerId, manager }) => {
  const isEditing = Boolean(managerId);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(managerSchema),
    defaultValues: manager
      ? {
        name: manager.name,
        email: manager.email,
        phone: manager.phone || "",
        department: manager.department,
        status: manager.status,
      }
      : emptyManager,
  });

  const submit = (form) => {
    setSubmitError("");
    setIsSaving(true);
    try {
      if (isEditing) {
        editDummyManager({ id: managerId, ...form });
      } else {
        addDummyManager(form);
      }
      navigate("/manager");
    } catch (error) {
      setSubmitError(error.message || "Could not save manager.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl">
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600" to="/manager">
        <ArrowLeft size={16} /> Back to managers
      </Link>
      <div className="mb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          {isEditing ? "Edit manager" : "Add a manager"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isEditing ? "Update this manager’s details below." : "Add a new person to your team directory."}
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} noValidate className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {submitError && (
          <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Could not save manager: {submitError}
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput
            id="name"
            label="Full name"
            placeholder="e.g. Alex Morgan"
            registration={register("name")}
            error={errors.name?.message}
          />
          <FormInput
            id="email"
            label="Email address"
            type="email"
            placeholder="name@company.com"
            registration={register("email")}
            error={errors.email?.message}
          />
          <FormInput
            id="department"
            label="Department"
            placeholder="e.g. Operations"
            registration={register("department")}
            error={errors.department?.message}
          />
          <FormInput
            id="phone"
            label={<>Phone number <span className="font-normal text-slate-400">(optional)</span></>}
            type="tel"
            placeholder="+1 (555) 000-0000"
            registration={register("phone")}
            error={errors.phone?.message}
          />
          <FormSelect
            id="status"
            label="Status"
            registration={register("status")}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        </div>
        <div className="mt-7 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Link to="/manager" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isSaving}
            size="lg"
          >
            {isSaving ? "Saving..." : isEditing ? "Save changes" : "Create manager"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ManagerForm;
