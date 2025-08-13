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
import { ReservationAPI } from "lib/api/reservation"
import { useIntl } from "react-intl"
import { DoorBackOutlined, Payment } from "@mui/icons-material"
import { getContrastYIQ } from "lib/utils/helpers"
import Iconify from "components/iconify/iconify"
import axios from "lib/utils/axios"

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
  GroupColor?: string;
  StatusColor?: string;
  IsGroupOwner?: boolean;
  Phone?: string;
  Email?: string;
  ArrivalDate?: string;
  DepartureDate?: string;
  IsBreakfast?: boolean;
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

  // Default status color if not provided
  const statusColor = reservation.StatusColor ? `#${reservation.StatusColor}` : '#4a6cf7'
  const textColor = getContrastYIQ(statusColor)
  const groupColor = reservation.GroupColor || null

  return (
    <li
      className="flex items-center justify-between w-full transition-all duration-200 cursor-pointer hover:scale-[1.02]"
      onClick={() => onClick(reservation)}
      style={{
        padding: '8px 12px',
        borderRadius: '6px',
        backgroundColor: statusColor,
        color: textColor,
        border: (reservation.GroupCode && groupColor) ? `3px solid ${groupColor}` : 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        margin: '4px 0'
      }}
    >
      <div className="flex items-center gap-2 w-full justify-between">
        {/* Guest name with phone and email */}
        <div className="flex items-center">
          {/* Drag icon */}
          <Iconify
            icon="lsicon:drag-filled"
            width="14px"
            style={{ marginRight: '8px', marginTop: '2px' }}
          />

          {/* Group icon if applicable */}
          {(reservation.GroupCode || reservation.GroupColor) && (
            <span
              style={{
                marginRight: '8px',
                marginTop: '2px',
                color: groupColor || '#495057'
              }}
            >
              {reservation.IsGroupOwner ? (
                <Iconify
                  icon="solar:crown-outline"
                  width="14px"
                />
              ) : (
                <Iconify
                  icon="clarity:group-line"
                  width="14px"
                />
              )}
            </span>
          )}

          {/* Balance icon if applicable */}
          {reservation.Balance != null && Number(reservation.Balance) > 0 && (
            <span style={{ marginRight: '8px', marginTop: '2px' }}>
              <Iconify icon="vaadin:cash" width="14px" />
            </span>
          )}

          {/* Breakfast icon if included */}
          {reservation.IsBreakfast && (
            <span style={{ marginRight: '8px', marginTop: '2px' }}>
              <Iconify icon="mdi:food" width="14px" />
            </span>
          )}
          <p
            title={reservation.GuestName || intl.formatMessage({ id: 'CommandPalette.NoGuestName' })}
            style={{
              fontWeight: '600',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              margin: '0',
              lineHeight: '1.2'
            }}
          >
            {reservation.GuestName || intl.formatMessage({ id: 'CommandPalette.NoGuestName' })}
            {(reservation.Phone || reservation.Email) && (
              <div style={{
                display: "flex",
                alignItems: 'center',
                fontSize: '11px',
                opacity: '0.9',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                lineHeight: '1.2',
                marginTop: '2px',
                fontWeight: '500',
                gap: '4px'
              }}>
                {reservation.Email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Iconify icon="mdi:email" width="10px" />
                    {reservation.Email}
                  </span>
                )}
                {reservation.Phone && reservation.Email && <span>•</span>}
                {reservation.Phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Iconify icon="mdi:phone" width="10px" />
                    {reservation.Phone}
                  </span>
                )}
              </div>
            )}
          </p>
        </div>

        {/* Right side info */}
        <div className="flex items-center gap-2"
        >
          {/* Arrival -> Departure dates */}
          {(reservation.ArrivalDate || reservation.DepartureDate) && (
            <div
              style={{
                backgroundColor: '#fff',
                color: '#000',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '500',
                fontSize: '10px',
                whiteSpace: 'nowrap'
              }}
            >
              {reservation.ArrivalDate ? new Date(reservation.ArrivalDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : 'N/A'}  → {reservation.DepartureDate ? new Date(reservation.DepartureDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : 'N/A'}
            </div>
          )}

          {/* Room info */}
          <div
            style={{
              backgroundColor: '#fff',
              color: '#000',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              fontSize: '11px',
              whiteSpace: 'nowrap'
            }}
          >
            <DoorBackOutlined style={{ width: '10px', height: '10px', marginRight: '2px' }} />
            <span>{reservation.RoomNo || intl.formatMessage({ id: 'CommandPalette.NA' })}</span>
          </div>

          {/* Transaction ID */}
          <div
            style={{
              backgroundColor: '#fff',
              color: '#000',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '500',
              fontSize: '11px'
            }}
          >
            #{reservation.TransactionID}
          </div>

          {/* Balance if applicable - only show if greater than 0 */}
          {reservation.Balance != null && Number(reservation.Balance) > 0 && (
            <div
              style={{
                backgroundColor: '#fff',
                color: '#000',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '500',
                fontSize: '11px'
              }}
            >
              {Number(reservation.Balance).toLocaleString()}₮
            </div>
          )}
          {/* Drag icon on the right */}
          <Iconify
            icon="lsicon:drag-filled"
            width="14px"
            style={{ marginLeft: 'auto', marginTop: '2px' }}
          />
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
      notification: `ALT + C`,
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

        // Use ReservationAPI to get enhanced data with guest contact information
        const items = await FrontOfficeAPI.list({
          CurrDate: currentWorkingDate,
          NumberOfDays: 30,
          RoomTypeID: 0,
        })

        // Enhance the data with guest contact information
        if (items && items.length > 0) {
          // Get unique guest IDs
          const guestIds = Array.from(new Set(items.map((r: any) => r.GuestID).filter((id: any) => id)))

          if (guestIds.length > 0) {
            try {
              // Fetch guest data for all unique guest IDs
              const guestRes = await axios.post('/api/Guest/List', {
                GuestID: 0,
                GuestName: "",
                CountryID: "0",
                IdentityValue: "",
                Phone: "",
                TransactionID: "",
                IsMainOnly: false
              })
              const guests = guestRes.data.JsonData

              // Create a map of guest data by GuestID
              const guestMap = new Map()
              guests.forEach((guest: any) => {
                guestMap.set(guest.GuestID, guest)
              })

              // Enhance reservation data with guest contact information
              const enhancedItems = items.map((reservation: any) => {
                const guest = guestMap.get(reservation.GuestID)
                return {
                  ...reservation,
                  Phone: guest?.Phone || guest?.Mobile || guest?.PhoneOrMobile || "",
                  Email: guest?.Email || ""
                }
              })

              setReservationItems(enhancedItems)
            } catch (guestError) {
              console.error('Error fetching guest data:', guestError)
              setReservationItems(items || [])
            }
          } else {
            setReservationItems(items || [])
          }
        } else {
          setReservationItems([])
        }
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
      if ((event.metaKey || event.ctrlKey) && (event.key === 'k' || event.key === 'K')) {
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
      item.CustomerName?.toLowerCase().includes(searchLower) ||
      item.Phone?.toLowerCase().includes(searchLower) ||
      item.Email?.toLowerCase().includes(searchLower)
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
              autoFocus
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