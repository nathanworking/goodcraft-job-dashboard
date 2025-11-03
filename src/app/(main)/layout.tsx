'use client'

import { usePathname } from 'next/navigation'
import { StackedLayout } from '@/components/stacked-layout'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@/components/sidebar'
import {
  HomeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/20/solid'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
                <span className="text-lg font-bold text-white dark:text-zinc-900">GC</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Job Hunt Tracker
                </span>
              </div>
            </div>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection className="max-lg:hidden">
            <NavbarItem href="/dashboard" current={pathname === '/dashboard'}>
              <HomeIcon />
              Dashboard
            </NavbarItem>
            <NavbarItem href="/applications" current={pathname.startsWith('/applications')}>
              <BriefcaseIcon />
              Applications
            </NavbarItem>
            <NavbarItem href="/revenue" current={pathname === '/revenue'}>
              <CurrencyDollarIcon />
              Revenue
            </NavbarItem>
            <NavbarItem href="/network" current={pathname === '/network'}>
              <UserGroupIcon />
              Network
            </NavbarItem>
            <NavbarItem href="/content" current={pathname === '/content'}>
              <DocumentTextIcon />
              Content
            </NavbarItem>
            <NavbarItem href="/reviews" current={pathname === '/reviews'}>
              <ChartBarIcon />
              Reviews
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
                <span className="text-lg font-bold text-white dark:text-zinc-900">GC</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  GoodCraft
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Job Hunt Tracker
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/dashboard" current={pathname === '/dashboard'}>
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/applications" current={pathname.startsWith('/applications')}>
                <BriefcaseIcon />
                <SidebarLabel>Applications</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/revenue" current={pathname === '/revenue'}>
                <CurrencyDollarIcon />
                <SidebarLabel>Revenue</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/network" current={pathname === '/network'}>
                <UserGroupIcon />
                <SidebarLabel>Network</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/content" current={pathname === '/content'}>
                <DocumentTextIcon />
                <SidebarLabel>Content</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/reviews" current={pathname === '/reviews'}>
                <ChartBarIcon />
                <SidebarLabel>Reviews</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </StackedLayout>
  )
}
