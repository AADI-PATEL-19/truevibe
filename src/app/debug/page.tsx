import { SessionDebug } from "@/components/debug/session"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Debug</h1>
          <p className="text-gray-600">Check your current session status and cookie information</p>
        </div>
        <SessionDebug />
      </div>
    </div>
  )
}
