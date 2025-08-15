import React from 'react';
import { Container, Paper } from '@mui/material';
import DraggableDataGridExample from '../components/common/draggable-data-grid-example';

const DraggableTableDemo = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ borderRadius: 2 }}>
        <DraggableDataGridExample />
      </Paper>
    </Container>
  );
};

export default DraggableTableDemo;