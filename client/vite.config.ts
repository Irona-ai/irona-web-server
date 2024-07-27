import { defineConfig, PluginOption } from 'vite'
import { writeFileSync, readFileSync } from 'fs'
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import HotBuild from './hot-build'
const backendBuildPath = path.resolve(__dirname, '../server/client-build')

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        HotBuild() as PluginOption,
        {
            name: 'copy-to-backend',
            apply: 'serve',
            handleHotUpdate({ file, server }) {
                if (
                    file.endsWith('.tsx') ||
                    file.endsWith('.ts') ||
                    file.endsWith('.js') ||
                    file.endsWith('.jsx') ||
                    file.endsWith('.css')
                ) {
                    // Write the updated files to the backend public directory
                    const relativePath = path.relative(server.config.root, file)
                    const destinationPath = path.join(
                        backendBuildPath,
                        relativePath
                    )
                    console.log('hot update', relativePath, destinationPath)
                    writeFileSync(destinationPath, readFileSync(file))
                }
            },
        },
    ],
    build: {
        outDir: backendBuildPath,
        emptyOutDir: true,
    },
})
