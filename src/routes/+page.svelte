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
            await liff.init({ liffId: '2007233135-vxLAjokB' });

            if (!liff.isLoggedIn()) {
                liff.login();
                return; // ← ここで止めるのが大事
            }

            const idToken = liff.getDecodedIDToken();
            if (idToken && idToken.sub) {
                userId = idToken.sub;

                // const response = await fetch('https://your-api.com/link', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ userId, ref })
                // });

                // if (!response.ok) {
                //     console.error('API error:', await response.text());
                // }
            } else {
                console.warn('idToken is missing or invalid');
            }
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
