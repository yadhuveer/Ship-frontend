"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Voyage {
  _id: string
  origin: string
  destination: string
  cargo: number
  speed: number
  weather: string
  Traffic: string
  reqPath: string[]
  predictedETA: number
  feedBackETA: number
  predictedFuel: number
  feedBackFuel: number
}

export default function Retrain() {
  const [data, setData] = useState<Voyage[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  useEffect(() => {
    function updatePageSize() {
      if (window.innerWidth < 640) setPageSize(1)
      else if (window.innerWidth < 1024) setPageSize(6)
      else setPageSize(8)
    }
    updatePageSize()
    window.addEventListener("resize", updatePageSize)
    return () => window.removeEventListener("resize", updatePageSize)
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API}/voyage/allData?page=${page}&size=${pageSize}`, {
          credentials: "include",
        })

        if (!res.ok) {
        if (res.status == 401) {
          alert("Please Login With Admin Credential")
          router.push("/login")
        } else if (res.status == 404) {
          alert("User Not Found")
          router.push("/login")
        } else {
          router.push("/error")
        }
      } else {
        
        const json = await res.json()
        setData(json.message)
        setTotalPages(Math.ceil(json.total / pageSize))
        
      }


      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [page, pageSize])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleRetrain = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    try {
      const res = await fetch(`${apiUrl}/voyage/retrain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: selectedIds }),
      })
      if (!res.ok) {
        if (res.status == 401) {
          alert("Please Login With Admin Credential")
          router.push("/login")
        } else if (res.status == 404) {
          alert("User Not Found")
          router.push("/login")
        } else {
          router.push("/error")
        }
      } else {
        const json = await res.json()
        console.log(json)

        alert("ML Model has been Sucessfully Retrined")
        router.push("/")
      }
    } catch (err) {
      console.error(err)
      router.push("/error")
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          
          <h2 className="text-2xl font-semibold text-slate-200 mb-2">Select Training Data</h2>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Choose the voyage data you want to use for retraining the machine learning model. Selected data will improve
            prediction accuracy for future calculations.
          </p>
        </div>

        <div
          className={`grid gap-6 ${pageSize === 1 ? "grid-cols-1" : pageSize === 6 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"} `}
        >
          {data.map((v) => (
            <div
              key={v._id}
              className={`relative group bg-slate-800 border rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                selectedIds.includes(v._id)
                  ? "border-blue-400 bg-blue-900/30 shadow-blue-500/20"
                  : "border-slate-600 hover:border-slate-500"
              }`}
            >
              <div className="absolute top-4 right-4">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-400 text-blue-500 focus:ring-blue-500 focus:ring-2 bg-slate-700 border-2"
                  checked={selectedIds.includes(v._id)}
                  onChange={() => toggleSelect(v._id)}
                />
              </div>

              <div className="space-y-3 pr-8">
                
                <div className="border-b border-slate-600 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-white mb-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="text-slate-300">Origin:</span>
                    <span className="text-white">{v.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-white">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span className="text-slate-300">Destination:</span>
                    <span className="text-white">{v.destination}</span>
                  </div>
                </div>

                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Cargo:</span>
                    <span className="text-cyan-300 font-semibold">{v.cargo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Speed:</span>
                    <span className="text-cyan-300 font-semibold">{v.speed.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Weather:</span>
                    <span className="text-emerald-300 font-semibold capitalize">{v.weather}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Traffic:</span>
                    <span className="text-emerald-300 font-semibold capitalize">{v.Traffic}</span>
                  </div>
                </div>

                
                <div className="bg-slate-700/70 rounded-lg p-3 mt-4 min-h-70">
                  <span className="text-slate-300 font-medium text-sm block mb-1">Route Path:</span>
                  <span className="text-blue-300 text-sm font-mono leading-relaxed">{v.reqPath.join(" → ")}</span>
                </div>

                
                <div className="grid grid-cols-1 gap-3 mt-4">
                  <div className="bg-blue-900/40 rounded-lg p-3 border border-blue-800/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-blue-300 font-medium text-sm">Predicted ETA:</span>
                      <span className="text-blue-100 font-bold">{v.predictedETA.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-300 font-medium text-sm">Feedback ETA:</span>
                      <span className="text-blue-100 font-bold">
                        {v.feedBackETA !== null && v.feedBackETA !== undefined ? v.feedBackETA.toFixed(2) : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-800/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-purple-300 font-medium text-sm">Predicted Fuel:</span>
                      <span className="text-purple-100 font-bold">{v.predictedFuel.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300 font-medium text-sm">Feedback Fuel:</span>
                      <span className="text-purple-100 font-bold">
                        {v.feedBackFuel !== null && v.feedBackFuel !== undefined ? v.feedBackFuel.toFixed(2) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">Loading voyage data...</div>
            
          </div>
        )}

        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            className="px-6 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <div className="px-4 py-3 bg-slate-800 text-slate-200 rounded-lg border border-slate-600 font-mono">
            <span className="text-white font-bold">{page}</span> of{" "}
            <span className="text-white font-bold">{totalPages}</span>
          </div>
          <button
            className="px-6 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <div className="text-center">
            <button
              onClick={handleRetrain}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              disabled={selectedIds.length === 0}
            >
              Retrain Model ({selectedIds.length} selected)
            </button>
            <p className="text-slate-400 text-sm mt-2">
              {selectedIds.length === 0
                ? "Select at least one voyage to retrain the model"
                : `Ready to retrain with ${selectedIds.length} voyage${selectedIds.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
