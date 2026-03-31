import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { documentApi } from "@/api/documentApi";
import { useAuthStore } from "@/store/authStore";
import { downloadProtectedFile, extractErrorMessage, formatBytes, formatDateTime } from "@/lib/utils";
function MyDocumentsPage() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const { data } = useQuery({
    queryKey: ["documents", "me"],
    queryFn: () => documentApi.getMyDocuments()
  });
  const [file, setFile] = useState(null);
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Veuillez selectionner un fichier.");
      const formData = new FormData();
      formData.append("file", file);
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
  return <section className="glass-panel rounded-[28px] border border-white/60 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-950">Mes documents</h3>
          <p className="text-sm text-slate-600">Deposez et gerez vos pieces justificatives.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          <button
    type="button"
    onClick={() => uploadMutation.mutate()}
    className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
  >
            Televerser
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {(data?.data ?? []).map((document) => <article key={document.id} className="rounded-[24px] bg-white/80 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{document.display_name || document.original_name}</p>
                <p className="text-sm text-slate-600">
                  {formatBytes(document.file_size)} • {formatDateTime(document.created_at)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
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
    className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
  >
                  Renommer
                </button>
                <button
    type="button"
    onClick={() => {
      if (window.confirm("Supprimer ce document ?")) deleteMutation.mutate(document.id);
    }}
    className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
  >
                  Supprimer
                </button>
              </div>
            </div>
          </article>)}
      </div>
    </section>;
}
export {
  MyDocumentsPage as default
};
