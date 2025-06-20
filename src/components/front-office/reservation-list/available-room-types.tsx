import { useState, useEffect } from "react";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { Button, Typography, CircularProgress, Paper, Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import { useIntl } from "react-intl";
import Draggable from "react-draggable";

import CustomTable from "components/common/custom-table";
import { RoomTypeAPI } from "lib/api/room-type";
import { styled } from "@mui/material/styles";

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({    
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 600,
        background: "white",
        border: "none",
        borderRadius: 8,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        padding: 0,
        overflow: "hidden",
        position: "absolute",
        left: 0,
        cursor: "move",
    },
    [`& .${tooltipClasses.popper}`]: {
        position: "absolute",
        left: 0,
        zIndex: 1500,
    }
});

const DraggableDialog = ({ open, onClose, title, children, positionX, positionY }: any) => {
    const nodeRef = React.useRef(null);
    const [position, setPosition] = React.useState({
        x: 0,
        y: 0
    });
        React.useEffect(() => {
        if (open) {
            const initialX = positionX ? positionX - (window.innerWidth / 2) + 300 : 0; 
            const initialY = positionY ? positionY - 100 : 0;
            setPosition({ x: initialX, y: initialY });
        }
    }, [open, positionX, positionY]);
    
    if (!open) return null;
    
    return (
        <Draggable 
            nodeRef={nodeRef} 
            handle="#draggable-dialog-title" 
            position={position}
            onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}>
            <Paper 
                ref={nodeRef}
                elevation={3} 
                sx={{ 
                    position: 'absolute',
                    zIndex: 1500,
                    width: 600,
                    maxHeight: '80vh',
                    overflow: 'hidden',
                    borderRadius: 2,
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
                        {/* Removed DragIndicatorIcon */}
                        <Typography variant="subtitle1" fontWeight="600">
                            {title}
                        </Typography>
                    </Box>
                    <Button 
                        onClick={onClose} 
                        sx={{ minWidth: 'auto', p: 0.5, color: 'white' }}
                    >
                        <CloseIcon fontSize="small" />
                    </Button>
                </Box>
                <Box sx={{ maxHeight: 'calc(80vh - 60px)', overflow: 'auto' }}>
                    {children}
                </Box>
            </Paper>
        </Draggable>
    );
};

const NewEdit = ({ ArrivalDate, DepartureDate }: any) => {
    const intl = useIntl();
    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogPosition, setDialogPosition] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });

    const columns = [
        {
            title: "№",
            key: "test",
            dataIndex: "test",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderRoomType",
            }),
            key: "RoomTypeFullName",
            dataIndex: "RoomTypeFullName",
        },
        {
            title: intl.formatMessage({
                id: "MenuReportAvailableRooms",
            }),
            key: "AvailableRooms",
            dataIndex: "AvailableRooms",
        },
    ];

    useEffect(() => {
        const fetchDatas = async () => {
            setLoading(true);
            try {
                let tempData = await RoomTypeAPI.listAvailable({
                    StartDate: ArrivalDate,
                    EndDate: DepartureDate,
                });
                setData(tempData);
            } catch (error) {
                console.error("Error fetching room types:", error);
            } finally {
                setLoading(false);
            }
        };

        if (ArrivalDate && DepartureDate) {
            fetchDatas();
        }
    }, [ArrivalDate, DepartureDate]);

    const handleDialogToggle = (event?: React.MouseEvent) => {
        if (event) {
            // Set position relative to the click event
            const buttonRect = event.currentTarget.getBoundingClientRect();
            // Calculate position considering the viewport dimensions
            // This ensures the dialog appears in a good position relative to the button
            // while still allowing infinite dragging in any direction
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Position the dialog near the button but ensure it's visible
            const dialogWidth = 600; // Width of the dialog
            const dialogHeight = 400; // Approximate height of the dialog
            
            // Calculate optimal position
            let xPos = buttonRect.left;
            let yPos = buttonRect.bottom + 10;
            
            // Adjust if too close to right edge
            if (xPos + dialogWidth > viewportWidth) {
                xPos = Math.max(0, viewportWidth - dialogWidth - 20);
            }
            
            // Adjust if too close to bottom edge
            if (yPos + dialogHeight > viewportHeight) {
                yPos = Math.max(0, buttonRect.top - dialogHeight - 10);
            }
            
            setDialogPosition({
                x: xPos,
                y: yPos
            });
        }
        setDialogOpen(!dialogOpen);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    return (
        <Box className="absolute ml-3 z-[1002]">
            {/* Draggable Dialog */}
            <DraggableDialog
                open={dialogOpen}
                onClose={handleClose}
                positionX={dialogPosition.x}
                positionY={dialogPosition.y}
                title={intl.formatMessage({
                    id: "MenuReportAvailableRooms",
                })}
            >
                <Box sx={{ p: 2 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress size={40} thickness={4} />
                        </Box>
                    ) : !data || (Array.isArray(data) && data.length === 0) ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {intl.formatMessage({
                                    id: "NoDataAvailable",
                                }) || "No data available"}
                            </Typography>
                        </Box>
                    ) : (
                        <CustomTable
                            columns={columns}
                            data={data}
                            hasNew={false}
                            hasUpdate={false}
                            hasDelete={false}
                            hasShow={false}
                            id="RoomTypeID"
                            excelName={intl.formatMessage({
                                id: "MenuReportAvailableRooms",
                            })}
                            datagrid={false}
                            hasPrint={false}
                            hasExcel={false}
                        />
                    )}
                </Box>
            </DraggableDialog>

            {/* Button to toggle dialog */}
            <Button 
                variant="outlined" 
                color="primary" 
                size="medium"
                startIcon={<InfoOutlinedIcon />}
                onClick={(e) => handleDialogToggle(e)}
                sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                }}
            >
                {intl.formatMessage({
                    id: "MenuReportAvailableRooms",
                })}
            </Button>
        </Box>
    );
};

export default NewEdit;
