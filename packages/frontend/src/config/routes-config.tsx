import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import { Cog8ToothIcon, PlusIcon } from '@heroicons/react/16/solid';

interface RouteConfig {
  path: string;
  label: string;
  icon: React.ReactNode;
  hasDivider?: boolean;
}

export const mainRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    label: 'Home',
    icon: <HomeIcon />,
  },
  {
    path: '/dashboard/clients',
    label: 'Clients',
    icon: <UserGroupIcon />,
  },
  {
    path: '/dashboard/library',
    label: 'Library',
    icon: <BookOpenIcon />,
  },
  {
    path: '/dashboard/programs',
    label: 'Programs',
    icon: <MapIcon />,
  },
  {
    path: '/dashboard/messages',
    label: 'Messages',
    icon: <ChatBubbleLeftRightIcon />,
  },
];

export const secondaryRoutes: RouteConfig[] = [
  {
    path: '/dashboard/support',
    label: 'Support',
    icon: <QuestionMarkCircleIcon />,
  },
  {
    path: '/dashboard/changelog',
    label: 'Changelog',
    icon: <SparklesIcon />,
  },
];

export const sidebarHeaderDropdownRoutes: RouteConfig[] = [
  {
    path: '/dashboard/settings',
    label: 'Settings',
    icon: <Cog8ToothIcon />,
    hasDivider: true,
  },
  {
    path: '/dashboard/new-team',
    label: 'New Team',
    icon: <PlusIcon />,
  },
];
