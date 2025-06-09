import { useEffect } from "react";

import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { useIntl } from "react-intl";
import { TaxSWR, TaxAPI, listUrl } from "lib/api/tax";
import { mutate } from "swr";
import NewEdit from "./new-edit";

const TaxList = ({ title, setHasData = null }: any) => {
    const intl = useIntl();
    const { data, error } = TaxSWR();
    const columns = [
        {
            title: intl.formatMessage({ id: "RowHeaderTaxCode" }),
            key: "TaxCode",
            dataIndex: "TaxCode",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderTaxName" }),
            key: "TaxName",
            dataIndex: "TaxName",
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
                        api={TaxAPI}
                        apiUrl="UpdateStatus"
                        mutateUrl={`${listUrl}`}
                        onSuccess={() => {
                            mutate(listUrl);
                        }}
                    />
                );
            },
        },
    ];

    useEffect(() => {
        if (data && data.length > 0 && setHasData) {
            setHasData(true);
        }
    }, [data]);

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
