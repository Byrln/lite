import { useIntl } from "react-intl";

import CustomTable from "components/common/custom-table";
import {
    GuestHistorySWR,
    GuestdatabaseAPI,
    listUrl,
} from "lib/api/guest-database";
import NewEdit from "./new-edit";
import { useAppState } from "lib/context/app";
import { formatPrice } from "lib/utils/helpers";

const GuestHistory = ({ title }: any) => {
    const intl = useIntl();
    const [state]: any = useAppState();

    const { data, error } = GuestHistorySWR(state.editId);

    const columns = [
        {
            title: intl.formatMessage({
                id: "RowHeaderArrival",
            }),
            key: "ArrivedDate",
            dataIndex: "ArrivedDate",
        },
        {
            title: intl.formatMessage({
                id: "RowHeaderDeparture",
            }),
            key: "DepartedDate",
            dataIndex: "DepartedDate",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderCheckInNo" }),
            key: "RegNo",
            dataIndex: "RegNo",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderRoom" }),
            key: "RoomFullName",
            dataIndex: "RoomFullName",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderPaid" }),
            key: "Paid",
            dataIndex: "Paid",
            renderCell: (element: any) => {
                return formatPrice(element.row.Paid ? element.row.Paid : 0);
            },
        },

        {
            title: intl.formatMessage({ id: "RowHeaderStatus" }),
            key: "StatusDesc",
            dataIndex: "StatusDesc",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderUser" }),
            key: "UserName",
            dataIndex: "UserName",
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={GuestdatabaseAPI}
            // hasNew={true}
            // hasUpdate={true}
            //hasDelete={true}
            id="TransactionID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default GuestHistory;
