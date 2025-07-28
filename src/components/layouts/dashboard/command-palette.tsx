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
import moment from "moment"

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
import ReservationEdit from "components/front-office/reservation-list/edit"
import { FrontOfficeAPI } from "lib/api/front-office"
import { useIntl } from "react-intl"
import { AttachMoney, DoorBack, DoorBackOutlined, Money, Payment, Room } from "@mui/icons-material"

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
  const intl = useIntl()

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [reservationItems, setReservationItems] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [workingDate, setWorkingDate] = useState('')

  useEffect(() => {
    setModifierKey(getModifierKey())
    fetchReservationData()
  }, [])

  // Fetch reservation data
  const fetchReservationData = async () => {
    try {
      const workingDateResponse = await FrontOfficeAPI.workingDate()
      if (workingDateResponse.status === 200) {
        const currentWorkingDate = workingDateResponse.workingDate[0].WorkingDate
        setWorkingDate(currentWorkingDate)

        const items = await FrontOfficeAPI.list({
          CurrDate: currentWorkingDate,
          NumberOfDays: 30,
          RoomTypeID: 0,
        })
        setReservationItems(items || [])
      }
    } catch (error) {
      console.error('Error fetching reservation data:', error)
    }
  }

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      return
    }

    if (!reservationItems) {
      setSearchResults([])
      return
    }

    const filtered = reservationItems.filter((item: any) => {
      const searchTerm = query.toLowerCase()
      return (
        item.GuestName?.toLowerCase().includes(searchTerm) ||
        item.RoomNo?.toLowerCase().includes(searchTerm) ||
        item.GroupCode?.toLowerCase().includes(searchTerm) ||
        item.TransactionID?.toString().includes(searchTerm) ||
        item.RoomTypeName?.toLowerCase().includes(searchTerm) ||
        item.CustomerName?.toLowerCase().includes(searchTerm)
      )
    })

    setSearchResults(filtered.slice(0, 5)) // Limit to 5 results
  }

  // Handle reservation click
  const handleReservationClick = (reservation: any) => {
    setOpen(false)
    handleModal(
      true,
      intl.formatMessage({
        id: 'FrontNewReservation',
      }),
      <ReservationEdit
        transactionID={reservation.TransactionID}
        extendedProps={reservation}
        additionalMutateUrl="/api/Reservation/List"
      />,
      null,
      'medium'
    )
  }

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
      <CommandInput
        placeholder="Type a command or search..."
        value={searchQuery}
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <>
            <CommandGroup heading="Search Results">
              {searchResults.map((reservation: any, index: number) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleReservationClick(reservation)}
                >
                  <div className="flex items-center w-full p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 transition-all duration-200">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <DoorBackOutlined className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 truncate">
                          {reservation.GuestName || 'No Guest Name'}
                        </span>
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          #{reservation.TransactionID}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="blue" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                          </svg>
                          <span>Room {reservation.RoomNo || 'N/A'}</span>
                        </div>
                        {reservation.Adult && (
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="blue" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span>{reservation.Adult}/{reservation.Child || 0}</span>
                          </div>
                        )}
                        {reservation.Balance && Number(reservation.Balance) > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Payment className="w-3 h-3" />
                            <span>{Number(reservation.Balance).toLocaleString()}₮</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

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