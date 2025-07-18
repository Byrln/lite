import * as React from "react";
import { Paper, Box, Typography, Button, IconButton, Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable";

interface DraggableDialogProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  positionX?: number | null;
  positionY?: number | null;
  width?: number | string;
  maxHeight?: string;
  className?: string;
  hideBackdrop?: boolean;
}

/**
 * A draggable dialog component that can be moved infinitely in any direction.
 * 
 * @param open - Whether the dialog is open
 * @param onClose - Function to call when the dialog is closed
 * @param title - The title of the dialog
 * @param children - The content of the dialog
 * @param positionX - Initial X position of the dialog
 * @param positionY - Initial Y position of the dialog
 * @param width - Width of the dialog (default: 600px)
 * @param maxHeight - Maximum height of the dialog (default: 80vh)
 * @param className - Additional CSS class name
 */
const DraggableDialog: React.FC<DraggableDialogProps> = ({
  open,
  onClose,
  title,
  children,
  positionX,
  positionY,
  width = 600,
  maxHeight = '80vh',
  className,
  hideBackdrop = true,
}) => {
  // Create a ref for the draggable node
  const nodeRef = React.useRef(null);
  
  // Track position state for the dialog
  const [position, setPosition] = React.useState({
    x: 0,
    y: 0
  });
  
  // Initialize or reset position when dialog opens with new coordinates
  React.useEffect(() => {
    if (open) {
      // Calculate initial position based on provided coordinates
      // For proper positioning, we need to convert the absolute positions to relative positions
      // that Draggable component can use
      const initialX = positionX ? positionX - (window.innerWidth / 2) + (typeof width === 'number' ? width/2 : 300) : 0;
      const initialY = positionY ? positionY - 100 : 0; // 100 is an approximate offset
      
      setPosition({ x: initialX, y: initialY });
    }
  }, [open, positionX, positionY, width]);
  
  if (!open) return null;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      hideBackdrop={hideBackdrop}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          margin: 0,
          padding: 0,
          overflow: 'visible',
          pointerEvents: 'none',
        },
      }}
      sx={{ 
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
      }}
    >
      <Draggable 
        nodeRef={nodeRef} 
        handle="#draggable-dialog-title" 
        position={position}
        onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
        // No bounds to allow infinite movement
      >
        <Paper 
          ref={nodeRef}
          elevation={3} 
          className={className}
          sx={{ 
            position: 'absolute',
            zIndex: 1500,
            width: width,
            maxHeight: maxHeight,
            overflow: 'hidden',
            borderRadius: 2,
            pointerEvents: 'auto',
          }}
        >
        <Box 
          id="draggable-dialog-title"
          sx={{ 
            p: 2, 
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'move',
            bgcolor: 'primary.main',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="600">
              {title}
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: 'white',
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
            size="medium"
            aria-label="close"
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>
        <Box sx={{ maxHeight: `calc(${maxHeight} - 60px)`, overflow: 'auto' }}>
          {children}
        </Box>
      </Paper>
    </Draggable>
    </Dialog>
  );
};

export default DraggableDialog;