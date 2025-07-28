"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { useContext } from "react"
import {
  Calendar,
  CreditCard,
  Settings,
  Home,
  Users,
  Building,
  Bed,
  Search as SearchIcon,
  Plus,
} from "lucide-react"
import { ModalContext } from "lib/context/modal"
import { useAppState } from "lib/context/app"
import NewReservation from "components/front-office/reservation-list/new"
import ReservationEdit from "components/front-office/reservation-list/edit"
import { FrontOfficeAPI } from "lib/api/front-office"
import { useIntl } from "react-intl"
import { DoorBackOutlined, Payment } from "@mui/icons-material"

const getModifierKey = () => {
  if (typeof window !== 'undefined') {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'
  }
  return 'Ctrl'
}

// --- TYPES ---
interface SearchItemType {
  id: number;
  name: string;
  icon: React.ReactNode;
  notification?: string;
  color: string;
  action: () => void;
}

interface ReservationItemType {
  TransactionID: number;
  GuestName: string;
  RoomNo: string;
  GroupCode?: string;
  RoomTypeName?: string;
  CustomerName?: string;
  Adult?: number;
  Child?: number;
  Balance?: number;
}

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
}

interface SearchItemProps {
  item: SearchItemType;
}

interface ReservationItemProps {
  reservation: ReservationItemType;
  onClick: (reservation: ReservationItemType) => void;
}

// --- Search Item Component ---
const SearchItem: React.FC<SearchItemProps> = ({ item }) => (
  <li
    className="flex items-center justify-between p-3 transition-all duration-300 ease-in-out bg-black/5 dark:bg-gray-500/10 hover:bg-black/10 dark:hover:bg-gray-500/20 rounded-xl hover:scale-[1.02] cursor-pointer"
    onClick={item.action}
  >
    <div className="flex items-center gap-4">
      {item.icon}
      <span className="text-gray-700 dark:text-gray-200">{item.name}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <span style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} className="w-2 h-2 rounded-full"></span>
      <span>{item.notification}</span>
    </div>
  </li>
);

