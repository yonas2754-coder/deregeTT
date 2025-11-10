// src/components/ChartComponents.tsx

"use client";

import * as React from "react";
import { useRef } from "react"; // 👈 Import useRef

import { 
  Card, CardHeader, CardPreview, Title3, 
  makeStyles, shorthands, tokens,
  Button, useId, 
  // Add Toolbar and ToolbarButton for better header layout
  Toolbar, ToolbarButton 
} from "@fluentui/react-components";
import { ArrowDownloadRegular, CalendarMonthRegular } from "@fluentui/react-icons"; // 👈 Import download icon
import { Bar, Doughnut, Line } from "react-chartjs-2"; 
import { 
  Chart as ChartJS, CategoryScale, LinearScale, 
  BarElement, Title, Tooltip, Legend, ArcElement, 
  PointElement, LineElement, 
  Chart
} from "chart.js";

import { DateRangePicker, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";


import { 
  getHandlerPerformanceData, 
  getTaskDistributionData, 
  getZonalTaskData, 
  getTaskHistoryData 
} from "../data/data";

// =======================================================
// Chart.js Setup
// =======================================================
ChartJS.register(
  CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend, ArcElement,
  PointElement, LineElement
);

// =======================================================
// Styles
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
    height: "450px",
    display: "flex",
    flexDirection: "column",
    
    
  },
  cardPreview: {
    flexGrow: 1,
  },
  chartContainer: {
    height: "100%",
    width: "100%",
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

  // Overlay to darken background
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
    zIndex: 1000,
  },

  // Fixed centered popup (independent of button position)
  centeredPopup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1100,
    boxShadow: tokens.shadow28,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.padding("12px"),
  },

  cleanCalendar: {
    "& .rdrCalendarWrapper": {
      border: "none",
      fontFamily: tokens.fontFamilyBase,
    },
  },
  // Style for the Toolbar in the CardHeader
  cardHeaderToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  }
});

// =======================================================
// Helper for Download 👈 NEW
// =======================================================

/**
 * Downloads the chart image.
 * @param chartRef - React Ref object for the chart instance.
 * @param fileName - Desired file name for the download.
 */
const downloadChart = (chartRef: React.RefObject<Chart>, fileName: string) => {
  if (chartRef.current) {
    // Chart.js instance has a getBase64Image() method
    const link = document.createElement('a');
    link.href = chartRef.current.toBase64Image();
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error("Chart reference not available for download.");
  }
};


// =======================================================
// Chart Wrapper
// =======================================================
const ChartWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const styles = useStyles();
  return (
    <CardPreview className={styles.cardPreview}>
      <div className={styles.chartContainer}>{children}</div>
    </CardPreview>
  );
};

// =======================================================
// Charts
// =======================================================

