import { useLocation, useNavigate, Outlet, Link } from 'react-router';
import { Avatar } from '@/components/ui/avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/ui/dropdown';
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '@/components/ui/navbar';
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/ui/sidebar';
import { SidebarLayout } from '@/components/ui/sidebar-layout';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import {
  mainRoutes,
  secondaryRoutes,
  sidebarHeaderDropdownRoutes,
} from '@/config/routes-config';
import { AccountDropdownMenu } from '@/components/account-dropdown-menu';
import authClient from '@/lib/auth';

export function ApplicationLayout() {
  const location = useLocation();
  const { data: session } = authClient.useSession();

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      navigate('/sign-in', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/sign-in', { replace: true });
    }
  };

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar
                  src={session?.user?.image}
                  className="size-10"
                  square
                  alt="avatar"
                />
              </DropdownButton>
              <AccountDropdownMenu
                signOut={handleSignOut}
                anchor="bottom end"
              />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          {/* SIDEBAR HEADER DROPDOWN */}
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <img src="/favicon.svg" alt="MY_APP_NAME" className="size-5" />
                <SidebarLabel className="text-normal">MY_APP_NAME</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu
                className="min-w-80 lg:min-w-64"
                anchor="bottom start"
              >
                {sidebarHeaderDropdownRoutes.map(route => {
                  return (
                    <>
                      <DropdownItem>
                        {route.icon}
                        <Link to={route.path} key={route.path}>
                          <DropdownLabel>{route.label}</DropdownLabel>
                        </Link>
                      </DropdownItem>
                      {route.hasDivider && <DropdownDivider />}
                    </>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          {/* MAIN ROUTES */}
          <SidebarBody>
            <SidebarSection>
              {mainRoutes.map(route => (
                <SidebarItem
                  key={route.path}
                  to={route.path}
                  current={location.pathname === route.path}
                >
                  {route.icon}
                  <SidebarLabel>{route.label}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>

            <SidebarSpacer />

            {/* SECONDARY ROUTES */}
            <SidebarSection>
              {secondaryRoutes.map(route => (
                <SidebarItem key={route.path} to={route.path}>
                  {route.icon}
                  <SidebarLabel>{route.label}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar
                    src={session?.user?.image}
                    className="size-10"
                    square
                    alt="avatar"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      {session?.user?.name}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {session?.user?.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu signOut={handleSignOut} anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <Outlet />
    </SidebarLayout>
  );
}
