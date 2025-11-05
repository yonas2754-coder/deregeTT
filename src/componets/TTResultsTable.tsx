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
  Input,
  Dropdown,
  Option,
  Label,
  makeStyles,
  tokens,
  shorthands,
  Badge,
  SearchBox,
  Title3,
  Card,
  CardHeader,
  CardFooter,
  CardPreview,
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
});

export default function TTResultsPage() {
  const styles = useStyles();

  const [searchText, setSearchText] = React.useState("");
  const [filterZone, setFilterZone] = React.useState("All");

  const zones = ["All", "Addis Ababa", "Adama", "Hawassa"];

  // FILTER
  const filtered = dummyTickets
    .filter((t) => (filterZone !== "All" ? t.zone === filterZone : true))
    .filter(
      (t) =>
        t.serviceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        t.handler.toLowerCase().includes(searchText.toLowerCase())
    );

  const getStatusBadge = (status: ITicket["status"]) => {
    const styles: any = {
      Resolved: { appearance: "filled" },
      Pending: { appearance: "tint" },
      "In-Progress": { appearance: "outline" },
    };
    return <Badge {...styles[status]}>{status}</Badge>;
  };

  return (
    <div className={styles.pageWrapper}>
      <Title3>Service Ticket Results</Title3>
      <p style={{ opacity: 0.7, marginBottom: "20px" }}>
        Real-time operational insight & service completion details
      </p>

      {/* Filters */}
      <div className={styles.filterBar}>
        <SearchBox
          placeholder="Search by ticket or handler..."
          onChange={(_, data) => setSearchText(data.value)}
          style={{ width: "240px" }}
        />

        <Dropdown
          value={filterZone}
          onOptionSelect={(_, data) => setFilterZone(data.optionText!)}
          style={{ width: "180px" }}
        >
          {zones.map((z) => (
            <Option key={z}>{z}</Option>
          ))}
        </Dropdown>
      </div>

      {/* Card wrapper for table */}
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
            {filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <TableCellLayout>{t.id}</TableCellLayout>
                </TableCell>
                <TableCell>{t.zone}</TableCell>
                <TableCell>
                  <b>{t.serviceNumber}</b>
                </TableCell>
                <TableCell>{t.handler}</TableCell>
                <TableCell>{getStatusBadge(t.status)}</TableCell>
                <TableCell>{t.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CardFooter style={{ marginTop: "15px", opacity: 0.6 }}>
        Showing {filtered.length} of {dummyTickets.length} results
      </CardFooter>
    </div>
  );
}
