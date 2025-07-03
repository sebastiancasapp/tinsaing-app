import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  // Se habilita para poder trabajar con ngrok
  server: {
		allowedHosts: true
	},
  plugins: [react(), tailwindcss(),],
})