// --- Reservation Item Component ---
const ReservationItem: React.FC<ReservationItemProps> = ({ reservation, onClick }) => {
  const intl = useIntl()

  return (
    <li
      className="flex items-center w-full p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 cursor-pointer hover:scale-[1.02]"
      onClick={() => onClick(reservation)}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-3">
        <DoorBackOutlined className="h-4 w-4 text-blue-600 dark:text-blue-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {reservation.GuestName || intl.formatMessage({ id: 'CommandPalette.NoGuestName' })}
          </span>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-full">
            #{reservation.TransactionID}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            <span>{intl.formatMessage({ id: 'CommandPalette.Room' })} {reservation.RoomNo || intl.formatMessage({ id: 'CommandPalette.NA' })}</span>
          </div>
          {reservation.Adult && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>{reservation.Adult}/{reservation.Child || 0}</span>
            </div>
          )}
          {reservation.Balance && Number(reservation.Balance) > 0 && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Payment className="w-3 h-3" />
              <span>{Number(reservation.Balance).toLocaleString()}₮</span>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter()
  const { handleModal }: any = useContext(ModalContext)
  const [state, dispatch]: any = useAppState()
  const [modifierKey, setModifierKey] = useState('Ctrl')
  const intl = useIntl()
  const inputRef = useRef<HTMLInputElement>(null)

  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  const [reservationItems, setReservationItems] = useState<ReservationItemType[]>([])
  const [workingDate, setWorkingDate] = useState('')

  const modalActions: SearchItemType[] = [
    {
      id: 1,
      name: intl.formatMessage({ id: 'CommandPalette.NewReservation' }),
      icon: <Plus className="w-5 h-5" />,
      notification: `F2`,
      color: '#10B981',
      action: () => {
        setOpen(false)
        handleModal(
          true,
          intl.formatMessage({ id: 'CommandPalette.NewReservation' }),
          <NewReservation workingDate={workingDate} />,
          null,
          'medium'
        )
      }
    }
  ]

  // Navigation Actions - Actions that navigate to pages
  const navigationActions: SearchItemType[] = [
    {
      id: 2,
      name: intl.formatMessage({ id: 'CommandPalette.Dashboard' }),
      icon: <Home className="w-5 h-5" />,
      // notification: `${modifierKey}+D`,
      color: '#3B82F6',
      action: () => {
        setOpen(false)
        router.push("/")
      }
    },
    {
      id: 6,
      name: intl.formatMessage({ id: 'CommandPalette.Calendar' }),
      icon: <Calendar className="w-5 h-5" />,
      // notification: `${modifierKey}+C`,
      color: '#06B6D4',
      action: () => {
        setOpen(false)
        router.push("/handsontable")
      }
    },
    {
      id: 3,
      name: intl.formatMessage({ id: 'CommandPalette.FrontOffice' }),
      icon: <Building className="w-5 h-5" />,
      // notification: `${modifierKey}+F`,
      color: '#8B5CF6',
      action: () => {
        setOpen(false)
        router.push("/front-office/reservation-list")
      }
    },
    {
      id: 4,
      name: intl.formatMessage({ id: 'CommandPalette.GuestManagement' }),
      icon: <Users className="w-5 h-5" />,
      // notification: `${modifierKey}+G`,
      color: '#F59E0B',
      action: () => {
        setOpen(false)
        router.push("/guest")
      }
    },
    {
      id: 5,
      name: intl.formatMessage({ id: 'CommandPalette.RoomManagement' }),
      icon: <Bed className="w-5 h-5" />,
      // notification: `${modifierKey}+R`,
      color: '#EF4444',
      action: () => {
        setOpen(false)
        router.push("/room")
      }
    },
    {
      id: 7,
      name: intl.formatMessage({ id: 'CommandPalette.ProcessPayment' }),
      icon: <CreditCard className="w-5 h-5" />,
      // notification: `${modifierKey}+P`,
      color: '#84CC16',
      action: () => {
        setOpen(false)
        router.push("/payment")
      }
    },
    {
      id: 8,
      name: intl.formatMessage({ id: 'CommandPalette.Settings' }),
      icon: <Settings className="w-5 h-5" />,
      // notification: `${modifierKey}+,`,
      color: '#6B7280',
      action: () => {
        setOpen(false)
        router.push("/conf/hotel-information")
      }
    }
  ]


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

  const handleClear = () => {
    setSearchTerm('')
  }

  const handleReservationClick = (reservation: ReservationItemType) => {
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setOpen(!open)
        if (!open) {
          setTimeout(() => inputRef.current?.focus(), 100)
        }
      }
      if (event.key === 'Escape' && open) {
        event.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, setOpen])

  // Filter functions
  const filteredReservations = reservationItems.filter(item => {
    const searchLower = searchTerm.toLowerCase()
    return (
      item.GuestName?.toLowerCase().includes(searchLower) ||
      item.RoomNo?.toLowerCase().includes(searchLower) ||
      item.GroupCode?.toLowerCase().includes(searchLower) ||
      item.TransactionID?.toString().includes(searchLower) ||
      item.RoomTypeName?.toLowerCase().includes(searchLower) ||
      item.CustomerName?.toLowerCase().includes(searchLower)
    )
  }).slice(0, 5)



  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[10vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpen(false)
        }
      }}
    >
      <div className="w-full max-w-2xl mx-auto p-4 space-y-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-purple-500/15 max-h-[80vh] flex flex-col">

        {/* Search Input with Enhanced Gradient Border and Glow */}
        <div className="relative p-px rounded-2xl bg-gradient-to-r from-orange-500 via-purple-600 to-pink-600 shadow-lg shadow-purple-500/20 dark:shadow-purple-600/30 transition-shadow duration-300 hover:shadow-purple-500/40 dark:hover:shadow-purple-600/50 focus-within:shadow-purple-500/40 dark:focus-within:shadow-purple-600/50">
          <div className="flex items-center w-full px-4 py-3 bg-white/90 dark:bg-gray-900/90 rounded-[15px]">
            <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder={intl.formatMessage({ id: 'CommandPalette.SearchPlaceholder' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1 text-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none flex-1 min-w-0"
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center justify-center p-1 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-inner">
                {modifierKey}
              </div>
              <div className="flex items-center justify-center w-6 h-6 p-1 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-inner">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Search Results - Only show when searching */}
          {searchTerm && filteredReservations.length > 0 && (
            <div className="px-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{intl.formatMessage({ id: 'CommandPalette.Reservations' })}</h2>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/50 hover:text-black dark:hover:text-white"
                >
                  {intl.formatMessage({ id: 'CommandPalette.ClearAll' })}
                </button>
              </div>

              <ul className="space-y-2">
                {filteredReservations.map(reservation => (
                  <ReservationItem
                    key={reservation.TransactionID}
                    reservation={reservation}
                    onClick={handleReservationClick}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Quick Actions */}
          {modalActions.length > 0 && (
            <div className="px-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
                  {searchTerm ? intl.formatMessage({ id: 'CommandPalette.MatchingActions' }) : intl.formatMessage({ id: 'CommandPalette.QuickActions' })}
                </h2>
              </div>

              <ul className="space-y-2">
                {modalActions.map(item => (
                  <SearchItem key={item.id} item={item} />
                ))}
              </ul>
            </div>
          )}

          {/* No Results */}
          {searchTerm && filteredReservations.length === 0 && modalActions.length === 0 && (
            <div className="px-2 py-8 text-center">
              <p className="text-gray-400 dark:text-gray-500">{intl.formatMessage({ id: 'CommandPalette.NoResults' }, { searchTerm })}</p>
              <p className="text-sm text-gray-500 dark:text-gray-600 mt-2">{intl.formatMessage({ id: 'CommandPalette.SearchHint' })}</p>
            </div>
          )}

          {/* Default State */}
          {!searchTerm && (
            <div className="px-2 space-y-4">
              {/* Navigation Actions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{intl.formatMessage({ id: 'TextPages' })}</h2>
                </div>
                <ul className="space-y-2">
                  {navigationActions.map(item => (
                    <SearchItem key={item.id} item={item} />
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false)

  return { open, setOpen }
}