import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMemo } from 'react'
import sidebarConfig from '@/components/layouts/dashboard/sidebar-config'

interface BreadcrumbItem {
  title: string
  href?: string
  isCurrentPage?: boolean
}

function findMenuItemByPath(config: any[], path: string, intl: any): { item: any; parents: any[] } | null {
  for (const item of config) {
    if (item.path === path) {
      return {
        item,
        parents: []
      }
    }

    // Check children
    if (item.children) {
      for (const child of item.children) {
        if (child.path === path) {
          return {
            item: child,
            parents: [item]
          }
        }

        // Check nested children
        if (child.children) {
          for (const grandChild of child.children) {
            if (grandChild.path === path) {
              return {
                item: grandChild,
                parents: [item, child]
              }
            }
          }
        }
      }
    }
  }
  return null
}

function getDisplayTitle(item: any, intl: any): string {
  try {
    return intl.formatMessage({
      id: item.titleEn || `menu.${item.title}`,
      defaultMessage: item.title
    })
  } catch {
    return item.titleEn || item.title
  }
}

export function useBreadcrumbs(sideBarData?: any[]): BreadcrumbItem[] {
  const router = useRouter()
  const intl = useIntl()
  const currentPath = router.pathname

  return useMemo(() => {
    const breadcrumbs: BreadcrumbItem[] = [
      {
        title: '',
        href: '/'
      }
    ]

    // Use provided sideBarData or fallback to sidebarConfig
    const configToUse = sideBarData || sidebarConfig

    // Handle special cases
    if (currentPath === '/' || currentPath === '/dashboard') {
      breadcrumbs.push({
        title: intl.formatMessage({ id: 'menu.dashboard', defaultMessage: 'Dashboard' }),
        isCurrentPage: true
      })
      return breadcrumbs
    }

    if (currentPath === '/faq') {
      breadcrumbs.push({
        title: intl.formatMessage({ id: 'menu.faq', defaultMessage: 'FAQ' }),
        isCurrentPage: true
      })
      return breadcrumbs
    }

    // Find the current page in the sidebar configuration
    const result = findMenuItemByPath(configToUse, currentPath, intl)

    if (result) {
      const { item, parents } = result

      // Add parent breadcrumbs
      parents.forEach((parent, index) => {
        breadcrumbs.push({
          title: getDisplayTitle(parent, intl),
          href: parents.length === 1 ? undefined : parent.path // Only link if it's a direct parent
        })
      })

      // Add current page
      breadcrumbs.push({
        title: getDisplayTitle(item, intl),
        isCurrentPage: true
      })
    } else {
      // Fallback: try to generate breadcrumbs from path segments
      const segments = currentPath.split('/').filter(Boolean)

      if (segments.length > 0) {
        // Add a generic current page breadcrumb
        const lastSegment = segments[segments.length - 1]
        const title = lastSegment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        breadcrumbs.push({
          title,
          isCurrentPage: true
        })
      }
    }

    return breadcrumbs
  }, [currentPath, intl, sideBarData])
}