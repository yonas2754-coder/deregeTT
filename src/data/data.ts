// src/data/data.ts

import { ChartData } from "chart.js";

// --- Hardcoded Data (Simulated from your CSV analysis) ---

export const HANDLER_PERFORMANCE = [
  { handler: "Alegntaye", totalTasks: 94 },
  { handler: "Yehualaeshet", totalTasks: 82 },
  { handler: "Ermias", totalTasks: 76 },
  { handler: "Semanu", totalTasks: 49 },
  { handler: "Abdulhafiz", totalTasks: 19 },
];

export const TASK_COUNTS = {
  Provisioning: 155, 
  Maintenance: 157,
  Others: 8,
};

export const ZONAL_TASK_DATA = [
  { Zone_Region: "CAAZ", Provisioning: 38, Maintenance: 32, Others: 5 },
  { Zone_Region: "WAAZ", Provisioning: 120, Maintenance: 70, Others: 0 },
  { Zone_Region: "EAAZ", Provisioning: 1, Maintenance: 8, Others: 0 },
  { Zone_Region: "SCAZ", Provisioning: 39, Maintenance: 0, Others: 3 },
  { Zone_Region: "CNR", Provisioning: 0, Maintenance: 2, Others: 0 },
];

// 🟢 NEW: Simulated Daily Task History Data
export const DAILY_TASK_HISTORY = [
    { date: "Oct 27", tasks: 60, status: 'Provisioning' },
    { date: "Oct 28", tasks: 55, status: 'Maintenance' },
    { date: "Oct 29", tasks: 75, status: 'Provisioning' },
    { date: "Oct 30", tasks: 80, status: 'Maintenance' },
    { date: "Oct 31", tasks: 65, status: 'Provisioning' },
    { date: "Nov 01", tasks: 40, status: 'Maintenance' },
    { date: "Nov 02", tasks: 10, status: 'Others' },
];


// --- ChartJS Data Formatting Functions ---

// Chart 1: Handler Performance
export const getHandlerPerformanceData = (): ChartData<"bar"> => {
    const sortedData = [...HANDLER_PERFORMANCE].sort((a, b) => b.totalTasks - a.totalTasks);
    return {
      labels: sortedData.map(d => d.handler),
      datasets: [
        {
          label: 'Total Tasks Handled',
          data: sortedData.map(d => d.totalTasks),
          backgroundColor: '#0078D4', // Microsoft Blue
        },
      ],
    };
  };
  
  // Chart 2: Task Classification Distribution
  export const getTaskDistributionData = (): ChartData<"doughnut"> => ({
    labels: Object.keys(TASK_COUNTS),
    datasets: [
      {
        data: Object.values(TASK_COUNTS),
        backgroundColor: ['#0078D4', '#21304A', '#7F7F7F'], 
        borderWidth: 0,
      },
    ],
  });
  
  // Chart 3: Zonal Task Volume
  export const getZonalTaskData = (): ChartData<"bar"> => ({
    labels: ZONAL_TASK_DATA.map(d => d.Zone_Region),
    datasets: [
        {
            label: 'Provisioning',
            data: ZONAL_TASK_DATA.map(d => d.Provisioning),
            backgroundColor: '#0078D4',
            stack: 'Stack 1',
        },
        {
            label: 'Maintenance',
            data: ZONAL_TASK_DATA.map(d => d.Maintenance),
            backgroundColor: '#21304A',
            stack: 'Stack 1',
        },
        {
            label: 'Others',
            data: ZONAL_TASK_DATA.map(d => d.Others),
            backgroundColor: '#7F7F7F',
            stack: 'Stack 1',
        },
    ],
  });

  // 🟢 NEW FUNCTION: Task History (Line Chart)
  export const getTaskHistoryData = (): ChartData<"line"> => ({
    labels: DAILY_TASK_HISTORY.map(d => d.date),
    datasets: [
        {
            label: 'Daily Task Volume',
            data: DAILY_TASK_HISTORY.map(d => d.tasks),
            borderColor: '#0078D4', // Line color
            backgroundColor: 'rgba(0, 120, 212, 0.1)', // Fill area under the line
            tension: 0.3, // Smooth curve
            fill: true,
        },
    ],
  });