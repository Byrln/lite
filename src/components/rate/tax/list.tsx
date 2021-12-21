import CustomTable from "components/common/custom-table";
import { TaxSWR, TaxAPI, listUrl } from "lib/api/tax";
import NewEdit from "./new-edit";

const TaxList = () => {
    const { data, error } = TaxSWR();

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
        { title: "Status", key: "Status", dataIndex: "Status" },
    ];

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
            modalTitle="Татвар"
            modalContent={<NewEdit />}
        />
    );
};

export default TaxList;
