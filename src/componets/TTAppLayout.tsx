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
} from '@fluentui/react-components';
import {
  Home24Regular,
  ClipboardTaskListLtr24Regular,
  ChartMultipleRegular,
  Navigation24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';

// =======================
// 🔹 Styles
// =======================

const useStyles = makeStyles({
  headerContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 200,
    width: '100%',
    backgroundColor: '#A5D166', // ✅ Brand background
    boxShadow: tokens.shadow16,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },

  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalXXL),
    '@media (max-width: 768px)': {
      ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    },
  },

  logoArea: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: tokens.fontWeightSemibold,
    fontSize: '18px',
    color: tokens.colorNeutralForeground1Static, // readable on green
    gap: tokens.spacingHorizontalM,
    '& img': {
      height: '34px',
      width: 'auto',
      objectFit: 'contain',
    },
  },

  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },

  navButton: {
    fontWeight: tokens.fontWeightSemibold,
    transition: 'all 0.2s ease',
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground1Static,
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  },

  active: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },

  hamburger: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
      color: tokens.colorNeutralForeground1Static,
    },
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
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },

  drawerActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
});

// =======================
// 🔹 Component
// =======================

export default function TTNavBar() {
  const styles = useStyles();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const navItems = [
    { title: 'New Ticket', href: '/', icon: <Home24Regular /> },
    { title: 'Ticket Results', href: '/TTResultsTable', icon: <ClipboardTaskListLtr24Regular /> },
    { title: 'Task Charts', href: '/TTchart', icon: <ChartMultipleRegular /> },
  ];

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header className={styles.headerContainer}>
        {/* 🔹 Top Navigation Bar */}
        <div className={styles.topBar}>
          <div className={styles.logoArea}>
            <img src="/photoDagm3.png" alt="Ethio Telecom Logo" />
            📡 Ethio Telecom TT Portal
          </div>

          {/* 🔹 Desktop Navigation */}
          <nav className={styles.navLinks}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <Button
                  appearance="transparent"
                  icon={item.icon}
                  className={mergeClasses(
                    styles.navButton,
                    pathname === item.href && styles.active
                  )}
                >
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>

          {/* 🔹 Mobile Hamburger Button */}
          <Button
            appearance="transparent"
            icon={<Navigation24Regular />}
            className={styles.hamburger}
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open navigation menu"
          />
        </div>
      </header>

      {/* 🔹 Drawer for Mobile Menu */}
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

        <DrawerBody>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={mergeClasses(
                styles.drawerLink,
                pathname === item.href && styles.drawerActive
              )}
              onClick={closeDrawer}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
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
