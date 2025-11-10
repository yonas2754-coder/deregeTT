"use client";

import * as React from "react";
import {
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    TableCellLayout,
    SearchBox,
    Dropdown,
    Option,
    Title3,
    Badge,
    Button,
    makeStyles,
    tokens,
    shorthands,
    Checkbox,
    Subtitle2,
    mergeClasses, 
} from "@fluentui/react-components";
import { 
    Info20Regular, 
    Checkmark20Regular, 
    ArrowRight20Regular, 
    ArrowSortDownLines20Regular, 
    ArrowSortUpLines20Regular,
    ArrowSyncCheckmark20Regular, 
    CheckmarkCircle20Regular,     
} from "@fluentui/react-icons";

// --- Configuration ---
const zoneOptions = ['CAAZ', 'SAAZ', 'NAAZ', 'EAAZ', 'Enterprise office', 'WAAZ', 'SWAAZ', 'NR- Mekele', 'NEER - Semera', 'CNR - D. Birhan', 'SER - Adama', 'SR - Hawassa', 'WR - Nekempt', 'ER - Dire Dawa'];
const allZones = ["All", ...new Set(zoneOptions)].sort();

// --- TYPE DEFINITION ---
interface ITicket {
    id: string;
    zone: string;
    serviceNumber: string;
    handler: string;
    status: "Resolved" | "Pending" | "In-Progress";
    duration: string;
}

type SortableColumn = keyof ITicket; 

// --- INITIAL DUMMY DATA ---
const initialTickets: ITicket[] = [
    { id: "1001", zone: "CAAZ", serviceNumber: "SR-2023-001", handler: "Alegntaye", status: "Resolved", duration: "03:12" },
    { id: "1002", zone: "SER - Adama", serviceNumber: "SR-2023-002", handler: "Yehualaeshet", status: "Pending", duration: "05:41" },
    { id: "1003", zone: "CAAZ", serviceNumber: "SR-2023-003", handler: "semanu", status: "In-Progress", duration: "01:55" },
    { id: "1004", zone: "SR - Hawassa", serviceNumber: "SR-2023-004", handler: "Ermias", status: "Resolved", duration: "02:10" },
    { id: "1005", zone: "SER - Adama", serviceNumber: "SR-2023-005", handler: "Abdulhafiz", status: "Resolved", duration: "02:59" },
    { id: "1006", zone: "SR - Hawassa", serviceNumber: "SR-2023-006", handler: "Alegntaye", status: "Pending", duration: "04:21" },
    { id: "1007", zone: "CAAZ", serviceNumber: "SR-2023-007", handler: "Yehualaeshet", status: "In-Progress", duration: "03:44" },
    { id: "1008", zone: "SER - Adama", serviceNumber: "SR-2023-008", handler: "semanu", status: "Resolved", duration: "01:28" },
    { id: "1009", zone: "EAAZ", serviceNumber: "SR-2023-009", handler: "Ermias", status: "In-Progress", duration: "02:30" },
    { id: "1010", zone: "EAAZ", serviceNumber: "SR-2023-010", handler: "Abdulhafiz", status: "Pending", duration: "01:15" },
];


// --- STYLING (Fluent UI v9 & Enterprise Look) ---
const useStyles = makeStyles({
    pageWrapper: {
        ...shorthands.padding("40px"), 
        backgroundColor: tokens.colorNeutralBackground2,
        minHeight: "100vh",
        boxSizing: 'border-box',
    },
    filterBar: {
        display: "flex",
        gap: "16px", 
        marginBottom: "20px",
        alignItems: "center",

        '@media (max-width: 640px)': {
            flexDirection: 'column',
            alignItems: 'stretch',
            '> *': { width: '100% !important' },
        }
    },
    tableCard: {
        ...shorthands.padding("0px"), 
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusLarge,
        boxShadow: tokens.shadow8, 
        // This enables the scrollbar when inner content is wider
        overflowX: 'auto', 
    },
    // 🚀 NEW: Define the minimum width for the actual table content
    tableElement: {
        minWidth: '950px', // Adjust this value to fit all columns without shrinking
    },
    sortableHeader: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: tokens.colorNeutralBackground4Hover, 
        }
    },
    batchActionBar: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '15px',
        marginTop: '5px',
        ...shorthands.padding("8px", "0px"), 
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    checkboxCell: {
        verticalAlign: 'middle',
        width: '40px',
    },
    tableHeaderRow: {
        backgroundColor: tokens.colorNeutralBackground4, 
    },
    // Ensure Status column has enough space for the widest badge (Responsive Fix)
    statusCell: {
        minWidth: '120px', 
    },
    // Ensure Actions column has enough space for the button (Responsive Fix)
    actionCell: {
        minWidth: '130px', 
    },
    // Header area for title and subtitle
    headerArea: {
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    // Pagination container styles
    pagination: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '12px',
        flexWrap: 'wrap',
    },
});

