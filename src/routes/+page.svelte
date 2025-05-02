<h1>ファセテラピー友達追加</h1>

{#if userId}
    <main>
        <h1>友達追加が完了した後、この画面は閉じてください。</h1>

        <p><strong>店舗コード:</strong> {shopCode}</p>

        <!-- ▼ 友だちになっていない場合だけボタンを表示 -->
        {#if !isFriend}
            <button class="add-btn" on:click={openAddFriend}>
                友だち追加はこちら
            </button>
        {/if}
        {#if isFriend}
            既に友達追加が完了しております。
            <p style="margin-top:2rem;">
                このページは <span style="font-weight:bold;">{countdown}</span> 秒後に自動で閉じます
                （自動で閉じない場合、お手数ですがブラウザ、または、このタブの閉じるボタンを押下してください。）
            </p>
        {/if}


    </main>
{/if}

<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    //-------------------------------
    // 設定
    //-------------------------------
    const liffId   = '2007233135-vxLAjokB';
    const apiBase  = 'https://d1wuhnzyl0w5u5.cloudfront.net/api/v1';
    const oaLineId = '@336xcxbk';              // ← 公式アカウントの LINE ID (@含む)

    //-------------------------------
    // ステート
    //-------------------------------
    let userId   = '';
    let shopCode = '';
    let isFriend = true;     // 初期値：仮に友だち状態とする
    let countdown = 15;
    let timer: number | null = null;

    //-------------------------------
    // Util
    //-------------------------------
    function getQueryParam(key: string): string | null {
        return new URLSearchParams(window.location.search).get(key);
    }

    function openAddFriend() {
        const addFriendUrl = `https://line.me/R/ti/p/${encodeURIComponent(oaLineId)}`;
        liff.openWindow({ url: addFriendUrl, external: true });
    }

    //-------------------------------
    // LIFF 初期化 & 処理
    //-------------------------------
    onMount(async () => {
        shopCode = getQueryParam('shopCode') ?? '2139';

        await liff.init({ liffId, withLoginOnExternalBrowser: true });

        if (!liff.isLoggedIn()) {
            const redirectUri =
                `${location.origin}${location.pathname}?shopCode=${encodeURIComponent(shopCode)}`;
            liff.login({ redirectUri });
            return;
        }

        // ユーザー情報
        const ctx = liff.getContext();
        if (ctx?.userId) {
            userId = ctx.userId;

            // 友だち状態をチェック
            try {
                const friendRes = await liff.getFriendship();
                isFriend = friendRes?.friendFlag ?? false;
            } catch {
                isFriend = false;
            }

            // バックエンド連携
            try {
                await fetch(
                    `${apiBase}/shop/link-customer?userId=${userId}&shopCode=${shopCode}`,
                    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }
                );
            } catch (e) {
                console.error('link-customer API error', e);
            }
        }

        // カウントダウン
        if (isFriend) {
            timer = window.setInterval(() => {
                countdown -= 1;
                if (countdown <= 0) {
                    clearInterval(timer!);
                    closeThisWindow();
                }
            }, 1000);
        }
    });

    onDestroy(() => {
        if (timer) clearInterval(timer);
    });

    function closeThisWindow() {
        try {
            if (liff.isInClient()) {
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
    .add-btn {
        margin-top: 1.5rem;
        padding: 0.8rem 1.6rem;
        font-size: 1rem;
        color: #ffffff;
        background-color: #06c755; /* LINE グリーン */
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .add-btn:hover {
        opacity: 0.85;
    }
</style>
