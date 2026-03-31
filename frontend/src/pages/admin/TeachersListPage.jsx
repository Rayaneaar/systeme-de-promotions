import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { professeurApi } from "@/api/professeurApi";
import { extractErrorMessage, formatDate } from "@/lib/utils";
function TeachersListPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => professeurApi.getTeachers({ per_page: 50 })
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => professeurApi.deleteTeacher(id),
    onSuccess: () => {
      toast.success("Enseignant supprime.");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });
  return <section className="glass-panel rounded-[28px] border border-white/60 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-950">Enseignants</h3>
          <p className="text-sm text-slate-600">Vue d'ensemble des dossiers et eligibilites.</p>
        </div>
        <Link
    to="/admin/enseignants/nouveau"
    className="inline-flex rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
  >
          Ajouter un enseignant
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-3">Nom</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Grade</th>
              <th className="pb-3">Echelon</th>
              <th className="pb-3">Recrutement</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(data?.data ?? []).map((teacher) => <tr key={teacher.id}>
                <td className="py-4 font-medium text-slate-900">{teacher.full_name}</td>
                <td className="py-4 text-slate-600">{teacher.email}</td>
                <td className="py-4 text-slate-600">{teacher.grade_label}</td>
                <td className="py-4 text-slate-600">{teacher.echelon}</td>
                <td className="py-4 text-slate-600">{formatDate(teacher.date_recrutement)}</td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/admin/enseignants/${teacher.id}`} className="font-semibold text-blue-700">
                      Voir
                    </Link>
                    <Link to={`/admin/enseignants/${teacher.id}/modifier`} className="font-semibold text-slate-700">
                      Modifier
                    </Link>
                    <button
    type="button"
    onClick={() => {
      if (window.confirm(`Supprimer ${teacher.full_name} ?`)) {
        deleteMutation.mutate(teacher.id);
      }
    }}
    className="font-semibold text-rose-700"
  >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
        {!isLoading && !data?.data.length && <p className="py-8 text-sm text-slate-500">Aucun enseignant trouve.</p>}
      </div>
    </section>;
}
export {
  TeachersListPage as default
};
