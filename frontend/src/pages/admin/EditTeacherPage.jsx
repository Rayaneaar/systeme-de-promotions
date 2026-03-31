import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { TeacherForm } from "@/features/TeacherForm";
import { professeurApi } from "@/api/professeurApi";
import { extractErrorMessage } from "@/lib/utils";
function EditTeacherPage() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const teacherQuery = useQuery({
    queryKey: ["teacher", id],
    queryFn: () => professeurApi.getTeacher(id)
  });
  const updateMutation = useMutation({
    mutationFn: (payload) => professeurApi.updateTeacher(id, payload),
    onSuccess: () => {
      toast.success("Dossier mis a jour.");
      navigate(`/admin/enseignants/${id}`);
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });
  return <section className="glass-panel rounded-[28px] border border-white/60 p-6">
      <h3 className="text-xl font-bold text-slate-950">Modifier le dossier enseignant</h3>
      <div className="mt-6">
        {teacherQuery.data && <TeacherForm
    submitLabel="Enregistrer les modifications"
    busy={updateMutation.isPending}
    withPassword={false}
    initialValues={{
      ...teacherQuery.data.data,
      cin: teacherQuery.data.data.cin ?? void 0,
      ppr: teacherQuery.data.data.ppr ?? void 0,
      phone: teacherQuery.data.data.phone ?? void 0,
      address: teacherQuery.data.data.address ?? void 0,
      specialite: teacherQuery.data.data.specialite ?? void 0,
      date_of_birth: teacherQuery.data.data.date_of_birth ?? void 0,
      date_last_promotion: teacherQuery.data.data.date_last_promotion ?? void 0,
      date_last_grade_promotion: teacherQuery.data.data.date_last_grade_promotion ?? void 0,
      date_last_echelon_promotion: teacherQuery.data.data.date_last_echelon_promotion ?? void 0
    }}
    onSubmit={async (values) => {
      await updateMutation.mutateAsync(values);
    }}
  />}
      </div>
    </section>;
}
export {
  EditTeacherPage as default
};
