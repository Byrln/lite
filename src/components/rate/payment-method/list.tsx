import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { useIntl } from "react-intl";
import {
    PaymentMethodSWR,
    PaymentMethodAPI,
    listUrl,
} from "lib/api/payment-method";
import NewEdit from "./new-edit";


const PaymentMethodList = ({ title }: any) => {
    const intl = useIntl();
    const { data, error } = PaymentMethodSWR();
    const columns = [
        {
            title: intl.formatMessage({id:"ReportGroupName"}), 
            key: "ReportGroupName",
            dataIndex: "ReportGroupName",
        },
    
        {
            title: intl.formatMessage({id:"ConfigPaymentMethod"}), 
            key: "ConfigPaymentMethod",
            dataIndex: "ConfigPaymentMethod",
        },
        {
            title: intl.formatMessage({id:"ReportStatus"}), 
            key: "ReportStatus",
            dataIndex: "ReportStatus",
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
