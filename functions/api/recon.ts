import type { PagesFunction } from '@cloudflare/workers-types';
import { Response } from '@cloudflare/workers-types';
import puppeteer from '@cloudflare/puppeteer';

export const onRequest: PagesFunction<CloudflareEnv> = async ({
  env,
  request,
}) => {
  const { searchParams } = new URL(request.url);
  let url = searchParams.get('url');
  let img: Buffer;
  if (url) {
    url = new URL(url).toString(); // normalize

    // @ts-ignore - not sure why Cloudflare generated fetcher type is not compatible with puppeteer
    const browser = await puppeteer.launch(env.MYBROWSER);

    const page = await browser.newPage();
    await page.goto(url);
    img = (await page.screenshot()) as Buffer;
    return new Response(img, {
      headers: {
        'content-type': 'image/jpeg',
      },
    });
  } else {
    return new Response('Please add an ?url=https://example.com/ parameter');
  }
};
