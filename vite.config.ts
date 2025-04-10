import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	base: '/facetherapie-user-liff/', // ← GitHubリポジトリ名に合わせて変更
	plugins: [tailwindcss(), sveltekit()]
});
