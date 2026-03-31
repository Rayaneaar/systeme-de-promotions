import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TeacherForm } from "@/features/TeacherForm";
import { professeurApi } from "@/api/professeurApi";
import { extractErrorMessage } from "@/lib/utils";
function CreateTeacherPage() {
  const navigate = useNavigate();
  const createMutation = useMutation({
    mutationFn: professeurApi.createTeacher,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate(`/admin/enseignants/${response.data.id}`);
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });
  return <section className="glass-panel rounded-[28px] border border-white/60 p-6">
      <h3 className="text-xl font-bold text-slate-950">Nouvel enseignant</h3>
      <p className="mt-2 text-sm text-slate-600">Creation rapide d'un dossier enseignant.</p>
      <div className="mt-6">
        <TeacherForm
    submitLabel="Creer le dossier"
    busy={createMutation.isPending}
    onSubmit={async (values) => {
      await createMutation.mutateAsync({
        ...values,
        password: values.password || "password"
      });
    }}
  />
      </div>
    </section>;
}
export {
  CreateTeacherPage as default
};
