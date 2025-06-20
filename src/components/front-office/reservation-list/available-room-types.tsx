import { useState, useEffect } from "react";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { Button, Typography, CircularProgress, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import * as React from "react";
import { useIntl } from "react-intl";

import { RoomTypeAPI } from "lib/api/room-type";
import { styled } from "@mui/material/styles";

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
        background: "white",
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        padding: 16,
        color: "#333",
    },
    [`& .${tooltipClasses.popper}`]: {
        zIndex: 1500,
    }
});



const NewEdit = ({ ArrivalDate, DepartureDate }: any) => {
    const intl = useIntl();
    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);

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

    const renderTooltipContent = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} thickness={4} />
                </Box>
            );
        }

        if (!data || (Array.isArray(data) && data.length === 0)) {
            return (
                <Typography variant="body2" color="text.secondary">
                    {intl.formatMessage({ id: "NoDataAvailable" }) || "No data available"}
                </Typography>
            );
        }

        return (
            <TableContainer className="bg-white rounded-md">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: "white" }}>№</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem',color: "white" }}>
                                {intl.formatMessage({ id: "RowHeaderRoomType" })}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem',color: "white" }}>
                                {intl.formatMessage({ id: "MenuReportAvailableRooms" })}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row: any, index: number) => (
                            <TableRow key={row.RoomTypeID || index}>
                                <TableCell sx={{ fontSize: '0.75rem' }}>{index + 1}</TableCell>
                                <TableCell sx={{ fontSize: '0.75rem' }}>{row.RoomTypeFullName}</TableCell>
                                <TableCell sx={{ fontSize: '0.75rem' }}>{row.AvailableRooms}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box className="absolute ml-3 z-[1002]">
            {renderTooltipContent()}
            {/* <CustomWidthTooltip
                title={renderTooltipContent()}
                placement="bottom-start"
                arrow
            >
                <Button 
                    variant="outlined" 
                    color="primary" 
                    size="medium"
                    startIcon={<InfoOutlinedIcon />}
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
            </CustomWidthTooltip> */}
        </Box>
    );
};

export default NewEdit;
