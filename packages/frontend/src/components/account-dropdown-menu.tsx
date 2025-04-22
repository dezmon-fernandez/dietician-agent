import { useNavigate, useLocation } from 'react-router';
import {
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/ui/dropdown';
import {
  ArrowRightStartOnRectangleIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid';

export function AccountDropdownMenu({
  anchor,
  signOut,
}: {
  anchor: 'top start' | 'bottom end';
  signOut: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem
        onClick={() => {
          if (location.pathname !== '/dashboard/account') {
            navigate('/dashboard/account');
          }
        }}
      >
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem
        onClick={() => {
          if (location.pathname !== '/dashboard/privacy-policy') {
            navigate('/dashboard/privacy-policy');
          }
        }}
      >
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem
        onClick={() => {
          if (location.pathname !== '/dashboard/feedback') {
            navigate('/dashboard/feedback');
          }
        }}
      >
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={signOut}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}
