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

    // ──────────────────────────
    // 設定値
    // ──────────────────────────
    const liffId   = '2007233135-vxLAjokB';      // ご自身の LIFF ID
    const apiBase  = 'https://d1wuhnzyl0w5u5.cloudfront.net/api/v1';

    // ──────────────────────────
    // 画面用変数
    // ──────────────────────────
    let userId   = '';
    let shopCode = '';
    let countdown = 15;
    let timer: number | null = null;

    // ──────────────────────────
    // URL クエリ取得ユーティリティ
    // ──────────────────────────
    function getQueryParam(key: string): string | null {
        return new URLSearchParams(window.location.search).get(key);
    }

    // ──────────────────────────
    // LIFF 初期化
    // ──────────────────────────
    onMount(async () => {
        // 初回アクセス時に shopCode を取得
        shopCode = getQueryParam('shopCode') ?? '2139';

        // LIFF 初期化
        await liff.init({ liffId, withLoginOnExternalBrowser: true });

        // 未ログインなら、shopCode を保持したまま LINE ログインに遷移
        if (!liff.isLoggedIn()) {
            const redirectUri =
                `${location.origin}${location.pathname}?shopCode=${encodeURIComponent(shopCode)}`;
            liff.login({ redirectUri });
            return;
        }

        // ログイン済み：ユーザー ID を取得
        const ctx = liff.getContext();
        if (ctx?.userId) {
            userId = ctx.userId;

            // バックエンドに紐付け API をコール
            try {
                await fetch(
                    `${apiBase}/shop/link-customer?userId=${userId}&shopCode=${shopCode}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: '{}'
                    }
                );
            } catch (e) {
                console.error('link-customer API error', e);
            }
        }

        // カウントダウン開始
        timer = window.setInterval(() => {
            countdown -= 1;
            if (countdown <= 0) {
                clearInterval(timer!);
                closeThisWindow();
            }
        }, 1000);
    });

    onDestroy(() => {
        if (timer) clearInterval(timer);
    });

    // ──────────────────────────
    // 画面を閉じるユーティリティ
    // ──────────────────────────
    function closeThisWindow() {
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
</script>

<style>
    main {
        padding: 2rem;
        text-align: center;
        font-family: sans-serif;
    }
</style>
