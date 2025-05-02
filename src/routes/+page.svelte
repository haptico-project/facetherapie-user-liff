<h1>ファセテラピー友達追加</h1>
{#if userId}
    <main>
        <h1>友達追加が完了した後、この画面は閉じてください。</h1>
        <p><strong>店舗コード:</strong> {shopCode}</p>
        <p style="margin-top:2rem;">
            このページは <span style="font-weight:bold;">{countdown}</span> 秒後に自動で閉じます
        </p>
    </main>
{/if}

<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    const liffId = '2007233135-vxLAjokB';
    let userId = '';
    let shopCode = '';
    let countdown = 15;       // ← 15 秒カウントダウン
    let timer: number | null = null;

    function getQueryParam(key: string): string | null {
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    }

    onMount(async () => {
        shopCode = getQueryParam('shopCode') ?? 'no-shop-code';

        try {
            await liff.init({ liffId, withLoginOnExternalBrowser: true });

            if (!liff.isLoggedIn()) {
                liff.login();
                return;
            }

            const context = liff.getContext();
            if (context?.userId) {
                userId = context.userId;

                await fetch(
                    `https://d1wuhnzyl0w5u5.cloudfront.net/api/v1/shop/link-customer?userId=${userId}&shopCode=${shopCode}`,
                    { method: 'POST', headers: { 'Content-Type': 'application/json' } }
                );
            }
        } catch (err) {
            console.error('LIFF init failed', err);
        }

        // --- カウントダウン開始 ---
        timer = window.setInterval(() => {
            countdown -= 1;
            if (countdown <= 0) {
                clearInterval(timer!);
                // LIFF 内なら closeWindow、ブラウザなら window.close
                try {
                    if (typeof liff !== 'undefined' && liff.isInClient()) {
                        liff.closeWindow();
                    } else {
                        window.close();
                    }
                } catch {
                    window.close();
                }
            }
        }, 1000);
    });

    onDestroy(() => {
        if (timer) clearInterval(timer);
    });
</script>

<style>
    main {
        padding: 2rem;
        text-align: center;
        font-family: sans-serif;
    }
</style>
