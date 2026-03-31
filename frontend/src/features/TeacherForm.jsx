import { useEffect, useState } from "react";
const defaultValues = {
  num_dr: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
  cin: "",
  ppr: "",
  date_of_birth: "",
  phone: "",
  address: "",
  specialite: "",
  grade: "A",
  echelon: 1,
  date_recrutement: "",
  date_last_promotion: "",
  date_last_grade_promotion: "",
  date_last_echelon_promotion: ""
};
function TeacherForm({
  initialValues,
  submitLabel,
  onSubmit,
  busy = false,
  withPassword = true
}) {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  useEffect(() => {
    setValues({ ...defaultValues, ...initialValues });
  }, [initialValues]);
  function update(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }
  return <form
    className="grid gap-4 md:grid-cols-2"
    onSubmit={async (event) => {
      event.preventDefault();
      await onSubmit(values);
    }}
  >
      {[
    ["num_dr", "Numero DR"],
    ["first_name", "Prenom"],
    ["last_name", "Nom"],
    ["email", "Email"],
    ["cin", "CIN"],
    ["ppr", "PPR"],
    ["date_of_birth", "Date de naissance"],
    ["phone", "Telephone"],
    ["specialite", "Specialite"],
    ["date_recrutement", "Date de recrutement"],
    ["date_last_promotion", "Derniere promotion"],
    ["date_last_grade_promotion", "Derniere promotion de grade"],
    ["date_last_echelon_promotion", "Derniere promotion d'echelon"]
  ].map(([key, label]) => <label key={key} className="space-y-2 text-sm font-medium text-slate-700">
          <span>{label}</span>
          <input
    type={key.includes("date") ? "date" : "text"}
    value={String(values[key] ?? "")}
    onChange={(event) => update(key, event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
        </label>)}

      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Grade</span>
        <select
    value={values.grade}
    onChange={(event) => update("grade", event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  >
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
          <option value="C">Grade C</option>
        </select>
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        <span>Echelon</span>
        <input
    type="number"
    min={1}
    max={4}
    value={values.echelon}
    onChange={(event) => update("echelon", Number(event.target.value))}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
      </label>

      {withPassword && <>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Mot de passe</span>
            <input
    type="password"
    value={values.password ?? ""}
    onChange={(event) => update("password", event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Confirmation</span>
            <input
    type="password"
    value={values.password_confirmation ?? ""}
    onChange={(event) => update("password_confirmation", event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
          </label>
        </>}

      <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
        <span>Adresse</span>
        <textarea
    rows={3}
    value={values.address ?? ""}
    onChange={(event) => update("address", event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
  />
      </label>

      <div className="md:col-span-2">
        <button
    type="submit"
    disabled={busy}
    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
  >
          {busy ? "Enregistrement..." : submitLabel}
        </button>
      </div>
    </form>;
}
export {
  TeacherForm
};
