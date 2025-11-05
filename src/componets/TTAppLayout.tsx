// components/TTNavBar.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    Title1,
    tokens,
    makeStyles,
    shorthands,
} from '@fluentui/react-components';

// --- STYLING: Professional, Sticky, and Fluent Brand ---
const useStyles = makeStyles({
    header: {
        // ESSENTIAL: Sticky Header for an application shell look
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',

        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundInverted,
        boxShadow: tokens.shadow8, // Subtle shadow for elevation
        
        // Responsive Padding
        ...shorthands.padding('0', tokens.spacingHorizontalXXL),
    },
    appName: {
        color: tokens.colorNeutralForegroundInverted,
        fontWeight: tokens.fontWeightSemibold,
        textDecorationLine: 'none', 
    },
    navButtons: {
        display: 'flex',
        ...shorthands.gap(tokens.spacingHorizontalM),
    },
    // Base style for the Link component
    navLink: {
        display: 'flex',
        alignItems: 'center',
        height: '40px',
        paddingLeft: tokens.spacingHorizontalM,
        paddingRight: tokens.spacingHorizontalM,
        textDecorationLine: 'none',
        borderRadius: tokens.borderRadiusMedium,
        color: tokens.colorNeutralForegroundInverted,
        backgroundColor: 'transparent',
        transitionProperty: 'background-color, border-bottom',
        transitionDuration: tokens.durationNormal,

        // Hover State
        ':hover': {
            backgroundColor: tokens.colorBrandBackgroundHover,
            color: tokens.colorNeutralForegroundInverted,
        },
    },
    // Styling for the currently active link (tab)
    navLinkActive: {
        backgroundColor: tokens.colorBrandBackgroundSelected,
        // Visual indicator: Thick underline on selection
        ...shorthands.borderBottom('3px', 'solid', tokens.colorNeutralBackground1),
    },
});

const TTNavBar: React.FC = () => {
    const styles = useStyles();
    // 1. Get the current URL path using the Next.js hook
    const currentPath = usePathname();

    // 2. Helper function to check activity
    const isLinkActive = (path: string): string => {
        // Checks if path matches exactly (e.g., '/' or '/TTResultsTable')
        return currentPath === path ? styles.navLinkActive : '';
    };

    return (
        <header className={styles.header}>
            <Title1 className={styles.appName}>
                Ethio Telecom TT Portal
            </Title1>
            
            <nav className={styles.navButtons}>
                
                {/* 1. Create New Ticket Link (Home Page) */}
                <Link 
                    href="/" 
                    className={`${styles.navLink} ${isLinkActive('/')}`}
                > 
                    Create New Ticket
                </Link> 
                
                {/* 2. View All Tickets Link */}
                <Link 
                    href="/TTResultsTable" 
                    className={`${styles.navLink} ${isLinkActive('/TTResultsTable')}`}
                > 
                    View All Tickets
                </Link> 
            </nav>
        </header>
    );
};

export default TTNavBar;