// --- MAIN COMPONENT ---
export default function TTResultsPage() {
    const styles = useStyles();

    // --- State ---
    const [tickets, setTickets] = React.useState<ITicket[]>(initialTickets);
    const [searchText, setSearchText] = React.useState("");
    const [filterZone, setFilterZone] = React.useState("All");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [sortColumn, setSortColumn] = React.useState<SortableColumn>("id");
    const [sortDirection, setSortDirection] = React.useState<"ascending" | "descending">("descending");
    const [selectedTicketIds, setSelectedTicketIds] = React.useState<Set<string>>(new Set());

    const pageSize = 5;

    // --- Core Logic (Memoized) ---
    const filtered = React.useMemo(() => {
        return tickets.filter((t) => 
            (filterZone !== "All" ? t.zone === filterZone : true) &&
            (t.serviceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
             t.handler.toLowerCase().includes(searchText.toLowerCase()) ||
             t.id.includes(searchText))
        );
    }, [tickets, filterZone, searchText]);

    const sorted = React.useMemo(() => {
        let currentData = filtered;

        if (sortColumn) {
            currentData = [...currentData].sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];

                if (aValue < bValue) return sortDirection === "ascending" ? -1 : 1;
                if (aValue > bValue) return sortDirection === "ascending" ? 1 : -1;
                return 0;
            });
        }
        return currentData;
    }, [filtered, sortColumn, sortDirection]);
    
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const pageData = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const actionableTickets = React.useMemo(() => {
        const pendingToStart: string[] = []; 
        const inProgressToResolve: string[] = []; 

        tickets.forEach(t => {
            if (selectedTicketIds.has(t.id)) {
                if (t.status === "Pending") {
                    pendingToStart.push(t.id);
                } else if (t.status === "In-Progress") {
                    inProgressToResolve.push(t.id);
                }
            }
        });

        return { pendingToStart, inProgressToResolve };
    }, [tickets, selectedTicketIds]);


    // --- Handlers ---
    function goToPage(page: number): void {
        const target = Math.max(1, Math.min(totalPages, Math.floor(page)));
        if (target === currentPage) return;
        setCurrentPage(target);
        if (typeof window !== "undefined" && window.scrollTo) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    const handleBatchAction = async (targetStatus: "In-Progress" | "Resolved") => {
        let idsToUpdate: string[];
        let actionMessage: string;
        
        if (targetStatus === "In-Progress") {
            idsToUpdate = actionableTickets.pendingToStart;
            actionMessage = "started work on";
        } else if (targetStatus === "Resolved") {
            idsToUpdate = actionableTickets.inProgressToResolve;
            actionMessage = "resolved";
        } else {
            return;
        }

        if (idsToUpdate.length === 0) {
            alert(`No eligible tickets selected to change status to ${targetStatus}.`);
            return;
        }

        try {
            console.log(`Simulating API Batch Update for ${idsToUpdate.length} tickets to ${targetStatus}.`);
            await new Promise(resolve => setTimeout(resolve, 750)); 

            setTickets(prevTickets => prevTickets.map(t => 
                idsToUpdate.includes(t.id) ? { ...t, status: targetStatus } : t
            ));
            
            setSelectedTicketIds(new Set());
            alert(`Successfully ${actionMessage} ${idsToUpdate.length} tickets.`);

        } catch (error) {
            console.error("Batch Action failed:", error);
            alert("Failed to perform batch action. Please try again.");
        }
    };
    
    const handleStatusChange = async (ticketId: string, currentStatus: ITicket["status"]) => {
        let newStatus: ITicket["status"];
        if (currentStatus === "Pending") newStatus = "In-Progress";
        else if (currentStatus === "In-Progress") newStatus = "Resolved";
        else return; 

        try {
            await new Promise(resolve => setTimeout(resolve, 500)); 
            setTickets(prevTickets => prevTickets.map(t => 
                t.id === ticketId ? { ...t, status: newStatus } : t
            ));
            alert(`Ticket ${ticketId} is now ${newStatus}.`);
        } catch (error) {
            alert("Failed to update status.");
        }
    };
    
    const handleSort = (column: SortableColumn) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === "ascending" ? "descending" : "ascending"));
        } else {
            setSortColumn(column);
            setSortDirection("ascending");
        }
    };
    
    // --- UI Helpers ---
    const handleSelectTicket = (id: string, checked: boolean) => {
        setSelectedTicketIds(prev => {
            const newSet = new Set(prev);
            checked ? newSet.add(id) : newSet.delete(id);
            return newSet;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allVisibleIds = new Set(filtered.map(t => t.id));
            setSelectedTicketIds(allVisibleIds);
        } else {
            setSelectedTicketIds(new Set());
        }
    };

    const isAllSelected = filtered.length > 0 && selectedTicketIds.size === filtered.length;
    const isIndeterminate = selectedTicketIds.size > 0 && selectedTicketIds.size < filtered.length;
    
    const getSortIcon = (column: SortableColumn) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'ascending' ? <ArrowSortDownLines20Regular /> : <ArrowSortUpLines20Regular />;
    };

    const getStatusBadge = (status: ITicket["status"]) => {
        const statusConfig = {
            Resolved: { appearance: "filled" as const, color: "success" as const, icon: <Checkmark20Regular /> },
            Pending: { appearance: "tint" as const, color: "warning" as const, icon: <Info20Regular /> },
            "In-Progress": { appearance: "outline" as const, color: "brand" as const, icon: <ArrowRight20Regular /> },
        };
        const config = statusConfig[status];
        
        return <Badge size="medium" color={config.color} appearance={config.appearance} icon={config.icon}>{status}</Badge>;
    };

    // Reset page to 1 when filters or sorting changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filterZone, searchText, sortColumn, sortDirection]);

    const columns: { label: string, key: SortableColumn, isFixed?: boolean }[] = [
        { label: 'ID', key: 'id' },
        { label: 'Zone', key: 'zone' },
        { label: 'Service Number', key: 'serviceNumber' },
        { label: 'Handler', key: 'handler' },
        { label: 'Status', key: 'status' },
        { label: 'Duration', key: 'duration' },
    ];


    return (
        <div className={styles.pageWrapper}>
            <div className={styles.headerArea}>
                <Title3>Service Ticket Results</Title3>
                <Subtitle2>
                    Real-time operational insight & service completion details
                </Subtitle2>
            </div>

            {/* --- FILTER & SEARCH BAR --- */}
            <div className={styles.filterBar}>
                <SearchBox
                    placeholder="Search by ticket ID, handler, or service number..."
                    onChange={(_, data) => setSearchText(data.value)}
                    style={{ width: "240px" }}
                />

                <Dropdown
                    placeholder="Filter by Zone"
                    value={filterZone}
                    onOptionSelect={(_, data) => setFilterZone(data.optionText || "All")}
                    style={{ width: "180px" }}
                >
                    {allZones.map((z) => (
                        <Option key={z} value={z}>{z}</Option>
                    ))}
                </Dropdown>
            </div>

            {/* --- BATCH ACTION BAR (Intelligent buttons for Start Work and Resolve) --- */}
            {selectedTicketIds.size > 0 && (
                <div className={styles.batchActionBar}>
                    <span style={{ fontSize: tokens.fontSizeBase300, opacity: 0.9, fontWeight: tokens.fontWeightSemibold }}>
                        {selectedTicketIds.size} tickets selected:
                    </span>
                    
                    {actionableTickets.pendingToStart.length > 0 && (
                        <Button 
                            appearance="primary" 
                            icon={<ArrowSyncCheckmark20Regular />}
                            onClick={() => handleBatchAction("In-Progress")}
                        >
                            Batch Start Work ({actionableTickets.pendingToStart.length})
                        </Button>
                    )}
                    
                    {actionableTickets.inProgressToResolve.length > 0 && (
                        <Button 
                            appearance="secondary" 
                            icon={<CheckmarkCircle20Regular />}
                            onClick={() => handleBatchAction("Resolved")}
                        >
                            Batch Mark Resolve ({actionableTickets.inProgressToResolve.length})
                        </Button>
                    )}

                </div>
            )}
            
            {/* --- TABLE (Professional Card Look) --- */}
            <div className={styles.tableCard}>
                {/* 🚀 Apply the min-width style here to enforce a wide table, triggering overflowX: 'auto' on the parent */}
                <Table className={styles.tableElement}> 
                    <TableHeader>
                        <TableRow className={styles.tableHeaderRow}>
                            {/* Master Checkbox Header (Fixed Width) */}
                            <TableHeaderCell className={styles.checkboxCell}>
                                <Checkbox
                                    checked={isIndeterminate ? ("mixed" as const) : isAllSelected}
                                    onChange={(_, data) => handleSelectAll(!!data.checked)}
                                    title="Select all visible"
                                    disabled={filtered.length === 0}
                                />
                            </TableHeaderCell>
                            
                            {/* SORTABLE HEADER CELLS FOR ALL COLUMNS */}
                            {columns.map(col => (
                                <TableHeaderCell 
                                    key={col.key} 
                                    // CRITICAL FIX: Use mergeClasses to safely combine the sortable style and the fixed width style
                                    className={mergeClasses(
                                        styles.sortableHeader, 
                                        col.key === 'status' && styles.statusCell // Conditionally applies fixed width to Status header
                                    )} 
                                    onClick={() => handleSort(col.key)}
                                >
                                    <TableCellLayout media={getSortIcon(col.key)}>{col.label}</TableCellLayout>
                                </TableHeaderCell>
                            ))}
                            
                            {/* Apply fixed width to the Actions Header */}
                            <TableHeaderCell className={styles.actionCell}>Actions</TableHeaderCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {pageData.map((t) => (
                            <TableRow key={t.id}>
                                {/* Row Checkbox (Fixed Width) */}
                                <TableCell className={styles.checkboxCell}>
                                    <Checkbox
                                        checked={selectedTicketIds.has(t.id)}
                                        onChange={(_, data) => handleSelectTicket(t.id, !!data.checked)}
                                    />
                                </TableCell>
                                
                                <TableCell><TableCellLayout>{t.id}</TableCellLayout></TableCell>
                                <TableCell>{t.zone}</TableCell>
                                <TableCell><b>{t.serviceNumber}</b></TableCell>
                                <TableCell>{t.handler}</TableCell>
                                {/* Apply minimum width to the Status cell (Responsive Fix) */}
                                <TableCell className={styles.statusCell}>{getStatusBadge(t.status)}</TableCell>
                                <TableCell>{t.duration}</TableCell>
                                
                                {/* ACTIONS COLUMN (Single Ticket) (Responsive Fix) */}
                                <TableCell className={styles.actionCell}>
                                    <TableCellLayout>
                                        {t.status !== "Resolved" ? (
                                            <Button
                                                appearance="primary"
                                                size="small"
                                                onClick={() => handleStatusChange(t.id, t.status)}
                                            >
                                                {t.status === "Pending" ? "Start Work" : "Mark Resolved"}
                                            </Button>
                                        ) : (
                                            <Button size="small" appearance="subtle" disabled>Completed</Button>
                                        )}
                                    </TableCellLayout>
                                </TableCell>

                            </TableRow>
                        ))}
                           {pageData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <TableCellLayout>
                                            No results found for the current filters.
                                        </TableCellLayout>
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>

            {/* --- PAGINATION SECTION --- */}
            {sorted.length > 0 && (
                <>
                    <div className={styles.pagination}>
                        <Button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
                            Previous
                        </Button>

                        {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                appearance={page === currentPage ? "primary" : "secondary"}
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </Button>
                        ))}

                        <Button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
                            Next
                        </Button>
                    </div>

                    <div style={{ textAlign: "center", opacity: 0.6, marginTop: "8px" }}>
                        Showing page {currentPage} of {totalPages} — **{sorted.length} total results**
                    </div>
                </>
            )}
        </div>
    );
}