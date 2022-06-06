import { format } from "date-fns";

import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { SeasonSWR, SeasonAPI, listUrl } from "lib/api/season";
import NewEdit from "./new-edit";

const SeasonList = ({ title }: any) => {
    const { data, error } = SeasonSWR();

    const columns = [
        { title: "Season Name", key: "SeasonName", dataIndex: "SeasonName" },
        {
            title: "From",
            key: "BeginDayMonth",
            dataIndex: "BeginDayMonth",
        },
        {
            title: "To",
            key: "EndDayMonth",
            dataIndex: "EndDayMonth",
        },
        {
            title: "Begin Date",
            key: "BeginDate",
            dataIndex: "BeginDate",
            render: function render(id: any, value: any) {
                return (
                    value &&
                    format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
                );
            },
        },
        {
            title: "End Date",
            key: "EndDate",
            dataIndex: "EndDate",
            render: function render(id: any, value: any) {
                return (
                    value &&
                    format(new Date(value.replace(/ /g, "T")), "MM/dd/yyyy")
                );
            },
        },
        { title: "Priority", key: "Priority", dataIndex: "Priority" },
        {
            title: "Status",
            key: "Status",
            dataIndex: "Status",
            render: function render(id: any, value: boolean) {
                return (
                    <ToggleChecked
                        id={id}
                        checked={value}
                        api={SeasonAPI}
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
            api={SeasonAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="SeasonID"
            listUrl={listUrl}
            modalTitle={title}
            modalContent={<NewEdit />}
            excelName={title}
        />
    );
};

export default SeasonList;
