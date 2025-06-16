"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Shield, RefreshCw } from "lucide-react"

export function SessionDebug() {
  const { data: session, status, update } = useSession()

  if (status === "loading") {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading session...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSessionExpiry = () => {
    if (session?.expires) {
      const expiryDate = new Date(session.expires)
      const now = new Date()
      const timeLeft = expiryDate.getTime() - now.getTime()
      const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      return {
        expiryDate: expiryDate.toLocaleString(),
        timeLeft: `${daysLeft} days, ${hoursLeft} hours`,
        isExpired: timeLeft <= 0,
      }
    }
    return null
  }

  const sessionInfo = getSessionExpiry()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Session Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={status === "authenticated" ? "default" : "secondary"}>{status}</Badge>
        </div>

        {session && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User:</span>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{session.user?.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Role:</span>
              <Badge variant="outline">{session.user?.role || "user"}</Badge>
            </div>

            {sessionInfo && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Expires:</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">{sessionInfo.expiryDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Time Left:</span>
                  <Badge variant={sessionInfo.isExpired ? "destructive" : "default"}>{sessionInfo.timeLeft}</Badge>
                </div>
              </>
            )}

            <Button onClick={() => update()} variant="outline" size="sm" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Session
            </Button>
          </>
        )}

        {!session && <div className="text-center text-sm text-gray-500">No active session found</div>}
      </CardContent>
    </Card>
  )
}
