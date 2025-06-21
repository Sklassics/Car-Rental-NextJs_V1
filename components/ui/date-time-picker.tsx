"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, Clock, Check, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { TimePicker } from "@/components/ui/time-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date and time",
  className,
  disabled,
  minDate,
  maxDate,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value)
  const [selectedTime, setSelectedTime] = React.useState("12:00 PM")
  const [tempDate, setTempDate] = React.useState<Date | undefined>(value)
  const [tempTime, setTempTime] = React.useState("12:00 PM")

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setTempDate(value)
      const timeString = format(value, "hh:mm a")
      setSelectedTime(timeString)
      setTempTime(timeString)
    }
  }, [value])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setTempDate(date)
    }
  }

  const handleTimeChange = (time: string) => {
    setTempTime(time)
  }

  const handleSet = () => {
    if (tempDate && tempTime) {
      const [time, period] = tempTime.split(" ")
      const [hours, minutes] = time.split(":")

      let hour24 = Number.parseInt(hours)
      if (period === "PM" && hour24 !== 12) hour24 += 12
      if (period === "AM" && hour24 === 12) hour24 = 0

      const newDateTime = new Date(tempDate)
      newDateTime.setHours(hour24, Number.parseInt(minutes), 0, 0)

      setSelectedDate(newDateTime)
      setSelectedTime(tempTime)
      onChange?.(newDateTime)
      setOpen(false)
    }
  }

  const handleCancel = () => {
    setTempDate(selectedDate)
    setTempTime(selectedTime)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal glass border-white/30 text-white hover:bg-white/10 h-12",
            !selectedDate && "text-gray-400",
            className,
          )}
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            <span className="flex items-center gap-2">
              {format(selectedDate, "PPP")}
              <Clock className="h-3 w-3" />
              {selectedTime}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full bg-slate-900/95 glass-dark border-white/20 backdrop-blur-xl p-0">
        <DialogHeader className="p-6 pb-2 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold gradient-text">Select Date & Time</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-2 max-h-[80vh] overflow-y-auto">
          {/* Calendar Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-blue-400" />
              <h3 className="text-white font-medium">Choose Date</h3>
            </div>
            <div className="glass border border-white/20 rounded-lg overflow-hidden">
              <Calendar
                mode="single"
                selected={tempDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  // if (minDate && date < minDate) return true
                  // if (maxDate && date > maxDate) return true
                  return date < new Date(new Date().setHours(0, 0, 0, 0))
                }}
                initialFocus
                className="w-full"
              />
            </div>
          </motion.div>

          {/* Time Picker Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <TimePicker value={tempTime} onChange={handleTimeChange} disabled={disabled} />
          </motion.div>
        </div>
        {/* Selected Preview and Action Buttons */}
        <div className="px-6 pb-6">
          <AnimatePresence>
            {tempDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 mb-4"
              >
                <h4 className="text-blue-400 font-medium mb-3 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Selected Date & Time:
                </h4>
                <div className="text-white space-y-2">
                  <div className="flex items-center gap-3 text-lg">
                    <CalendarIcon className="h-5 w-5 text-blue-400" />
                    <span className="font-medium">{format(tempDate, "EEEE, MMMM do, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <span className="font-medium">{tempTime}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSet}
              disabled={!tempDate}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 mr-2" />
              Set Date & Time
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
