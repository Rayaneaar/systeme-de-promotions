import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, FileText, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { documentApi } from "@/api/documentApi";
import { useAuthStore } from "@/store/authStore";
import { createProtectedObjectUrl, downloadProtectedFile, extractErrorMessage, formatBytes, formatDateTime } from "@/lib/utils";
const categories = [{
  key: "administratif",
  label: "Documents administratifs",
  description: "Arretes, attestations, pieces RH et documents institutionnels."
}, {
  key: "pedagogique",
  label: "Documents pedagogiques",
  description: "CV academique, rapports, activites d'enseignement et dossiers scientifiques."
}];
function MyDocumentsPage() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const { data } = useQuery({
    queryKey: ["documents", "me"],
    queryFn: () => documentApi.getMyDocuments()
  });
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("administratif");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  useEffect(() => {
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Veuillez selectionner un fichier.");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      return documentApi.uploadMyDocument(formData);
    },
    onSuccess: () => {
      toast.success("Document televerse.");
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["documents", "me"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });
  const renameMutation = useMutation({
    mutationFn: ({ id, display_name }) => documentApi.renameDocument(id, display_name),
    onSuccess: () => {
      toast.success("Document renomme.");
      queryClient.invalidateQueries({ queryKey: ["documents", "me"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => documentApi.deleteDocument(id),
    onSuccess: () => {
      toast.success("Document supprime.");
      queryClient.invalidateQueries({ queryKey: ["documents", "me"] });
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
  const groupedDocuments = useMemo(() => {
    const items = data?.data ?? [];
    return categories.map((item) => ({
      ...item,
      documents: items.filter((document) => document.category === item.key)
    }));
  }, [data]);
  return <div className="space-y-6">
      <section className="glass-panel rounded-[32px] border border-white/60 p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)]">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Mes documents</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Les pieces du dossier sont desormais organisees en deux familles: administratif et
              pedagogique.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_25px_50px_-40px_rgba(15,23,42,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nouveau depot</p>
            <div className="mt-4 space-y-3">
              <select
    value={category}
    onChange={(event) => setCategory(event.target.value)}
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
  >
                {categories.map((item) => <option key={item.key} value={item.key}>
                    {item.label}
                  </option>)}
              </select>
              <input
    type="file"
    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
    className="w-full text-sm text-slate-600 file:mr-4 file:rounded-2xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
  />
              <button
    type="button"
    onClick={() => uploadMutation.mutate()}
    disabled={uploadMutation.isPending}
    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
  >
                <UploadCloud className="h-4 w-4" />
                {uploadMutation.isPending ? "Televersement..." : "Televerser"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {selectedDocument && previewUrl && <section className="glass-panel rounded-[28px] border border-white/60 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Apercu du document</h2>
              <p className="mt-1 text-sm text-slate-600">{selectedDocument.display_name || selectedDocument.original_name}</p>
            </div>
            <button
    type="button"
    onClick={() => {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setSelectedDocument(null);
    }}
    className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
  >
              Fermer
            </button>
          </div>
          <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <iframe title="Apercu du document" src={previewUrl} className="h-[620px] w-full" />
          </div>
        </section>}

      <section className="space-y-6">
        {groupedDocuments.map((group) => <article key={group.key} className="glass-panel rounded-[28px] border border-white/60 p-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">{group.label}</h2>
                <p className="mt-1 text-sm text-slate-600">{group.description}</p>
              </div>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                {group.documents.length} document{group.documents.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {group.documents.map((document) => <article key={document.id} className="rounded-[24px] bg-white/85 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{document.display_name || document.original_name}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatBytes(document.file_size)} • {formatDateTime(document.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
    type="button"
    onClick={() => previewDocument(document)}
    className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
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
    className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
  >
                        Telecharger
                      </button>
                      <button
    type="button"
    onClick={() => {
      const nextName = window.prompt("Nouveau nom", document.display_name || document.original_name);
      if (nextName) renameMutation.mutate({ id: document.id, display_name: nextName });
    }}
    className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
  >
                        Renommer
                      </button>
                      <button
    type="button"
    onClick={() => {
      if (window.confirm("Supprimer ce document ?")) deleteMutation.mutate(document.id);
    }}
    className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
  >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </article>)}

              {!group.documents.length && <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">Aucun document dans cette categorie.</p>
                </div>}
            </div>
          </article>)}
      </section>
    </div>;
}
export {
  MyDocumentsPage as default
};
