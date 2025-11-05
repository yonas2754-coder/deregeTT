'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Text,
  Button,
  Input,
  Subtitle1,
  makeStyles,
  tokens,
  shorthands,
  mergeClasses,
} from '@fluentui/react-components';
import { Home24Regular, ClipboardTaskListLtr24Regular, Search24Regular } from '@fluentui/react-icons';

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
  },

  appTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    fontSize: '18px',
  },

  navArea: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXXL),
    backgroundColor: tokens.colorNeutralBackground2,
  },

  navButton: {
    fontWeight: tokens.fontWeightSemibold,
    borderRadius: tokens.borderRadiusMedium,
    transition: 'all 0.18s ease',
  },

  active: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundInverted,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },

  searchBox: {
    width: '280px',
  },
});

export default function TTNavBar() {
  const styles = useStyles();
  const pathname = usePathname();
  const [query, setQuery] = React.useState('');

  const navItems = [
    { title: 'New Ticket', href: '/', icon: <Home24Regular /> },
    { title: 'Ticket Results', href: '/TTResultsTable', icon: <ClipboardTaskListLtr24Regular /> },
  ];

  return (
    <header className={styles.container}>
      {/* Top Brand Bar */}
      <div className={styles.topBar}>
        <div className={styles.appTitle}>
          📡 Ethio Telecom TT Portal
        </div>

        {/* Microsoft-style search box */}
        <Input
          placeholder="Search tickets..."
          contentBefore={<Search24Regular />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchBox}
        />
      </div>

      {/* Navigation Buttons */}
      <nav className={styles.navArea}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <Button
              appearance={pathname === item.href ? 'primary' : 'subtle'}
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
    </header>
  );
}
