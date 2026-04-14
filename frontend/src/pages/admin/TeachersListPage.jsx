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
  const teachers = data?.data ?? [];
  return <div className="space-y-6">
      <section className="soft-panel rounded-[34px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="page-eyebrow">Faculty Directory</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Dossiers enseignants
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Consultez les dossiers, creez de nouveaux comptes enseignants et suivez les dates
              importantes de carriere.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/admin/enseignants/import"
              className="accent-button inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 sm:w-auto"
            >
              Ajouter ou importer
            </Link>
          </div>
        </div>
      </section>

      <section className="soft-panel rounded-[34px] px-4 py-4 sm:px-5 sm:py-5">
        <div className="grid gap-4 xl:hidden">
          {teachers.map((teacher) => <article key={teacher.id} className="soft-card rounded-[28px] px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex flex-col gap-4">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-slate-950">{teacher.full_name}</p>
                  <p className="mt-1 break-all text-sm text-slate-500">{teacher.email}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
              ["Grade", teacher.grade_label],
              ["Echelon", teacher.echelon],
              ["Recrutement", formatDate(teacher.date_recrutement)],
              ["Derniere promo", formatDate(teacher.date_last_promotion)],
              ["Numero DR", teacher.num_dr]
            ].map(([label, value]) => <div key={label} className="rounded-[22px] bg-white/80 px-4 py-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
                    </div>)}
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <Link
      to={`/admin/enseignants/${teacher.id}`}
      className="rounded-full bg-indigo-50 px-4 py-3 text-center text-sm font-semibold text-indigo-600"
    >
                    Voir
                  </Link>
                  <Link
      to={`/admin/enseignants/${teacher.id}/modifier`}
      className="rounded-full bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-700"
    >
                    Modifier
                  </Link>
                  <button
      type="button"
      onClick={() => {
        if (window.confirm(`Supprimer ${teacher.full_name} ?`)) {
          deleteMutation.mutate(teacher.id);
        }
      }}
      className="rounded-full bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
    >
                    Supprimer
                  </button>
                </div>
              </div>
            </article>)}
          {!isLoading && !teachers.length && <p className="py-8 text-center text-sm text-slate-500">Aucun enseignant trouve.</p>}
        </div>

        <div className="hidden xl:block">
          <div className="overflow-x-auto">
            <table className="min-w-[940px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  <th className="px-4 py-4">Nom</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Grade</th>
                  <th className="px-4 py-4">Echelon</th>
                  <th className="px-4 py-4">Recrutement</th>
                  <th className="px-4 py-4">Derniere promo</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {teachers.map((teacher) => <tr key={teacher.id} className="align-top">
                    <td className="px-4 py-5 font-semibold text-slate-950">{teacher.full_name}</td>
                    <td className="px-4 py-5 text-slate-500">{teacher.email}</td>
                    <td className="px-4 py-5 text-slate-600">{teacher.grade_label}</td>
                    <td className="px-4 py-5 text-slate-600">{teacher.echelon}</td>
                    <td className="px-4 py-5 text-slate-600">{formatDate(teacher.date_recrutement)}</td>
                    <td className="px-4 py-5 text-slate-600">{formatDate(teacher.date_last_promotion)}</td>
                    <td className="px-4 py-5">
                      <div className="flex flex-wrap gap-3">
                        <Link to={`/admin/enseignants/${teacher.id}`} className="font-semibold text-indigo-600">
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
          </div>
          {!isLoading && !teachers.length && <p className="py-8 text-center text-sm text-slate-500">Aucun enseignant trouve.</p>}
        </div>
      </section>
    </div>;
}

export {
  TeachersListPage as default
};
