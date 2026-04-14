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

const sectionBaseFields = [
  {
    title: "Identite",
    columns: "md:grid-cols-2 xl:grid-cols-4",
    fields: [
      ["num_dr", "Numero DR"],
      ["first_name", "Prenom"],
      ["last_name", "Nom"],
      ["email", "Email"],
      ["cin", "CIN"],
      ["ppr", "PPR"],
      ["date_of_birth", "Date de naissance"],
      ["phone", "Telephone"]
    ]
  },
  {
    title: "Carriere",
    columns: "md:grid-cols-2 xl:grid-cols-4",
    fields: [
      ["specialite", "Specialite"],
      ["date_recrutement", "Date de recrutement"],
      ["date_last_promotion", "Derniere promotion"],
      ["date_last_grade_promotion", "Derniere promotion de grade"],
      ["date_last_echelon_promotion", "Derniere promotion d'echelon"]
    ]
  }
];

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

  const sections = [
    ...sectionBaseFields,
    ...(withPassword ? [{
      title: "Acces",
      columns: "md:grid-cols-2",
      fields: [
        ["password", "Mot de passe"],
        ["password_confirmation", "Confirmation"]
      ]
    }] : [])
  ];

  return <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
      }}
    >
      {sections.map((section) => <section key={section.title} className="soft-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="page-eyebrow">{section.title}</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">{section.title}</h3>
            </div>
          </div>

          <div className={`mt-5 grid gap-4 ${section.columns}`}>
            {section.fields.map(([key, label]) => <label key={key} className="space-y-2 text-sm font-medium text-slate-700">
                <span>{label}</span>
                <input
                  type={key.includes("date") ? "date" : key.includes("password") ? "password" : "text"}
                  value={String(values[key] ?? "")}
                  onChange={(event) => update(key, event.target.value)}
                  className="w-full rounded-[20px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-sky-50/40"
                />
              </label>)}

            {section.title === "Carriere" && <>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Grade</span>
                  <select
                    value={values.grade}
                    onChange={(event) => update("grade", event.target.value)}
                    className="w-full rounded-[20px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-sky-50/40"
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
                    className="w-full rounded-[20px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-sky-50/40"
                  />
                </label>
              </>}
          </div>
        </section>)}

      <section className="soft-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <p className="page-eyebrow">Coordonnees</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">Adresse</h3>
        <label className="mt-5 block space-y-2 text-sm font-medium text-slate-700">
          <span>Adresse complete</span>
          <textarea
            rows={4}
            value={values.address ?? ""}
            onChange={(event) => update("address", event.target.value)}
            className="w-full rounded-[20px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-sky-50/40"
          />
        </label>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-w-[260px] items-center justify-center rounded-[22px] bg-slate-950 px-6 py-4 text-base font-bold text-white shadow-[0_28px_54px_-30px_rgba(15,23,42,0.52)] transition hover:bg-slate-800 disabled:opacity-60"
        >
          {busy ? "Enregistrement..." : submitLabel}
        </button>
      </div>
    </form>;
}

export {
  TeacherForm
};
