// src/components/ChartComponents.tsx
"use client";

import * as React from "react";
import { 
    Card, CardHeader, CardPreview, Title3, 
    makeStyles, shorthands, tokens,
    // 🟢 Fluent UI Imports for Dropdown
    Popover, PopoverTrigger, PopoverSurface, Button,
    useId,
} from "@fluentui/react-components";
import { Bar, Doughnut, Line } from "react-chartjs-2"; 
import { 
    Chart as ChartJS, CategoryScale, LinearScale, 
    BarElement, Title, Tooltip, Legend, ArcElement, 
    PointElement, LineElement 
} from 'chart.js';

// 🟢 Imports for Date Range Picker
import { DateRangePicker, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { CalendarMonthRegular } from "@fluentui/react-icons"; // Added icon for button

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
// 2. Styles
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
        height: '450px', 
        display: 'flex',
        flexDirection: 'column',
    },
    cardPreview: {
        flexGrow: 1, 
        position: 'relative', 
    },
    chartContainer: {
        height: '100%', 
        width: '100%',
        position: 'relative', 
    },
    doughnutContainer: {
        height: '100%', 
        width: '100%',
        textAlign: 'center',
        position: 'relative',
    },
    dateRangeContainer: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: "20px",
    },
    dateButton: {
        fontWeight: 500,
    },
    popoverSurface: {
        // Simple styling to prevent the calendar from being too wide if necessary
        maxWidth: 'fit-content',
    },
});

// =======================================================
// 3. Individual Chart Components (No change)
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

// Chart 1: Handler Performance
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

// Chart 2: Task Distribution
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

// Chart 3: Zonal Task Volume
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

// Chart 4: Historical Task Volume
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
    const buttonId = useId("date-range-popover-trigger");

    // State for date range
    const [range, setRange] = React.useState<Range[]>([
        {
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)), // Default to last 7 days
            endDate: new Date(),
            key: "selection",
        },
    ]);
    
    // State for popover visibility
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    // 🟢 Corrected Handler (Resolves TypeScript error)
    const handleRangeChange = (ranges: { [key: string]: Range }) => {
        // Access the updated range using its key, 'selection'
        setRange([ranges.selection]); 
        // We can close the popover after selection if desired, or let it close on outside click.
        // To close immediately after picking the end date, you'd add more logic here.
    };

    const formattedDateRange = `${format(range[0].startDate as Date, "MMM dd, yyyy")} - ${format(range[0].endDate as Date, "MMM dd, yyyy")}`;

    return (
        <div>
            {/* 🗓️ Date Range Dropdown Component */}
            <div className={styles.dateRangeContainer}>
                <Popover 
                    open={isPopoverOpen} 
                    onOpenChange={(e, data) => setIsPopoverOpen(data.open)} 
                    trapFocus={true} // Keep focus inside the popover while open
                    positioning='below'
                >
                    <PopoverTrigger disableButtonEnhancement>
                        {/* Button acts as the dropdown trigger */}
                        <Button 
                            id={buttonId}
                            className={styles.dateButton} 
                            appearance="subtle"
                            icon={<CalendarMonthRegular />}
                        >
                            Date Range: **{formattedDateRange}**
                        </Button>
                    </PopoverTrigger>
                    <PopoverSurface className={styles.popoverSurface}>
                        {/* The Date Range Picker content */}
                        <DateRangePicker
                            ranges={range}
                            onChange={handleRangeChange}
                            moveRangeOnFirstSelection={false}
                            showSelectionPreview={true}
                            months={2} // Show two months in the calendar
                            direction="horizontal"
                        />
                    </PopoverSurface>
                </Popover>
            </div>

            ---

            {/* 📊 Charts Grid */}
            <div className={styles.chartGrid}>
                <HistoryLineChart />
                <HandlerPerformanceChart />
                <TaskDistributionChart />
                <ZonalTaskVolumeChart />
            </div>
        </div>
    );
};