"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useContext } from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Bell,
  Home,
  Users,
  Building,
  Bed,
  Receipt,
  BarChart3,
  Search,
  Plus,
  FileText,
  Clock,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { ModalContext } from "lib/context/modal"
import { useAppState } from "lib/context/app"
import NewReservation from "components/front-office/reservation-list/new"

const getModifierKey = () => {
  if (typeof window !== 'undefined') {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'
  }
  return 'Ctrl'
}

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter()
  const { handleModal }: any = useContext(ModalContext)
  const [state, dispatch]: any = useAppState()
  const [modifierKey, setModifierKey] = useState('Ctrl')

  useEffect(() => {
    setModifierKey(getModifierKey())
  }, [])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <CommandShortcut>{modifierKey}+D</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push("/front-office/reservation-list"))}
          >
            <Building className="mr-2 h-4 w-4" />
            <span>Front Office</span>
            <CommandShortcut>{modifierKey}+F</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push("/guest"))}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Guest Management</span>
            <CommandShortcut>{modifierKey}+G</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push("/room"))}
          >
            <Bed className="mr-2 h-4 w-4" />
            <span>Room Management</span>
            <CommandShortcut>{modifierKey}+R</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push("/handsontable"))}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
            <CommandShortcut>{modifierKey}+C</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => {
              dispatch({
                type: "editId",
                editId: null,
              });
              handleModal(
                true,
                `Захиалга нэмэх`,
                <NewReservation workingDate={new Date().toISOString().split('T')[0]} />,
                null,
                "medium"
              );
            })}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>New Reservation</span>
            <CommandShortcut>{modifierKey}+N</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push("/guest/new"))}
          >
            <User className="mr-2 h-4 w-4" />
            <span>New Guest</span>
            <CommandShortcut>{modifierKey}+⇧+G</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push("/payment"))}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Process Payment</span>
            <CommandShortcut>{modifierKey}+P</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push("/transaction"))}
          >
            <Receipt className="mr-2 h-4 w-4" />
            <span>View Transactions</span>
            <CommandShortcut>{modifierKey}+T</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Reports">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/report"))}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Reports Dashboard</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push("/report/available-room"))}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Occupancy Report</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push("/report/monthly-revenue"))}
          >
            <Calculator className="mr-2 h-4 w-4" />
            <span>Revenue Report</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="System">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/notification/examples"))}
          >
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => router.push("/conf/hotel-information"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>{modifierKey}+,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  return { open, setOpen }
}