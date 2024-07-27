/**
 * Custom Hot Reloading Plugin
 * Start `vite build` on Hot Module Reload
 */
import path from 'path'
import { build } from 'vite'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export default function HotBuild() {
    let bundling = false
    const hmrBuild = async () => {
        bundling = true
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)
        await build({
            build: {
                outDir: path.resolve(__dirname, '../server/client-build'),
            },
        }) // <--- you can give a custom config here or remove it to use default options
    }

    return {
        name: 'hot-build',
        enforce: 'pre',
        // HMR
        handleHotUpdate() {
            if (!bundling) {
                console.log(`hot vite build starting...`)
                hmrBuild().then(() => {
                    bundling = false
                    console.log(`hot vite build finished`)
                })
            }
            return []
        },
    }
}
