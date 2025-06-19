"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface IconButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  badgeCount?: number
  href?: string
}

export function IconButton({ icon, label, onClick, badgeCount = 0, href }: IconButtonProps) {
  const ButtonComponent = (
    <Button variant="ghost" size="sm" className="relative" onClick={onClick}>
      {icon}
      {badgeCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-indigo-600">
          {badgeCount}
        </Badge>
      )}
      <span className="sr-only">{label}</span>
    </Button>
  )

  if (href) {
    return <Link href={href}>{ButtonComponent}</Link>
  }

  return ButtonComponent
}
