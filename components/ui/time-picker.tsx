"use client"

import * as React from "react"
import { Plus, Minus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  disabled?: boolean
  className?: string
}

export function TimePicker({ value = "12:00 PM", onChange, disabled, className }: TimePickerProps) {
  const [time, setTime] = React.useState(value)

  React.useEffect(() => {
    setTime(value)
  }, [value])

  const parseTime = (timeStr: string) => {
    const [timePart, period] = timeStr.split(" ")
    const [hours, minutes] = timePart.split(":").map(Number)
    return { hours, minutes, period }
  }

  const formatTime = (hours: number, minutes: number, period: string) => {
    const formattedHours = hours.toString().padStart(2, "0")
    const formattedMinutes = minutes.toString().padStart(2, "0")
    return `${formattedHours}:${formattedMinutes} ${period}`
  }

  const updateTime = (newHours: number, newMinutes: number, newPeriod: string) => {
    const newTime = formatTime(newHours, newMinutes, newPeriod)
    setTime(newTime)
    onChange?.(newTime)
  }

  const adjustHours = (increment: boolean) => {
    const { hours, minutes, period } = parseTime(time)
    let newHours = increment ? hours + 1 : hours - 1

    if (newHours > 12) newHours = 1
    if (newHours < 1) newHours = 12

    updateTime(newHours, minutes, period)
  }

  const adjustMinutes = (increment: boolean) => {
    const { hours, minutes, period } = parseTime(time)
    let newMinutes = increment ? minutes + 15 : minutes - 15

    if (newMinutes >= 60) newMinutes = 0
    if (newMinutes < 0) newMinutes = 45

    updateTime(hours, newMinutes, period)
  }

  const togglePeriod = () => {
    const { hours, minutes, period } = parseTime(time)
    const newPeriod = period === "AM" ? "PM" : "AM"
    updateTime(hours, minutes, newPeriod)
  }

  const { hours, minutes, period } = parseTime(time)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-blue-400" />
        <h3 className="text-white font-medium">Choose Time</h3>
      </div>

      <div className="flex items-center justify-center gap-6 p-6 glass border border-white/20 rounded-lg">
        {/* Hours */}
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={() => adjustHours(true)}
            disabled={disabled}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-white hover:bg-white/10 border border-white/20 rounded-md"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="text-3xl font-bold text-white min-w-[4rem] text-center bg-white/5 rounded-lg py-2 px-3 border border-white/10">
            {hours.toString().padStart(2, "0")}
          </div>
          <Button
            onClick={() => adjustHours(false)}
            disabled={disabled}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-white hover:bg-white/10 border border-white/20 rounded-md"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Separator */}
        <div className="text-3xl font-bold text-white">:</div>

        {/* Minutes */}
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={() => adjustMinutes(true)}
            disabled={disabled}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-white hover:bg-white/10 border border-white/20 rounded-md"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="text-3xl font-bold text-white min-w-[4rem] text-center bg-white/5 rounded-lg py-2 px-3 border border-white/10">
            {minutes.toString().padStart(2, "0")}
          </div>
          <Button
            onClick={() => adjustMinutes(false)}
            disabled={disabled}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-white hover:bg-white/10 border border-white/20 rounded-md"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* AM/PM */}
        <div className="flex flex-col items-center">
          <Button
            onClick={togglePeriod}
            disabled={disabled}
            variant="outline"
            className="h-20 w-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-white/30 shadow-lg shadow-blue-500/25 transition-all"
          >
            <span className="text-xl font-bold">{period}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
