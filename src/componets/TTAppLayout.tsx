'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Button,
  makeStyles,
  tokens,
  shorthands,
  mergeClasses,
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  DrawerFooter,
  Text,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
} from '@fluentui/react-components';
import {
  Home24Regular,
  ClipboardTaskListLtr24Regular,
  ChartMultipleRegular,
  Navigation24Regular,
  Dismiss24Regular,
  Person24Regular,
  Settings24Regular,
  SignOut24Regular,
} from '@fluentui/react-icons';

// =======================
// 🔹 Styles
// =======================
const useStyles = makeStyles({
  headerContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    backgroundColor: '#A5D166',
    boxShadow: tokens.shadow16,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalXXL),
    '@media (max-width: 900px)': {
      ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    },
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: tokens.fontWeightSemibold,
    fontSize: '18px',
    color: tokens.colorNeutralForeground1Static,
    gap: tokens.spacingHorizontalM,
    '& img': {
      height: '36px',
      width: 'auto',
      objectFit: 'contain',
    },
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 900px)': {
      display: 'none',
    },
  },
  navButton: {
    fontWeight: tokens.fontWeightSemibold,
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground1Static,
    transition: 'background 0.2s ease, transform 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
      transform: 'translateY(-1px)',
    },
  },
  active: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    color: tokens.colorNeutralForeground1Static,
  },
  hamburger: {
    display: 'none',
    '@media (max-width: 900px)': {
      display: 'flex',
      color: tokens.colorNeutralForeground1Static,
      ':hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
    },
  },
  drawerBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalM,
  },
  drawerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground1,
    textDecoration: 'none',
    fontWeight: tokens.fontWeightSemibold,
    transition: 'background-color 0.2s ease, transform 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
      transform: 'translateX(4px)',
    },
  },
  drawerActive: {
    backgroundColor: '#9CCB5E',
    color: tokens.colorNeutralForegroundInverted,
    ':hover': {
      backgroundColor: '#8FC856',
    },
  },
  profileMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  drawerProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
  },
  drawerDivider: {
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    margin: '8px 0',
  },
});

// =======================
// 🔹 Component
// =======================
interface User {
  name?: string;
  email?: string;
  image?: string;
}

interface TTNavBarProps {
  user?: User;
}

export default function TTNavBar({ user }: TTNavBarProps) {
  const styles = useStyles();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const navItems = [
    { title: 'New Ticket', href: '/', icon: <Home24Regular /> },
    { title: 'Ticket Results', href: '/TTResultsTable', icon: <ClipboardTaskListLtr24Regular /> },
    { title: 'Task Charts', href: '/TTchart', icon: <ChartMultipleRegular /> },
  ];

  const closeDrawer = () => setIsDrawerOpen(false);

  const getInitials = (name?: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  };

  return (
    <>
      {/* Header */}
      <header className={styles.headerContainer}>
        <div className={styles.topBar}>
          {/* Logo */}
          <div className={styles.logoArea}>
            <img src="/photoDagm3.png" alt="Ethio Telecom Logo" />
            <Text weight="semibold" size={400}>📡 Ethio Telecom TT Portal</Text>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.navLinks}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <Button
                  appearance="transparent"
                  icon={item.icon}
                  className={mergeClasses(styles.navButton, pathname === item.href && styles.active)}
                >
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right side: Profile + Hamburger */}
          <div className={styles.profileMenu}>
            {/* Profile Dropdown (Desktop) */}
            <Tooltip content={user?.name || 'Guest'} relationship="label">
              <Menu>
                <MenuTrigger>
                  <Button appearance="transparent" shape="circular" aria-label="User menu">
                    {user?.image ? (
                      <Avatar image={{ src: user.image }} size={32} />
                    ) : (
                      <Avatar name={getInitials(user?.name)} size={32} />
                    )}
                  </Button>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem icon={<Person24Regular />}>Profile</MenuItem>
                    <MenuItem icon={<Settings24Regular />}>Settings</MenuItem>
                    <MenuItem icon={<SignOut24Regular />}>Sign Out</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
            </Tooltip>

            {/* Mobile Hamburger */}
            <Button
              appearance="transparent"
              icon={<Navigation24Regular />}
              className={styles.hamburger}
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
            />
          </div>
        </div>
      </header>

      {/* Drawer for Mobile */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={(_, data) => setIsDrawerOpen(data.open)}
        position="end"
        size="small"
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                icon={<Dismiss24Regular />}
                onClick={closeDrawer}
                aria-label="Close menu"
              />
            }
          >
            📡 Ethio Telecom TT Portal
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody className={styles.drawerBody}>
          {/* Profile at top of drawer */}
          <Tooltip content={user?.name || 'Guest'} relationship="label">
            <div className={styles.drawerProfile}>
              {user?.image ? (
                <Avatar image={{ src: user.image }} size={40} />
              ) : (
                <Avatar name={getInitials(user?.name)} size={40} />
              )}
              <Text weight="semibold">{user?.name || 'Guest'}</Text>
            </div>
          </Tooltip>

          {/* Navigation Links */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={mergeClasses(styles.drawerLink, pathname === item.href && styles.drawerActive)}
              onClick={closeDrawer}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}

          <div className={styles.drawerDivider} />

          {/* Profile Links */}
          <Link href="/profile" className={styles.drawerLink} onClick={closeDrawer}>
            <Person24Regular />
            Profile
          </Link>
          <Link href="/settings" className={styles.drawerLink} onClick={closeDrawer}>
            <Settings24Regular />
            Settings
          </Link>
          <Link href="/signout" className={styles.drawerLink} onClick={closeDrawer}>
            <SignOut24Regular />
            Sign Out
          </Link>
        </DrawerBody>

        <DrawerFooter>
          <Button appearance="secondary" onClick={closeDrawer} style={{ width: '100%' }}>
            Close Menu
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}
