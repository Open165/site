import { NextResponse, type NextRequest } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

function callReconApi(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    /**
     * The worker must run in remote mode for browser rendering to work correctly.
     * However, the page in local mode cannot access service bindings running in remote mode.
     * We just assume the service is running locally and use the HTTP local endpoint.
     *
     * @ref Browser rendering local mode https://developers.cloudflare.com/browser-rendering/platform/wrangler/#bindings
     * @ref Local service binding and --remote https://github.com/cloudflare/workers-sdk/issues/5578
     * @ref https://github.com/cloudflare/workers-sdk/issues/1182
     */
    return fetch(`http://localhost:8787/${new URL(request.url).search}`);
  }

  return getRequestContext().env.WORKER.fetch(request.url);
}

export async function GET(request: NextRequest) {
  const resp = await callReconApi(request);

  return new NextResponse(resp.body, resp);
}
