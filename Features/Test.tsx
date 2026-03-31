/* Retrain component (JSX) + server proxy

This document contains a plain **JSX** (JavaScript) client component you can drop into your Next.js project and a server-side API proxy for the App Router. The client component expects the page server component (your `page.tsx`) to optionally pass the initial data as `data` prop. The component handles responsive pagination, selection/deselection, and sending selected IDs to the backend.

---

## File: `components/Features/Retrain.jsx`

```jsx
'use client'

import React, { useEffect, useState } from 'react'

/**
 * Retrain component (JSX)
 * Props:
 * - data: optional initial array of voyage objects (from your server component)
 * - initialPage: optional starting page number
 * - initialTotal: optional total count from server
 * - apiEndpoint: optional internal API endpoint (defaults to '/api/retrain')
 *
export default function Retrain({ data: serverData = null, initialPage = 1, initialTotal = 0, apiEndpoint = '/api/retrain' }) {
  const [data, setData] = useState(Array.isArray(serverData) ? serverData : [])
  const [page, setPage] = useState(initialPage)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [total, setTotal] = useState(initialTotal)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  // determine itemsPerPage based on viewport width
  useEffect(() => {
    function calc() {
      const w = window.innerWidth
      if (w >= 1024) setItemsPerPage(8) // laptop/desktop
      else if (w >= 768) setItemsPerPage(6) // tablet
      else setItemsPerPage(1) // mobile
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  // fetch page whenever page or itemsPerPage changes
  useEffect(() => {
    // If server provided initial data and we're on that initial page, use it (avoid refetch on first render)
    const usingServerData = Array.isArray(serverData) && page === initialPage && data.length > 0

    if (usingServerData) {
      // ensure total is known; if not, try fetching it
      if (!initialTotal) fetchPage(page, itemsPerPage)
      return
    }

    fetchPage(page, itemsPerPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, itemsPerPage])

  async function fetchPage(p, limit) {
    try {
      setLoading(true)
      const res = await fetch(`${apiEndpoint}?page=${p}&limit=${limit}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch page')
      const json = await res.json()
      // expected payload: { data: [...], total: number }
      setData(Array.isArray(json.data) ? json.data : [])
      setTotal(typeof json.total === 'number' ? json.total : (json.totalCount ?? (Array.isArray(json.data) ? json.data.length : 0)))
    } catch (err) {
      console.error('fetchPage error', err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  function toggleSelect(id) {
    setSelectedIds(prev => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })
  }

  function isSelected(id) {
    return selectedIds.has(id)
  }

  function selectAllOnPage() {
    setSelectedIds(prev => {
      const s = new Set(prev)
      data.forEach(d => d?._id && s.add(d._id))
      return s
    })
  }

  function deselectAllOnPage() {
    setSelectedIds(prev => {
      const s = new Set(prev)
      data.forEach(d => d?._id && s.delete(d._id))
      return s
    })
  }

  async function handleRetrain() {
    if (selectedIds.size === 0) return
    setSending(true)
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      })
      if (!res.ok) throw new Error('Failed to send retrain request')
      const json = await res.json()
      // handle response (you can replace alert with a nicer UI toast)
      alert(json.message ?? 'Retrain request sent')
    } catch (err) {
      console.error('retrain error', err)
      alert('Error sending retrain request')
    } finally {
      setSending(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil((total || 1) / itemsPerPage))

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={selectAllOnPage} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">Select page</button>
          <button onClick={deselectAllOnPage} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">Deselect page</button>
          <div className="text-sm text-gray-600">Selected: <span className="font-medium">{selectedIds.size}</span></div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3 text-sm">{page} / {totalPages}</div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded">Next</button>

          <button onClick={handleRetrain} disabled={selectedIds.size === 0 || sending} className="ml-3 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            {sending ? 'Sending...' : 'Retrain Selected'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map(item => (
            <article key={item._id} onClick={() => toggleSelect(item._id)} className={`p-4 border rounded-lg cursor-pointer transition-shadow bg-white ${isSelected(item._id) ? 'ring-2 ring-blue-400 shadow-md border-blue-300' : 'hover:shadow-sm'}`}>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm truncate">{item.origin ?? '—'} → {item.destination ?? '—'}</h3>
                <input
                  aria-label={`Select ${item._id}`}
                  type="checkbox"
                  checked={isSelected(item._id)}
                  onChange={(e) => { e.stopPropagation(); toggleSelect(item._id) }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4"
                />
              </div>

              <div className="mt-2 text-xs text-gray-700 grid grid-cols-2 gap-2">
                <div><span className="font-medium">Cargo:</span> {item.cargo ?? '—'}</div>
                <div><span className="font-medium">Speed:</span> {item.speed !== undefined ? Number(item.speed).toFixed(2) : '—'}</div>
                <div><span className="font-medium">Weather:</span> {item.weather ?? '—'}</div>
                <div><span className="font-medium">Traffic:</span> {item.Traffic ?? item.traffic ?? '—'}</div>
              </div>

              <div className="mt-2 text-xs text-gray-600">
                <span className="font-medium">ReqPath:</span>
                <div className="truncate">
                  {Array.isArray(item.reqPath) ? item.reqPath.join(' → ') : '—'}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Pred ETA</div>
                  <div className="font-medium">{item.predictedETA !== undefined ? Number(item.predictedETA).toFixed(2) : '—'}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">FB ETA</div>
                  <div className="font-medium">{item.feedBackETA ?? '—'}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Pred Fuel</div>
                  <div className="font-medium">{item.predictedFuel !== undefined ? Number(item.predictedFuel).toFixed(2) : '—'}</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">FB Fuel</div>
                  <div className="font-medium">{item.feedBackFuel ?? '—'}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pager controls *
      <div className="mt-6 flex justify-center items-center gap-2">
        <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 border rounded">First</button>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border rounded">Prev</button>
        <div className="px-3">{page}</div>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded">Next</button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 border rounded">Last</button>
      </div>
    </div>
  )
}
```

---

## File: `app/api/retrain/route.ts`
(Next.js App Router server route — proxies to your backend, forwarding cookies)

```ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const pageStr = url.searchParams.get('page') ?? '1'
    const limitStr = url.searchParams.get('limit') ?? '8'
    const page = Number(pageStr)
    const limit = Number(limitStr)
    const skip = (page - 1) * limit

    const cookie = req.headers.get('cookie') ?? ''
    const backendUrl = `http://localhost:8000/voyage/allData?skip=${skip}&limit=${limit}`

    const backendRes = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {})
      },
      cache: 'no-store'
    })

    if (!backendRes.ok) {
      const txt = await backendRes.text()
      return new NextResponse(txt, { status: backendRes.status })
    }

    const json = await backendRes.json()
    const payload = {
      data: json.message ?? json.data ?? json.items ?? [],
      total: json.total ?? json.totalCount ?? json.count ?? (Array.isArray(json.message) ? json.message.length : 0)
    }

    return NextResponse.json(payload)
  } catch (err) {
    console.error('api/retrain GET error', err)
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ids = body.ids
    if (!Array.isArray(ids)) {
      return new NextResponse(JSON.stringify({ error: 'ids must be an array' }), { status: 400 })
    }

    const cookie = req.headers.get('cookie') ?? ''
    const backendRes = await fetch('http://localhost:8000/voyage/retrain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {})
      },
      body: JSON.stringify({ ids })
    })

    const json = await backendRes.json()
    return NextResponse.json(json)
  } catch (err) {
    console.error('api/retrain POST error', err)
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
```

---

## Integration notes (short)

- **Where to place files**: Put `Retrain.jsx` in `components/Features/` (or where your imports expect it). Put `route.ts` in `app/api/retrain/route.ts` (App Router). If you are using Pages Router, create `pages/api/retrain.ts` with equivalent logic.

- **Using from your server page**: No change required to your `page.tsx` — you can keep your server-side fetch and pass `newResult` to the component as `<Retrain data={newResult} />`. The client component will use that initial data for the first paint and then fetch pages as the user paginates.

- **Backend expectations**: The proxy assumes your backend supports `skip` and `limit` query params (used to implement pagination). It also expects the backend to return an array (field `message` or `data`) and ideally a `total` or `totalCount` value. If your backend uses other field names, tweak `route.ts` mapping accordingly.

- **Selection behavior**: The component stores selected IDs in a Set. When you click "Retrain Selected" it sends `{ ids: [ ... ] }` to the proxy which forwards to your backend endpoint `/voyage/retrain`.

- **Responsive page sizes**: Items-per-page are decided by viewport width in the client: desktop 8, tablet 6, mobile 1. The layout grid uses Tailwind responsive columns so cards look good across breakpoints.

---

If you want, I can now:
- Convert this component to TypeScript (`Retrain.tsx`) and add type interfaces.
- Provide a `pages/api/retrain.ts` variant if you're using the Pages Router.
- Add a small confirmation modal or a toast instead of `alert()`.

Tell me which of the above you'd like and I'll add it to this document.*/
