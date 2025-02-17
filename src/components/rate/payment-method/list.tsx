import { useEffect } from "react";

import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { useIntl } from "react-intl";
import {
    PaymentMethodSWR,
    PaymentMethodAPI,
    listUrl,
} from "lib/api/payment-method";
import NewEdit from "./new-edit";

const PaymentMethodList = ({ title, setHasData = null }: any) => {
    const intl = useIntl();
    const { data, error } = PaymentMethodSWR();

    useEffect(() => {
        if (data && data.length > 0 && setHasData) {
            setHasData(true);
        }
    }, [data]);

    const columns = [
        {
            title: intl.formatMessage({ id: "ReportGroupName" }),
            key: "PaymentMethodGroupName",
            dataIndex: "PaymentMethodGroupName",
        },

        {
            title: intl.formatMessage({ id: "ConfigPaymentMethod" }),
            key: "PaymentMethodName",
            dataIndex: "PaymentMethodName",
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
                        api={PaymentMethodAPI}
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
            api={PaymentMethodAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="PaymentMethodID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default PaymentMethodList;
