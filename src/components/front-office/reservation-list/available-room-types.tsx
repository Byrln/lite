import { useState, useEffect } from "react";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { Button, Typography } from "@mui/material";
import * as React from "react";
import { useIntl } from "react-intl";

import CustomTable from "components/common/custom-table";
import { RoomTypeAPI } from "lib/api/room-type";
import { styled } from "@mui/material/styles";

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
        background: "white",
        border: "rgba(0, 0, 0, .2) 1px solid",
        overflow: "scroll",
    },
});

const NewEdit = ({ ArrivalDate, DepartureDate }: any) => {
    const intl = useIntl();
    const [data, setData] = useState(null);

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
            try {
                let tempData = await RoomTypeAPI.listAvailable({
                    StartDate: ArrivalDate,
                    EndDate: DepartureDate,
                });
                setData(tempData);
            } finally {
            }
        };

        fetchDatas();
    }, [ArrivalDate, DepartureDate]);

    return (
        <div className="mr-3">
            <CustomWidthTooltip
                title={
                    <React.Fragment>
                        <div>
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
                        </div>
                    </React.Fragment>
                }
            >
                <Button>
                    {intl.formatMessage({
                        id: "MenuReportAvailableRooms",
                    })}
                </Button>
            </CustomWidthTooltip>
        </div>
    );
};

export default NewEdit;
