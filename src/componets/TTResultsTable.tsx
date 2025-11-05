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
} from "@fluentui/react-components";

interface ITicket {
  id: string;
  zone: string;
  serviceNumber: string;
  handler: string;
  status: "Resolved" | "Pending" | "In-Progress";
  duration: string;
}

const dummyTickets: ITicket[] = [
  { id: "1", zone: "Addis Ababa", serviceNumber: "SR-2023-001", handler: "Yonas", status: "Resolved", duration: "03:12" },
  { id: "2", zone: "Adama", serviceNumber: "SR-2023-002", handler: "Daniel", status: "Pending", duration: "05:41" },
  { id: "3", zone: "Addis Ababa", serviceNumber: "SR-2023-003", handler: "Betelhem", status: "In-Progress", duration: "01:55" },
  { id: "4", zone: "Hawassa", serviceNumber: "SR-2023-004", handler: "Mekdes", status: "Resolved", duration: "02:10" },
  { id: "5", zone: "Adama", serviceNumber: "SR-2023-005", handler: "Sami", status: "Resolved", duration: "02:59" },
  { id: "6", zone: "Hawassa", serviceNumber: "SR-2023-006", handler: "Lidiya", status: "Pending", duration: "04:21" },
  { id: "7", zone: "Addis Ababa", serviceNumber: "SR-2023-007", handler: "Abel", status: "In-Progress", duration: "03:44" },
  { id: "8", zone: "Adama", serviceNumber: "SR-2023-008", handler: "Hanna", status: "Resolved", duration: "01:28" },
];

const useStyles = makeStyles({
  pageWrapper: {
    padding: "32px",
    backgroundColor: tokens.colorNeutralBackground2,
    minHeight: "100vh",
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    alignItems: "center",
  },
  tableCard: {
    ...shorthands.padding("20px"),
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    marginTop: "18px",
  },
});

export default function TTResultsPage() {
  const styles = useStyles();

  const [searchText, setSearchText] = React.useState("");
  const [filterZone, setFilterZone] = React.useState("All");
  const [currentPage, setCurrentPage] = React.useState(1);

  const pageSize = 5;
  const zones = ["All", "Addis Ababa", "Adama", "Hawassa"];

  const filtered = dummyTickets
    .filter((t) => (filterZone !== "All" ? t.zone === filterZone : true))
    .filter(
      (t) =>
        t.serviceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        t.handler.toLowerCase().includes(searchText.toLowerCase())
    );

  // --- PAGINATION ---
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: ITicket["status"]) => {
    const styles: any = {
      Resolved: { appearance: "filled" },
      Pending: { appearance: "tint" },
      "In-Progress": { appearance: "outline" },
    };
    return <Badge {...styles[status]}>{status}</Badge>;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className={styles.pageWrapper}>
      <Title3>Service Ticket Results</Title3>
      <p style={{ opacity: 0.7, marginBottom: "20px" }}>
        Real-time operational insight & service completion details
      </p>

      <div className={styles.filterBar}>
        <SearchBox
          placeholder="Search by ticket or handler..."
          onChange={(_, data) => {
            setSearchText(data.value);
            setCurrentPage(1);
          }}
          style={{ width: "240px" }}
        />

        <Dropdown
          value={filterZone}
          onOptionSelect={(_, data) => {
            setFilterZone(data.optionText!);
            setCurrentPage(1);
          }}
          style={{ width: "180px" }}
        >
          {zones.map((z) => (
            <Option key={z}>{z}</Option>
          ))}
        </Dropdown>
      </div>

      <div className={styles.tableCard}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Zone</TableHeaderCell>
              <TableHeaderCell>Service Number</TableHeaderCell>
              <TableHeaderCell>Handler</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Duration</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageData.map((t) => (
              <TableRow key={t.id}>
                <TableCell><TableCellLayout>{t.id}</TableCellLayout></TableCell>
                <TableCell>{t.zone}</TableCell>
                <TableCell><b>{t.serviceNumber}</b></TableCell>
                <TableCell>{t.handler}</TableCell>
                <TableCell>{getStatusBadge(t.status)}</TableCell>
                <TableCell>{t.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <Button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
        Showing page {currentPage} of {totalPages} — {filtered.length} results
      </div>
    </div>
  );
}