const HandlerPerformanceChart: React.FC = () => {
    const styles = useStyles();
    // 👈 Create a ref for the chart
   const chartRef = useRef<ChartJS | null>(null);


    return (
        <Card className={styles.chartCard}>
            {/* 👈 Updated CardHeader with Toolbar and Download Button */}
            <CardHeader header={
                <div className={styles.cardHeaderToolbar}>
                    <Title3>Handler Performance: Total Tasks</Title3>
                    <Toolbar size="small">
                        <ToolbarButton
                            icon={<ArrowDownloadRegular />}
                            onClick={() => downloadChart(chartRef, "handler_performance_chart.png")}
                            title="Download Chart"
                        >
                            Download Chart
                        </ToolbarButton>
                    </Toolbar>
                </div>
            } />
            <ChartWrapper>
                {/* 👈 Pass the ref to the Bar component */}
                <Bar 
                    ref={chartRef}
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


const TaskDistributionChart = () => {
  const styles = useStyles();
  // 👈 Create a ref for the chart
  const chartRef = useRef<Chart>(null);

  return (
    <Card className={styles.chartCard}>
        {/* 👈 Updated CardHeader with Toolbar and Download Button */}
        <CardHeader header={
            <div className={styles.cardHeaderToolbar}>
                <Title3>Task Classification Distribution</Title3>
                <Toolbar size="small">
                    <ToolbarButton
                        icon={<ArrowDownloadRegular />}
                        onClick={() => downloadChart(chartRef, "task_distribution_chart.png")}
                        title="Download Chart"
                    >
                        Download Chart
                    </ToolbarButton>
                </Toolbar>
            </div>
        } />
      <ChartWrapper>
        {/* 👈 Pass the ref to the Doughnut component */}
        <Doughnut ref={chartRef} data={getTaskDistributionData()} options={{ responsive: true, maintainAspectRatio: false }} />
      </ChartWrapper>
    </Card>
  );
};



const ZonalTaskVolumeChart = () => {
  const styles = useStyles();
  // 👈 Create a ref for the chart
  const chartRef = useRef<Chart>(null);

  return (
    <Card className={styles.chartCard}>
        {/* 👈 Updated CardHeader with Toolbar and Download Button */}
        <CardHeader header={
            <div className={styles.cardHeaderToolbar}>
                <Title3>Task Volume by Zone/Region</Title3>
                <Toolbar size="small">
                    <ToolbarButton
                        icon={<ArrowDownloadRegular />}
                        onClick={() => downloadChart(chartRef, "zonal_task_volume_chart.png")}
                        title="Download Chart"
                    >
                        Download Chart
                    </ToolbarButton>
                </Toolbar>
            </div>
        } />
      <ChartWrapper>
        {/* 👈 Pass the ref to the Bar component */}
        <Bar ref={chartRef} data={getZonalTaskData()} options={{ responsive: true, maintainAspectRatio: false }} />
      </ChartWrapper>
    </Card>
  );
};


const HistoryLineChart: React.FC = () => {
    const styles = useStyles();
    // 👈 Create a ref for the chart
    const chartRef = useRef<Chart>(null);

    return (
        <Card className={styles.chartCard}>
            {/* 👈 Updated CardHeader with Toolbar and Download Button */}
            <CardHeader header={
                <div className={styles.cardHeaderToolbar}>
                    <Title3>Historical Daily Task Volume</Title3>
                    <Toolbar size="small">
                        <ToolbarButton
                            icon={<ArrowDownloadRegular />}
                            onClick={() => downloadChart(chartRef, "historical_daily_task_volume_chart.png")}
                            title="Download Chart"
                        >
                            Download Chart
                        </ToolbarButton>
                    </Toolbar>
                </div>
            } />
            <ChartWrapper>
                {/* 👈 Pass the ref to the Line component */}
                <Line
                    ref={chartRef}
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
// Main Component
// =======================================================

export const DashboardCharts: React.FC = () => {
  const styles = useStyles();
  const buttonId = useId("date-range-button");

  const [isOpen, setIsOpen] = React.useState(false);
  const [range, setRange] = React.useState<Range[]>([
    { startDate: new Date(new Date().setDate(new Date().getDate() - 7)), endDate: new Date(), key: "selection" },
  ]);

  const handleRangeChange = (ranges: { [key: string]: Range }) => {
    setRange([ranges.selection]);
  };

  const formattedDateRange = `${format(range[0].startDate!, "MMM dd, yyyy")} - ${format(
    range[0].endDate!,
    "MMM dd, yyyy"
  )}`;

  // Disable scroll when popup open
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div style={{ padding: "20px" }}>
      {/* Date Range Button */}
      <div className={styles.dateRangeContainer}>
        <Button
          id={buttonId}
          appearance="subtle"
          icon={<CalendarMonthRegular />}
          className={styles.dateButton}
          onClick={() => setIsOpen(true)}
        >
          Date Range: {formattedDateRange}
        </Button>
      </div>

      {/* Centered Popup */}
      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div className={`${styles.centeredPopup} ${styles.cleanCalendar}`}>
            <DateRangePicker
              ranges={range}
              onChange={handleRangeChange}
              moveRangeOnFirstSelection={false}
              months={2}
              direction="horizontal"
              showSelectionPreview
              rangeColors={[tokens.colorBrandBackground]}
            />
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <Button appearance="primary" onClick={() => setIsOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Charts Grid */}
      <div className={styles.chartGrid}>
        <HistoryLineChart />
        <HandlerPerformanceChart />
        <TaskDistributionChart />
        <ZonalTaskVolumeChart />
      </div>
    </div>
  );
};