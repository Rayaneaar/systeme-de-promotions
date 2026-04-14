import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, __dirname, "");
    const backendUrl = env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            port: 5173,
            proxy: {
                "/api": {
                    target: backendUrl,
                    changeOrigin: true,
                },
            },
        },
    };
});
