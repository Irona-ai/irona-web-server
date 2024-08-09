import { defineConfig, PluginOption, loadEnv } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import HotBuild from './hot-build'
const backendBuildPath = path.resolve(__dirname, '../server/client-build')

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '')
    return {
        define: { __APP_ENV__: JSON.stringify(env.APP_ENV) },
        plugins: [react(), HotBuild() as PluginOption],
        build: { outDir: backendBuildPath, emptyOutDir: true },
    }
})

// TODO: https://vitejs.dev/guide/build#rebuild-on-files-changes
