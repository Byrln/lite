import { format } from "date-fns";
import { useIntl } from "react-intl";
import CustomTable from "components/common/custom-table";
import {
    HotelSettingSWR,
    HotelSettingAPI,
    listUrl,
} from "lib/api/hotel-setting";
import { formatPrice } from "lib/utils/helpers";
import NewEdit from "./new-edit";
import ToggleChecked from "components/common/custom-switch";


const HotelSettingList = ({ title }: any) => {
    const intl = useIntl();
    const { data, error } = HotelSettingSWR();
    const columns = [
        {
            title: intl.formatMessage({id:"RowHeaderHotelCode"}), 
            key: "RowHeaderHotelCode",
            dataIndex: "RowHeaderHotelCode",
        },
        {
            title: intl.formatMessage({id:"RowHeaderHotelName"}), 
            key: "RowHeaderHotelName",
            dataIndex: "RowHeaderHotelName",
        },
        {
            title: intl.formatMessage({id:"TextRoomCount"}), 
            key: "TextRoomCount",
            dataIndex: "TextRoomCount",
        },
        {
            title: intl.formatMessage({id:"TextPMSStart"}), 
            key: "TextPMSStart",
            dataIndex: "TextPMSStart",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    element.row.PMSStart &&
                    format(
                        new Date(element.row.PMSStart.replace(/ /g, "T")),
                        "MM/dd/yyyy"
                    )
                );
            },
        },
        {
            title: intl.formatMessage({id:"TextPMSEnd"}), 
            key: "TextPMSEnd",
            dataIndex: "TextPMSEnd",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    element.row.PMSEnd &&
                    format(
                        new Date(element.row.PMSEnd.replace(/ /g, "T")),
                        "MM/dd/yyyy"
                    )
                );
            },
        },
        {
            title: intl.formatMessage({id:"TextBookingEngine"}), 
            key: "TextBookingEngine",
            dataIndex: "TextBookingEngine",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.BookingEngine}
                        disabled={true}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({id:"TextCommission"}), 
            key: "TextCommission",
            dataIndex: "TextCommission",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    element.row.RoomChargeDuration &&
                    formatPrice(element.row.RoomChargeDuration)
                );
            },
        },
        {
            title: intl.formatMessage({id:"RowHeaderPackageName"}), 
            key: "RowHeaderPackageName",
            dataIndex: "RowHeaderPackageName",
        },
    ];
    
    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={HotelSettingAPI}
            hasNew={false}
            hasUpdate={true}
            hasDelete={false}
            id="HotelID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default HotelSettingList;
