import { useEffect } from "react";
import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import {
    CustomerGroupSWR,
    CustomerGroupAPI,
    listUrl,
} from "lib/api/customer-group";
import { useIntl } from "react-intl";
import NewEdit from "./new-edit";

const CustomerGroupList = ({ title, setHasData = null }: any) => {
    const intl = useIntl();
    const { data, error } = CustomerGroupSWR();
    useEffect(() => {
        if (data && data.length > 0 && setHasData) {
            setHasData(true);
        }
    }, [data]);

    const columns = [
        {
            title: intl.formatMessage({ id: "RowHeaderGroupName" }),
            key: "CustomerGroupName",
            dataIndex: "CustomerGroupName",
        },
        {
            title: intl.formatMessage({ id: "ReportStatus" }),
            key: "Status",
            dataIndex: "Status",
            excelRenderPass: true,
            renderCell: (element: any) => {
                return (
                    <ToggleChecked
                        id={element.id}
                        checked={element.row.Status}
                        api={CustomerGroupAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                    />
                );
            },
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={CustomerGroupAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="CustomerGroupID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default CustomerGroupList;
