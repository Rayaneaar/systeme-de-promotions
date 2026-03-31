import { useAuthStore } from "@/store/authStore";
function useAuth() {
  return useAuthStore();
}
export {
  useAuth
};
