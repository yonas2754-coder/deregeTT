// src/components/ChartComponents.tsx
"use client";

import * as React from "react";
import { 
  Card, CardHeader, CardPreview, Title3, 
  makeStyles, shorthands, tokens 
} from "@fluentui/react-components";
import { Bar, Doughnut, Line } from "react-chartjs-2"; 
import { 
    Chart as ChartJS, CategoryScale, LinearScale, 
    BarElement, Title, Tooltip, Legend, ArcElement, 
    PointElement, LineElement 
} from 'chart.js';

import { 
    getHandlerPerformanceData, 
    getTaskDistributionData, 
    getZonalTaskData, 
    getTaskHistoryData 
} from "../data/data";

// =======================================================
// 1. Chart.js Setup
// =======================================================
ChartJS.register(
    CategoryScale, LinearScale, BarElement, 
    Title, Tooltip, Legend, ArcElement,
    PointElement, LineElement
);

// =======================================================
// 2. Styles (Professional Vertical Expansion)
// =======================================================

const useStyles = makeStyles({
    chartGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)", 
        gap: "20px",
        ...shorthands.padding("20px", "0"),
        
        "@media (max-width: 992px)": { 
            gridTemplateColumns: "1fr",
        },
    },
    chartCard: {
        ...shorthands.padding("20px"),
        boxShadow: tokens.shadow8, 
        // 🟢 FIX 1: Set a consistent height and enable Flexbox for vertical expansion
        height: '450px', 
        display: 'flex',
        flexDirection: 'column',
    },
    
    // 🟢 FIX 2: Ensure CardPreview expands vertically to fill remaining space
    cardPreview: {
        flexGrow: 1, // Takes up all remaining vertical space
        position: 'relative', 
    },

    // 🟢 FIX 3: Ensure inner chart container takes 100% of the CardPreview height
    chartContainer: {
        height: '100%', 
        width: '100%',
        position: 'relative', 
    },
    // Specific style for the Doughnut chart container
    doughnutContainer: {
        // Inherits height: 100% from chartContainer class when merged
        height: '100%', 
        width: '100%',
        textAlign: 'center',
        position: 'relative',
    }
});

// =======================================================
// 3. Individual Chart Components
// =======================================================

const ChartWrapper: React.FC<React.PropsWithChildren<{ isDoughnut?: boolean }>> = ({ children, isDoughnut = false }) => {
    const styles = useStyles();
    return (
        <CardPreview className={styles.cardPreview}>
            <div className={isDoughnut ? styles.doughnutContainer : styles.chartContainer}>
                {children}
            </div>
        </CardPreview>
    );
};

// Chart 1: Handler Performance (Horizontal Bar Chart)
const HandlerPerformanceChart: React.FC = () => {
    const styles = useStyles();
    return (
        <Card className={styles.chartCard}>
            <CardHeader header={<Title3>Handler Performance: Total Tasks</Title3>} />
            <ChartWrapper>
                <Bar 
                    data={getHandlerPerformanceData()}
                    options={{
                        indexAxis: 'y',
                        responsive: true,
                        // CRITICAL: Must be false for height: 100% to work
                        maintainAspectRatio: false, 
                        plugins: { 
                            legend: { display: false }, 
                            title: { display: true, text: 'Tasks Handled by Individual Handler', font: { size: 14 } } 
                        },
                        scales: { 
                            x: { grid: { display: true }, title: { display: true, text: 'Task Count' } }, 
                            y: { grid: { display: false } } 
                        }
                    }}
                />
            </ChartWrapper>
        </Card>
    );
};

// Chart 2: Task Classification Distribution (Doughnut Chart)
const TaskDistributionChart: React.FC = () => {
    const styles = useStyles();
    return (
        <Card className={styles.chartCard}>
            <CardHeader header={<Title3>Task Classification Distribution</Title3>} />
            <ChartWrapper isDoughnut>
                <Doughnut 
                    data={getTaskDistributionData()}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false, 
                        plugins: { 
                            legend: { position: 'bottom' as const }, 
                            title: { display: true, text: 'Volume Breakdown (Total Tasks)', font: { size: 14 } } 
                        }
                    }}
                />
            </ChartWrapper>
        </Card>
    );
};

// Chart 3: Zonal Task Volume (Stacked Bar Chart)
const ZonalTaskVolumeChart: React.FC = () => {
    const styles = useStyles();
    return (
        <Card className={styles.chartCard}>
            <CardHeader header={<Title3>Task Volume by Zone/Region</Title3>} />
            <ChartWrapper>
                <Bar
                    data={getZonalTaskData()}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                            title: { display: true, text: 'Stacked Volume by Zone/Region', font: { size: 14 } }, 
                            tooltip: { mode: 'index', intersect: false } 
                        },
                        scales: { 
                            x: { stacked: true, title: { display: true, text: 'Zone / Region' } }, 
                            y: { stacked: true, title: { display: true, text: 'Task Count' } } 
                        }
                    }}
                />
            </ChartWrapper>
        </Card>
    );
};

// Chart 4: Historical Task Volume (Time Series Line Chart)
const HistoryLineChart: React.FC = () => {
    const styles = useStyles();
    return (
        <Card className={styles.chartCard}>
            <CardHeader header={<Title3>Historical Daily Task Volume</Title3>} />
            <ChartWrapper>
                <Line
                    data={getTaskHistoryData()}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            title: { display: true, text: 'Task Volume over Time (Last 7 Days)', font: { size: 14 } },
                        },
                        scales: {
                            x: { grid: { display: false }, title: { display: true, text: 'Date' } },
                            y: { 
                                grid: { display: true }, 
                                title: { display: true, text: 'Task Count' },
                                min: 0, 
                            },
                        }
                    }}
                />
            </ChartWrapper>
        </Card>
    );
};

// =======================================================
// 4. Main Export Component
// =======================================================

export const DashboardCharts: React.FC = () => {
    const styles = useStyles();
    return (
        <div className={styles.chartGrid}>
            <HistoryLineChart />
            <HandlerPerformanceChart />
            <TaskDistributionChart />
            <ZonalTaskVolumeChart />
        </div>
    );
};