const CACHE_NAME = "changeworker-static-v2"
const ASSETS = ["/", "/manifest.webmanifest", "/logo.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await Promise.all(
        ASSETS.map(async (asset) => {
          try {
            const response = await fetch(asset, { cache: "no-cache" })
            if (response.ok) {
              await cache.put(asset, response.clone())
            }
          } catch {
            // ignore individual asset failures during install
          }
        })
      )
      await self.skipWaiting()
    })()
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key)
            }
            return Promise.resolve()
          })
        )
      )
      .then(() => self.clients.claim())
  )
})
