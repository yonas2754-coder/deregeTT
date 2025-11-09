


// src/components/ChartComponents.tsx

"use client";



import * as React from "react";

import { 

  Card, CardHeader, CardPreview, Title3, 

  makeStyles, shorthands, tokens,

  Button, useId

} from "@fluentui/react-components";

import { Bar, Doughnut, Line } from "react-chartjs-2"; 

import { 

  Chart as ChartJS, CategoryScale, LinearScale, 

  BarElement, Title, Tooltip, Legend, ArcElement, 

  PointElement, LineElement 

} from "chart.js";



import { DateRangePicker, Range } from "react-date-range";

import "react-date-range/dist/styles.css";

import "react-date-range/dist/theme/default.css";

import { format } from "date-fns";

import { CalendarMonthRegular } from "@fluentui/react-icons";



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



  // ✅ Overlay to darken background

  overlay: {

    position: "fixed",

    inset: 0,

    backgroundColor: "rgba(0,0,0,0.6)",

    backdropFilter: "blur(8px)",

    zIndex: 1000,

  },



  // ✅ Fixed centered popup (independent of button position)

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

});



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


const TaskDistributionChart = () => {

  const styles = useStyles();

  return (

    <Card className={styles.chartCard}>

      <CardHeader header={<Title3>Task Classification Distribution</Title3>} />

      <ChartWrapper>

        <Doughnut data={getTaskDistributionData()} options={{ responsive: true, maintainAspectRatio: false }} />

      </ChartWrapper>

    </Card>

  );

};



const ZonalTaskVolumeChart = () => {

  const styles = useStyles();

  return (

    <Card className={styles.chartCard}>

      <CardHeader header={<Title3>Task Volume by Zone/Region</Title3>} />

      <ChartWrapper>

        <Bar data={getZonalTaskData()} options={{ responsive: true, maintainAspectRatio: false }} />

      </ChartWrapper>

    </Card>

  );

};



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

      {/* ✅ Date Range Button */}

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



      {/* ✅ Centered Popup */}

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



      {/* ✅ Charts Grid */}

      <div className={styles.chartGrid}>

        <HistoryLineChart />

        <HandlerPerformanceChart />

        <TaskDistributionChart />

        <ZonalTaskVolumeChart />

      </div>

    </div>

  );

};

 