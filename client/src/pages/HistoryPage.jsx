import React, { useContext, useEffect, useState } from 'react';
import { HistoryContext } from '../context/HistoryContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  TablePagination,
  Alert,
  useTheme
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import NoResultsFound from '../components/NoResultsFound';

const HistoryPage = () => {
  const theme = useTheme();
  const { darkMode } = useContext(ThemeContext);
  const { scans, loading, error, getHistory, deleteScan, downloadScan } = useContext(HistoryContext);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Debug state
  const [debugError, setDebugError] = useState(null);

  useEffect(() => {
    try {
      getHistory();
    } catch (err) {
      console.error("Error fetching history:", err);
    }
    // eslint-disable-next-line
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    try {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleString(undefined, options);
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const truncateUrl = (url) => {
    if (!url) return 'N/A';
    return url.length > 40 ? `${url.substring(0, 40)}...` : url;
  };

  // Safety function to process data with error handling
  const getSafeData = () => {
    try {
      // Ensure we have valid scans data
      if (!scans) {
        setDebugError("Scans data is null or undefined");
        return [];
      }
      
      // Handle case where scans might be an object with data property
      if (typeof scans === 'object' && !Array.isArray(scans) && scans.data) {
        return Array.isArray(scans.data) ? scans.data : [];
      }
      
      // Handle normal array case
      if (Array.isArray(scans)) {
        return scans;
      }
      
      // Last resort - try to convert to array if possible
      if (scans && typeof scans === 'object') {
        const possibleArray = Object.values(scans);
        if (Array.isArray(possibleArray) && possibleArray.length > 0 && typeof possibleArray[0] === 'object') {
          return possibleArray;
        }
      }
      
      setDebugError(`Unknown scans data format: ${typeof scans}`);
      return [];
    } catch (e) {
      setDebugError(`Error processing scans data: ${e.message}`);
      return [];
    }
  };

  // Get safe data for rendering
  const scansList = getSafeData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || debugError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          {error || debugError}
          {debugError && (
            <Typography variant="caption" component="div" sx={{ mt: 1 }}>
              Scans data type: {typeof scans}, 
              Is Array: {Array.isArray(scans).toString()}, 
              Data: {JSON.stringify(scans).substring(0, 100)}...
            </Typography>
          )}
        </Alert>
      </Container>
    );
  }

  if (scansList.length === 0) {
    return <NoResultsFound message="No scan history found" />;
  }

  // Safely extract paginated data
  const getPaginatedData = () => {
    try {
      const start = page * rowsPerPage;
      const end = start + rowsPerPage;
      
      // Guard against invalid indices
      if (start >= scansList.length) {
        return [];
      }
      
      return scansList.slice(start, end);
    } catch (e) {
      setDebugError(`Pagination error: ${e.message}`);
      return [];
    }
  };

  const paginatedData = getPaginatedData();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{
          p: 3,
          borderRadius: 2,
          transition: 'all 0.3s ease-in-out',
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Scan History
        </Typography>

        <TableContainer component={Paper} sx={{ boxShadow: 'none', bgcolor: 'transparent' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>URL</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Results Summary</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((scan, index) => (
                <TableRow key={scan?._id || index} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon fontSize="small" color="action" />
                      {formatDate(scan?.scanDate)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinkIcon fontSize="small" color="action" />
                      <Tooltip title={scan?.url || 'N/A'}>
                        <Typography sx={{ 
                          maxWidth: 300, 
                          textOverflow: 'ellipsis', 
                          overflow: 'hidden', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {truncateUrl(scan?.url)}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {(scan?.scanResults?.scanSummary?.vulnerabilitiesFound || 0)} vulnerabilities detected
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Download Results">
                        <IconButton 
                          onClick={() => downloadScan(scan)}
                          sx={{ 
                            color: theme.palette.primary.main,
                            '&:hover': { 
                              bgcolor: theme.palette.primary.main + '20',
                            } 
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => deleteScan(scan?._id)}
                          sx={{ 
                            color: theme.palette.error.main,
                            '&:hover': { 
                              bgcolor: theme.palette.error.main + '20',
                            } 
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={scansList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default HistoryPage;