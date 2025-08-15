import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/radix-popover"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { addDays, format } from "date-fns"
import { CalendarIcon, Search, X } from "lucide-react"
import * as React from "react"
import { type DateRange } from "react-day-picker"
import { useIntl } from "react-intl"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  startDate?: Date
  endDate?: Date
  onStartDateChange?: (date: Date | undefined) => void
  onEndDateChange?: (date: Date | undefined) => void
  onSearch?: (startDate: Date | undefined, endDate: Date | undefined) => void
  onClear?: () => void
  startLabel?: string
  endLabel?: string
}

export default function DateRangePicker({
  className,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onClear,
  startLabel = "Start Date",
  endLabel = "End Date",
  ...props
}: DateRangePickerProps) {
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);
  

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate || addDays(new Date(), -20),
    to: endDate || new Date(),
  })

  React.useEffect(() => {
    setDate({
      from: startDate || undefined,
      to: endDate || undefined,
    })
  }, [startDate, endDate])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "justify-start bg-transparent border-[1.9px] border-primary-main text-left font-normal hover:text-primary-main",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LL/dd/yy")} -{" "}
                  {format(date.to, "LL/dd/yy")}
                </>
              ) : (
                format(date.from, "LL/dd/yy")
              )
            ) : (
              <span>{intl.formatMessage({ id: "TextPickDate" })}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[9999] bg-white border shadow-lg" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
            }}
            numberOfMonths={1}
            className="w-full"
          />
          <div className="flex gap-2 p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDate({ from: undefined, to: undefined })
                if (onStartDateChange) {
                  onStartDateChange(undefined)
                }
                if (onEndDateChange) {
                  onEndDateChange(undefined)
                }
                if (onClear) {
                  onClear()
                }
                setOpen(false)
              }}
              className="flex-1 border-purple-500 text-purple-600 hover:text-primary-main"
            >
              <X className="mr-2 h-4 w-4" />
              {intl.formatMessage({ id: "TextClear" })}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (onSearch) {
                  onSearch(date?.from, date?.to)
                }
                if (date?.from && onStartDateChange) {
                  onStartDateChange(date.from)
                }
                if (date?.to && onEndDateChange) {
                  onEndDateChange(date.to)
                }
                setOpen(false)
              }}
              className="flex-1"
            >
              <Search className="mr-2 h-4 w-4" />
              {intl.formatMessage({ id: "TextSearch" })}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}