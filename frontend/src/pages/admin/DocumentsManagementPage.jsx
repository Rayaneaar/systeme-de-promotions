import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { documentApi } from "@/api/documentApi";
import { useAuthStore } from "@/store/authStore";
import { createProtectedObjectUrl, downloadProtectedFile, extractErrorMessage, formatBytes, formatDateTime } from "@/lib/utils";

function DocumentsManagementPage() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const [category, setCategory] = useState("all");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const { data } = useQuery({
    queryKey: ["documents", "admin", category],
    queryFn: () => documentApi.getAllDocuments({
      per_page: 50,
      category: category === "all" ? void 0 : category
    })
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const renameMutation = useMutation({
    mutationFn: ({ id, display_name }) => documentApi.renameDocument(id, display_name),
    onSuccess: () => {
      toast.success("Document renomme.");
      queryClient.invalidateQueries({ queryKey: ["documents", "admin"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => documentApi.deleteDocument(id),
    onSuccess: () => {
      toast.success("Document supprime.");
      setSelectedDocument(null);
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
      queryClient.invalidateQueries({ queryKey: ["documents", "admin"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });

  async function previewDocument(document) {
    if (!token) return;
    try {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
      const objectUrl = await createProtectedObjectUrl(document.preview_url, token);
      setPreviewUrl(objectUrl);
      setSelectedDocument(document);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  const documents = data?.data ?? [];
  return <div className="space-y-6">
      <section className="soft-panel rounded-[34px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="page-eyebrow">Document Center</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Centre documentaire
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Visualisez les pieces sans telechargement, filtrez par categorie et gerez les
              documents de maniere plus claire sur tous les ecrans.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-2 rounded-[22px] bg-white/80 p-1 sm:w-auto">
            {[
          ["all", "Tous"],
          ["administratif", "Administratif"],
          ["pedagogique", "Pedagogique"]
        ].map(([value, label]) => <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`rounded-[18px] px-4 py-2 text-sm font-semibold transition ${category === value ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {label}
            </button>)}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.04fr_0.96fr]">
        <article className="soft-panel rounded-[34px] px-4 py-4 sm:px-5 sm:py-5">
          <div className="space-y-4">
            {documents.map((document) => <article key={document.id} className="soft-card rounded-[28px] px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex flex-col gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="status-pill bg-slate-900 text-white">{document.category_label}</span>
                      <span className="status-pill bg-slate-100 text-slate-600">
                        {document.professeur?.full_name}
                      </span>
                    </div>
                    <p className="mt-3 break-words text-sm font-bold text-slate-950 sm:text-base">
                      {document.display_name || document.original_name}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {formatBytes(document.file_size)} • {formatDateTime(document.created_at)}
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <button
    type="button"
    onClick={() => previewDocument(document)}
    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
  >
                      <Eye className="h-4 w-4" />
                      Voir
                    </button>
                    <button
    type="button"
    onClick={() => {
      if (!token) return;
      downloadProtectedFile(document.download_url, token, document.display_name || document.original_name).catch((error) => toast.error(extractErrorMessage(error)));
    }}
    className="rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
  >
                      Telecharger
                    </button>
                    <button
    type="button"
    onClick={() => {
      const nextName = window.prompt("Nouveau nom d'affichage", document.display_name || document.original_name);
      if (nextName) renameMutation.mutate({ id: document.id, display_name: nextName });
    }}
    className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
  >
                      Renommer
                    </button>
                    <button
    type="button"
    onClick={() => {
      if (window.confirm("Supprimer ce document ?")) deleteMutation.mutate(document.id);
    }}
    className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
  >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>)}

            {!documents.length && <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center">
                <p className="text-sm font-semibold text-slate-900">Aucun document pour ce filtre.</p>
              </div>}
          </div>
        </article>

        <article className="soft-panel rounded-[34px] px-5 py-5 sm:px-6 sm:py-6">
          <h2 className="text-2xl font-bold text-slate-950">Apercu rapide</h2>
          {!selectedDocument && <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-white/70 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FileText className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Selectionnez un document</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                L'apercu s'affichera ici pour eviter les telechargements systematiques.
              </p>
            </div>}

          {selectedDocument && previewUrl && <div className="mt-5 space-y-4">
              <div className="soft-card rounded-[24px] px-4 py-4">
                <p className="break-words text-sm font-bold text-slate-950">{selectedDocument.display_name || selectedDocument.original_name}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {selectedDocument.professeur?.full_name} • {selectedDocument.category_label}
                </p>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                <iframe title="Apercu document" src={previewUrl} className="h-[420px] w-full sm:h-[520px] 2xl:h-[640px]" />
              </div>
            </div>}
        </article>
      </section>
    </div>;
}

export {
  DocumentsManagementPage as default
};
