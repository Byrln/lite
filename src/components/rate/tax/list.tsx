import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { TaxSWR, TaxAPI, listUrl } from "lib/api/tax";
import NewEdit from "./new-edit";

const columns = [
    {
        title: "Татварын код",
        key: "TaxCode",
        dataIndex: "TaxCode",
    },
    {
        title: "Татварын нэр",
        key: "TaxName",
        dataIndex: "TaxName",
    },
    {
        title: "Төлөв",
        key: "Status",
        dataIndex: "Status",
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (
                <ToggleChecked
                    id={element.id}
                    checked={element.row.Status}
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
