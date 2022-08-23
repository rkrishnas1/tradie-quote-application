import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { StyledTableRow, StyledTableCell } from '../common/styles';

function Row({ row }) {
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <StyledTableRow sx={{ minWidth: 700 }} aria-label="customized table">
        <StyledTableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{row.name}</StyledTableCell>
        <StyledTableCell align="center">{row.address}</StyledTableCell>
        <StyledTableCell align="center">{row.createdAt}</StyledTableCell>
        <StyledTableCell align="center">{row.dueDate}</StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Quote Details from Tradies
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Tradie Id</StyledTableCell>
                    <StyledTableCell>Quote</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.finalQuotes?.map((quote) => (
                    <TableRow
                      key={quote.userName}
                      style={{ backgroundColor: `${row.minQuote === quote.quote ? 'green' : ''}` }}
                    >
                      <StyledTableCell>{quote.userName}</StyledTableCell>
                      <StyledTableCell>{quote.quote}</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CustomerDashboard({ jobs: rows }) {
  console.log('rows', rows);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell align="center">Job Name</StyledTableCell>
            <StyledTableCell align="center">Address</StyledTableCell>
            <StyledTableCell align="center">Created</StyledTableCell>
            <StyledTableCell align="center">Due Date</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
