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
import Moment from 'moment-timezone';

import UpdateQuote from './UpdateQuote';
import { StyledTableRow, StyledTableCell } from '../common/styles';
import { DATE_FORMAT } from '../constants';

const Row = ({ row, updateQuote, currentUser }) => {
  const [open, setOpen] = React.useState(false);
  const quoteOfCurrentUser = row.finalQuotes?.find((finalQuote) => finalQuote.userName === currentUser)?.quote;
  const updateQuoteForJob = (value) => {
    updateQuote(row.id, value);
  };
  var currentDate = Moment(new Date(), DATE_FORMAT);
  var dueDate = Moment(row.dueDate, DATE_FORMAT);
  const isDueDateCrossed = currentDate > dueDate;
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
        <StyledTableCell align="center">
          {isDueDateCrossed ? (
            quoteOfCurrentUser
          ) : (
            <UpdateQuote quoteOfCurrentUser={quoteOfCurrentUser} updateQuoteForJob={updateQuoteForJob} />
          )}
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Description</StyledTableCell>
                    <StyledTableCell align="center">Price Quote range</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.createdAt}>
                    <StyledTableCell align="center">{row.description}</StyledTableCell>
                    <StyledTableCell align="center">{row.quoteRange}</StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </React.Fragment>
  );
};

const TradieDashboard = ({ jobs: rows, updateQuote, currentUser }) => {
  return (
    <>
      <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
        Below are the jobs posted by different customers. Please give your quote before the due date and you will be
        contacted by the customer if you are successful in the bid.
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell align="center">Job Name</StyledTableCell>
              <StyledTableCell align="center">Address</StyledTableCell>
              <StyledTableCell align="center">Created</StyledTableCell>
              <StyledTableCell align="center">Due Date</StyledTableCell>
              <StyledTableCell align="center">Your quote</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <Row key={row.name} row={row} updateQuote={updateQuote} currentUser={currentUser} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TradieDashboard;
