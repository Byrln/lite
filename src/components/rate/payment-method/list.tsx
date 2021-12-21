import CustomTable from "components/common/custom-table";
import {
    PaymentMethodSWR,
    PaymentMethodAPI,
    listUrl,
} from "lib/api/payment-method";
import NewEdit from "./new-edit";

const PaymentMethodList = () => {
    const { data, error } = PaymentMethodSWR();

    const columns = [
        {
            title: "Group Name",
            key: "PaymentMethodGroupName",
            dataIndex: "PaymentMethodGroupName",
        },

        {
            title: "Payment Method",
            key: "PaymentMethodName",
            dataIndex: "PaymentMethodName",
        },
        {
            title: "Status",
            key: "Status",
            dataIndex: "Status",
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
            modalTitle="Төлбөрийн хэлбэр"
            modalContent={<NewEdit />}
        />
    );
};

export default PaymentMethodList;
