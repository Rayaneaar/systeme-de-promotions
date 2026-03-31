import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { professeurApi } from "@/api/professeurApi";
import { extractErrorMessage } from "@/lib/utils";
function MyProfilePage() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => professeurApi.getMyProfile()
  });
  const [form, setForm] = useState({});
  useEffect(() => {
    if (profileQuery.data?.data) {
      setForm({
        first_name: profileQuery.data.data.first_name,
        last_name: profileQuery.data.data.last_name,
        email: profileQuery.data.data.email ?? "",
        cin: profileQuery.data.data.cin ?? "",
        ppr: profileQuery.data.data.ppr ?? "",
        phone: profileQuery.data.data.phone ?? "",
        address: profileQuery.data.data.address ?? "",
        specialite: profileQuery.data.data.specialite ?? ""
      });
    }
  }, [profileQuery.data]);
  const updateMutation = useMutation({
    mutationFn: () => professeurApi.updateMyProfile(form),
    onSuccess: () => {
      toast.success("Profil mis a jour.");
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });
  return <section className="glass-panel rounded-[28px] border border-white/60 p-6">
      <h3 className="text-xl font-bold text-slate-950">Mon profil</h3>
      <form
    className="mt-6 grid gap-4 md:grid-cols-2"
    onSubmit={(event) => {
      event.preventDefault();
      updateMutation.mutate();
    }}
  >
        {Object.entries({
    first_name: "Prenom",
    last_name: "Nom",
    email: "Email",
    cin: "CIN",
    ppr: "PPR",
    phone: "Telephone",
    specialite: "Specialite"
  }).map(([key, label]) => <label key={key} className="space-y-2 text-sm font-medium text-slate-700">
            <span>{label}</span>
            <input
    value={form[key] ?? ""}
    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
          </label>)}
        <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Adresse</span>
          <textarea
    rows={3}
    value={form.address ?? ""}
    onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
        </label>
        <div className="md:col-span-2">
          <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            Enregistrer
          </button>
        </div>
      </form>
    </section>;
}
export {
  MyProfilePage as default
};
