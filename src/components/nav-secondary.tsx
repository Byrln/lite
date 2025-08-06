"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { useIntl } from "react-intl"
import {
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NavSecondaryProps {
  currentMode: 'front-office' | 'configuration'
  onModeChange: (mode: 'front-office' | 'configuration') => void
}

export function NavSecondary({ currentMode, onModeChange }: NavSecondaryProps) {
  const intl = useIntl()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const toggleMode = () => {
    onModeChange(currentMode === 'front-office' ? 'configuration' : 'front-office')
  }

  const getButtonText = () => {
    if (currentMode === 'front-office') {
      return intl.formatMessage({ id: 'MenuConfiguration', defaultMessage: 'Configuration' })
    } else {
      return intl.formatMessage({ id: 'MenuFrontOffice', defaultMessage: 'Front Office' })
    }
  }

  const buttonContent = (
    <Button
      variant="default"
      size={isCollapsed ? "icon" : "sm"}
      onClick={toggleMode}
      className={`transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-white hover:bg-primary-dark ${isCollapsed ? 'w-8 h-8 p-0 -mx-2' : 'w-full justify-start'
        }`}
    >
      <Icon
        icon={currentMode === 'front-office' ? 'lucide:settings' : 'lucide:building'}
        className={`h-4 w-4 transition-transform duration-300 ease-in-out ${isCollapsed ? '' : 'mr-2'
          }`}
      />
      {!isCollapsed && (
        <span className="transition-opacity duration-200 ease-in-out">
          {getButtonText()}
        </span>
      )}
    </Button>
  )

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="flex flex-col gap-2 p-2">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {buttonContent}
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{getButtonText()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            buttonContent
          )}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}