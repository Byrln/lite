import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { TaxSWR, TaxAPI, listUrl } from "lib/api/tax";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Tax Code",
        key: "TaxCode",
        dataIndex: "TaxCode",
    },
    {
        title: "Tax Name",
        key: "TaxName",
        dataIndex: "TaxName",
    },
    {
        title: "Status",
        key: "Status",
        dataIndex: "Status",
        render: function render(id: any, value: any) {
            return (
                <ToggleChecked
                    id={id}
                    checked={value}
                    api={TaxAPI}
                    apiUrl="UpdateStatus"
                    mutateUrl={`${listUrl}`}
                />
            );
        },
    },
];

const TaxList = ({ title }: any) => {
    const { data, error } = TaxSWR();

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={TaxAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="TaxID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default TaxList;
