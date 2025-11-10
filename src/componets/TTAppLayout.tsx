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
  container: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalXXL),

    '@media (max-width: 768px)': {
      ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    },
  },

  appTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    fontSize: '18px',
    '& img': {
      height: '32px',
      objectFit: 'contain',
      marginRight: tokens.spacingHorizontalS,
    },
  },

  // ✅ Base nav area (hidden on mobile by default)
  navArea: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXXL),
    backgroundColor: tokens.colorNeutralBackground2,

    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
      display: 'none', // Hidden by default
      width: '100%',
      transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease',
      overflow: 'hidden',
    },
  },

  // ✅ When mobile menu open
  navAreaOpen: {
    '@media (max-width: 768px)': {
      display: 'flex',
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },

  navButton: {
    fontWeight: tokens.fontWeightSemibold,
    borderRadius: tokens.borderRadiusMedium,
    transition: 'all 0.18s ease',
    width: 'fit-content',
  },

  active: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },

  hamburgerBtn: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
});

// =======================
// 🔹 Component
// =======================

export default function TTNavBar() {
  const styles = useStyles();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navItems = [
    { title: 'New Ticket', href: '/', icon: <Home24Regular /> },
    { title: 'Ticket Results', href: '/TTResultsTable', icon: <ClipboardTaskListLtr24Regular /> },
    { title: 'Task Charts', href: '/TTchart', icon: <ChartMultipleRegular /> },
  ];

  // Close menu when screen resizes above mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  return (
    <header className={styles.container}>
      {/* 🔹 Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.appTitle}>
          <img src="/photoDagm3.png" alt="Ethio Telecom Logo" />
          📡 Ethio Telecom TT Portal
        </div>

        {/* 🔹 Hamburger Button (Visible on Mobile) */}
        <Button
          appearance="subtle"
          icon={menuOpen ? <Dismiss24Regular /> : <Navigation24Regular />}
          className={styles.hamburgerBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        />
      </div>

      {/* 🔹 Navigation Area */}
      <nav
        className={mergeClasses(
          styles.navArea,
          menuOpen && styles.navAreaOpen
        )}
      >
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none', width: '100%' }}>
            <Button
              appearance={pathname === item.href ? 'primary' : 'subtle'}
              icon={item.icon}
              className={mergeClasses(
                styles.navButton,
                pathname === item.href && styles.active
              )}
              onClick={() => setMenuOpen(false)} // close after click
            >
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>
    </header>
  );
}
