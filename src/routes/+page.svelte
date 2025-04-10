<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<script lang="ts">
    import { onMount } from 'svelte';

    let userId = '';
    let ref = '';

    function getQueryParam(key: string): string | null {
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    }

    onMount(async () => {
        ref = getQueryParam('ref') ?? 'no-ref';

        try {
            await liff.init({ liffId: '2007233135-vxLAjokB', withLoginOnExternalBrowser: true });

            if (!liff.isLoggedIn()) {
                liff.login();
                return;
            }

            const context = liff.getContext();
            console.log(context)
            // if (context && context.userId) {
            //     userId = context.userId;
            //
            //     await fetch('https://your-api.com/link', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ userId, ref })
            //     });
            // } else {
            //     console.warn('userId not available in context');
            // }
        } catch (err) {
            console.error('LIFF init failed', err);
        }
    });

</script>

<main>
    <h1>LIFF + Svelte (TS)</h1>
    <p><strong>ユーザーID:</strong> {userId}</p>
    <p><strong>参照コード:</strong> {ref}</p>
</main>

<style>
    main {
        padding: 2rem;
        text-align: center;
        font-family: sans-serif;
    }
</style>
