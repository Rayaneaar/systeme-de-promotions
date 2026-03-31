import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { documentApi } from "@/api/documentApi";
import { extractErrorMessage, formatBytes, formatDateTime } from "@/lib/utils";
function DocumentsManagementPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["documents", "admin"],
    queryFn: () => documentApi.getAllDocuments({ per_page: 50 })
  });
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
      queryClient.invalidateQueries({ queryKey: ["documents", "admin"] });
    },
    onError: (error) => toast.error(extractErrorMessage(error))
  });
  return <section className="glass-panel rounded-[28px] border border-white/60 p-6">
      <h3 className="text-xl font-bold text-slate-950">Documents</h3>
      <div className="mt-6 space-y-4">
        {(data?.data ?? []).map((document) => <article key={document.id} className="rounded-[24px] bg-white/80 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{document.display_name || document.original_name}</p>
                <p className="text-sm text-slate-600">
                  {document.professeur?.full_name} • {formatBytes(document.file_size)}
                </p>
                <p className="text-xs text-slate-500">{formatDateTime(document.created_at)}</p>
              </div>
              <div className="flex gap-2">
                <button
    type="button"
    onClick={() => {
      const nextName = window.prompt("Nouveau nom d'affichage", document.display_name || document.original_name);
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
  DocumentsManagementPage as default
};
