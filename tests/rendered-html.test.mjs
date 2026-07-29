import assert from "node:assert/strict";
import test from "node:test";

async function request(path, accept = "application/json") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Nepali calendar product", async () => {
  const response = await request("/", "text/html");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ne">/i);
  assert.match(html, /न्युज बिहानी पात्रो/);
  assert.match(html, /मिति, बिदा र पर्व एकै ठाउँमा/);
  assert.match(html, /मिति रूपान्तरण/);
  assert.match(html, /बिदा तथा प्रमुख पर्व/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("calendar API returns the verified Shrawan 2083 boundaries", async () => {
  const response = await request("/api/calendar?year=2083&month=4");
  assert.equal(response.status, 200);
  const payload = await response.json();

  assert.equal(payload.calendar, "BS");
  assert.equal(payload.year, 2083);
  assert.equal(payload.month, 4);
  assert.equal(payload.daysInMonth, 31);
  assert.equal(payload.adRange.start, "2026-07-17");
  assert.equal(payload.adRange.end, "2026-08-16");
  assert.equal(payload.days.length, 31);
  assert.equal(payload.sources.length, 2);
});

test("conversion API translates both BS and AD anchor dates", async () => {
  const [bsResponse, adResponse] = await Promise.all([
    request("/api/convert?from=bs&date=2083-04-13"),
    request("/api/convert?from=ad&date=2026-07-29"),
  ]);
  assert.equal(bsResponse.status, 200);
  assert.equal(adResponse.status, 200);

  const [bsPayload, adPayload] = await Promise.all([
    bsResponse.json(),
    adResponse.json(),
  ]);
  assert.equal(bsPayload.resultIso, "2026-07-29");
  assert.deepEqual(adPayload.result, { year: 2083, month: 4, day: 13 });
});
