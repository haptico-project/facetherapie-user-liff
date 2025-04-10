<h1>ファセテラピー友達追加</h1>
{#if userId}
    <main>
        <h1>友達追加が完了した後、この画面は閉じてください。</h1>
        <!--        <p><strong>ユーザーID:</strong> {userId}</p>-->
        <p><strong>店舗コード:</strong> {shopCode}</p>
    </main>
{/if}

<script lang="ts">
    import {onMount} from 'svelte';

    const liffId = '2007233135-vxLAjokB';
    let userId = '';
    let shopCode = '';

    function getQueryParam(key: string): string | null {
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    }

    onMount(async () => {

        shopCode = getQueryParam('shopCode') ?? 'no-shop-code';

        try {
            await liff.init({liffId: liffId, withLoginOnExternalBrowser: true});

            if (!liff.isLoggedIn()) {
                liff.login();
                return;
            }

            const context = liff.getContext();
            console.log(context)
            if (context && context.userId) {
                userId = context.userId;

                await fetch(`https://d1wuhnzyl0w5u5.cloudfront.net/api/v1/shop/link-customer?userId=${userId}&shopCode=${shopCode}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({})
                });
            } else {
                console.warn('userId not available in context');
            }
        } catch (err) {
            console.error('LIFF init failed', err);
        }
    });

</script>

<style>
    main {
        padding: 2rem;
        text-align: center;
        font-family: sans-serif;
    }
</style>
