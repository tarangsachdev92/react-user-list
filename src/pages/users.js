import http from '../http-common';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { Button } from '@mui/material';

const TableContainerDiv = styled(TableContainer)`
  &.tableContainer {
    border-radius: 15px;
    margin: 10px 10px;
  }
  .table {
    min-width: 650px;
  }
  .tableHeaderCell {
    font-weight: bold;
  }
`;

const Users = () => {
  const [userList, setUserList] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  console.log('user', userList);

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
    },
    {
      id: 'username',
      numeric: true,
      disablePadding: false,
      label: 'User Name',
    },
    {
      id: 'email',
      numeric: true,
      disablePadding: false,
      label: 'Email',
    },
    {
      id: 'phone',
      numeric: true,
      disablePadding: false,
      label: 'Phone',
    },
    {
      id: 'website',
      numeric: true,
      disablePadding: false,
      label: 'Website',
    },
    {
      id: 'action',
    },
  ];

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              className='tableHeaderCell'
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  useEffect(() => {
    http
      .get('/users')
      .then((response) => {
        setUserList(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <TableContainerDiv component={Paper} className='tableContainer'>
      <Table className='table' sx={{ minWidth: 650 }} aria-label='simple table'>
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {stableSort(userList, getComparator(order, orderBy)).map((user) => {
            return (
              <TableRow hover tabIndex={-1} key={user.name}>
                <TableCell component='th' scope='row' padding='none'>
                  {user.name}
                </TableCell>
                <TableCell align='right'>{user.username}</TableCell>
                <TableCell align='right'>{user.email}</TableCell>
                <TableCell align='right'>{user.phone}</TableCell>
                <TableCell align='right'>{user.website}</TableCell>
                <TableCell align='right'>
                  <Button
                    onClick={() => {
                      window.top.postMessage(
                        JSON.stringify({
                          error: false,
                          user,
                          type: 'profile',
                        }),
                        '*'
                      );
                    }}
                  >
                    View Profile
                  </Button>
                  <Button
                    onClick={() => {
                      window.top.postMessage(
                        JSON.stringify({
                          error: false,
                          user,
                          type: 'post',
                        }),
                        '*'
                      );
                    }}
                  >
                    View Post
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainerDiv>
  );
};

export default Users;
