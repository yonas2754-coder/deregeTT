// components/TTResultsTable.tsx
'use client';

import * as React from 'react';
import {
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    TableCellLayout,
    TableSelectionCell,
    Title2,
    Label,
    tokens,
    makeStyles,
    shorthands,
    Badge,
} from '@fluentui/react-components';

// --- DATA STRUCTURE ---
interface ITicketResult {
    id: number;
    date: string;
    serviceNumber: string;
    tasksClassification: string;
    requestType: string;
    zone: string;
    handler: string;
    priority: 'High' | 'Medium' | 'Low';
    remarks: string;
    status: 'New' | 'In Progress' | 'Solved' | 'Pending';
}

// --- DUMMY ENTERPRISE DATA (Based on form fields) ---
const dummyTickets: ITicketResult[] = [
    { id: 1, date: '2025-11-04', serviceNumber: '251118991234', tasksClassification: 'Provisioning', requestType: 'Email', zone: 'CAAZ', handler: 'Alegntaye', priority: 'High', remarks: 'New E1 configuration for site X.', status: 'In Progress' },
    { id: 2, date: '2025-11-04', serviceNumber: '251911556789', tasksClassification: 'Maintenance', requestType: 'Phone', zone: 'EAAZ', handler: 'Yehualaeshet', priority: 'Medium', remarks: 'Caller ID display issue for customer Y.', status: 'Pending' },
    { id: 3, date: '2025-11-03', serviceNumber: '251582001010', tasksClassification: 'Others', requestType: 'SMS order', zone: 'NAAZ', handler: 'semanu', priority: 'Low', remarks: 'Data collection request for monthly report.', status: 'Solved' },
    { id: 4, date: '2025-11-03', serviceNumber: '251913141516', tasksClassification: 'Provisioning', requestType: 'Manual order', zone: 'SWAAZ', handler: 'Ermias', priority: 'High', remarks: 'IMS SIP service activation for branch Z.', status: 'New' },
    { id: 5, date: '2025-11-02', serviceNumber: '251114445555', tasksClassification: 'Maintenance', requestType: 'Email', zone: 'CAAZ', handler: 'Abdulhafiz', priority: 'Medium', remarks: 'Routing correction for internal O&M calls.', status: 'Solved' },
];

// --- COLUMN DEFINITIONS ---
const columns = [
    { columnKey: 'selection', label: '' },
    { columnKey: 'id', label: 'Ticket ID' },
    { columnKey: 'date', label: 'Date' },
    { columnKey: 'serviceNumber', label: 'Service No.' },
    { columnKey: 'tasksClassification', label: 'Classification' },
    { columnKey: 'requestType', label: 'Source' },
    { columnKey: 'zone', label: 'Zone' },
    { columnKey: 'handler', label: 'Handler' },
    { columnKey: 'priority', label: 'Priority' },
    { columnKey: 'status', label: 'Status' },
    // Remarks column should be visible only in the detail view or larger screens
];


// --- STYLING (Professional & Responsive) ---
const useStyles = makeStyles({
    container: {
        ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalXXL, tokens.spacingVerticalM, tokens.spacingHorizontalXXL),
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('28px'),
        // Mobile padding
        '@media (max-width: 768px)': {
            ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalL, tokens.spacingVerticalM, tokens.spacingHorizontalL),
        },
    },
    title: {
        borderBottom: `2px solid ${tokens.colorBrandBackground}`, 
        paddingBottom: '8px', 
        marginBottom: '4px',
        fontWeight: tokens.fontWeightSemibold,
        fontSize: tokens.fontSizeHero700, 
    },
    tableWrapper: {
        // ESSENTIAL FOR ENTERPRISE TABLE RESPONSIVENESS: Horizontal scroll on small screens
        overflowX: 'auto',
        // Optional: Add a light border/shadow to separate the table visually
        boxShadow: tokens.shadow2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
    },
    // Styles for the Priority Badge colors (Ethio Telecom Theme Colors)
    priorityHigh: {
        backgroundColor: tokens.colorPaletteRedBackground3,
        color: tokens.colorPaletteRedForeground3,
    },
    priorityMedium: {
        backgroundColor: tokens.colorPaletteYellowBackground3,
        color: tokens.colorPaletteYellowForeground3,
    },
    priorityLow: {
        backgroundColor: tokens.colorPaletteGreenBackground3, // Using green for low priority
        color: tokens.colorPaletteGreenForeground3,
    },
});

// Helper function to map priority to Fluent UI Badge styling
const getPriorityStyles = (priority: ITicketResult['priority'], styles: Record<string, string>) => {
    if (priority === 'High') return styles.priorityHigh;
    if (priority === 'Medium') return styles.priorityMedium;
    return styles.priorityLow;
};

const TTResultsTable: React.FC = () => {
    const styles = useStyles();
    const [selectedRows, setSelectedRows] = React.useState<Record<number, boolean>>({});

    const handleRowToggle = (id: number) => {
        setSelectedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className={styles.container}>
            <Title2 className={styles.title}>
                Trouble Ticket Results & Status
            </Title2>
            <Label size="large" weight="semibold">
                Overview of recently submitted or active service tickets.
            </Label>

            <div className={styles.tableWrapper}>
                <Table size="small" aria-label="Trouble Ticket Results">
                    <TableHeader>
                        <TableRow>
                            <TableSelectionCell 
                                checked={false} // Placeholder for select all
                            />
                            {columns.filter(c => c.columnKey !== 'selection').map((column) => (
                                <TableHeaderCell key={column.columnKey}>
                                    {/* Placeholder for Sorting Icon */}
                                    <TableCellLayout>{column.label}</TableCellLayout>
                                </TableHeaderCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummyTickets.map((item) => (
                            <TableRow key={item.id}>
                                <TableSelectionCell 
                                        id={item.id}
                                        checked={selectedRows[item.id] || false}
                                        onClick={() => handleRowToggle(item.id)}
                                    />
                                    <TableCell>{item.id}</TableCell>
                                <TableCell>{item.serviceNumber}</TableCell>
                                <TableCell>{item.tasksClassification}</TableCell>
                                <TableCell>{item.requestType}</TableCell>
                                <TableCell>{item.zone}</TableCell>
                                <TableCell>{item.handler}</TableCell>

                                {/* Priority Cell with Colored Badge */}
                                <TableCell>
                                    <Badge
                                        appearance="filled"
                                        size="medium"
                                        className={getPriorityStyles(item.priority, styles)}
                                    >
                                        {item.priority}
                                    </Badge>
                                </TableCell>
                                
                                {/* Status Cell (Simple Text for clean look) */}
                                <TableCell>{item.status}</TableCell>
                                
                                {/* A practical enterprise table would also have a Details/Action button here */}
                                {/* <TableCell><Button size="small" appearance="subtle">View Details</Button></TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TTResultsTable;