import { defineConfig, PluginOption } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import HotBuild from './hot-build'
const backendBuildPath = path.resolve(__dirname, '../server/client-build')

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), HotBuild() as PluginOption],
    build: {
        outDir: backendBuildPath,
        emptyOutDir: true,
    },
})
