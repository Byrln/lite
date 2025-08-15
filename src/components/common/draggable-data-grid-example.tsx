import React, { useState } from 'react';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import DraggableDataGrid from './draggable-data-grid';

// Sample data for demonstration
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active' },
];

// Sample columns configuration
const sampleColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: 'Name',
    key: 'name',
    width: 150,
  },
  {
    title: 'Email',
    key: 'email',
    width: 200,
  },
  {
    title: 'Role',
    key: 'role',
    width: 120,
    render: (id: any, value: string) => (
      <span style={{ 
        padding: '4px 8px', 
        borderRadius: '4px', 
        backgroundColor: value === 'Admin' ? '#e3f2fd' : value === 'Manager' ? '#fff3e0' : '#f3e5f5',
        color: value === 'Admin' ? '#1976d2' : value === 'Manager' ? '#f57c00' : '#7b1fa2'
      }}>
        {value}
      </span>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    width: 100,
    render: (id: any, value: string) => (
      <span style={{ 
        padding: '4px 8px', 
        borderRadius: '4px', 
        backgroundColor: value === 'Active' ? '#e8f5e8' : '#ffebee',
        color: value === 'Active' ? '#2e7d32' : '#c62828'
      }}>
        {value}
      </span>
    ),
  },
];

const DraggableDataGridExample = () => {
  const [data, setData] = useState(sampleData);
  const [useDataGrid, setUseDataGrid] = useState(true);
  const [enableDragDrop, setEnableDragDrop] = useState(true);

  const handleRowReorder = (newData: any[], oldIndex: number, newIndex: number) => {
    console.log('Row reordered:', { newData, oldIndex, newIndex });
    // Here you can make an API call to update the order on the backend
    // For example:
    // api.updateRowOrder({ oldIndex, newIndex, data: newData });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Draggable Data Grid Example
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        This component replicates the exact styling and functionality of CustomTable with added drag-and-drop capabilities.
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useDataGrid}
              onChange={(e) => setUseDataGrid(e.target.checked)}
            />
          }
          label="Use DataGrid Mode"
        />
        
        {!useDataGrid && (
          <FormControlLabel
            control={
              <Switch
                checked={enableDragDrop}
                onChange={(e) => setEnableDragDrop(e.target.checked)}
              />
            }
            label="Enable Drag & Drop"
          />
        )}
      </Box>

      <DraggableDataGrid
        columns={sampleColumns}
        data={data}
        id="id"
        hasNew={true}
        hasUpdate={true}
        hasDelete={true}
        hasMultipleDelete={true}
        hasPrint={true}
        hasExcel={true}
        hasShow={true}
        modalTitle="User"
        modalContent={<div>Modal content would go here</div>}
        excelName="Users"
        datagrid={useDataGrid}
        enableDragDrop={enableDragDrop}
        onRowReorder={handleRowReorder}
        functionAfterSubmit={() => {
          console.log('Action completed');
        }}
        api={{
          delete: async (id: any) => {
            console.log('Delete:', id);
            // Simulate API call
            setData(prev => prev.filter(item => item.id !== id));
          }
        }}
        listUrl="/api/users"
      />

      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Features:
        </Typography>
        <ul>
          <li>✅ Exact same styling as CustomTable component</li>
          <li>✅ All original functionality (CRUD operations, Excel export, Print, etc.)</li>
          <li>✅ DataGrid mode with MUI X DataGrid</li>
          <li>✅ Draggable table mode with @dnd-kit</li>
          <li>✅ Smooth drag animations and visual feedback</li>
          <li>✅ Keyboard accessibility for drag operations</li>
          <li>✅ Row reordering callback for backend updates</li>
          <li>✅ Toggle between DataGrid and Table modes</li>
          <li>✅ Responsive design and mobile support</li>
        </ul>
      </Box>
    </Box>
  );
};

export default DraggableDataGridExample;