import CustomTable from "components/common/custom-table";
import { SeasonSWR, SeasonAPI, listUrl } from "lib/api/season";
import NewEdit from "./new-edit";

const SeasonList = () => {
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
        },
        { title: "End Date", key: "EndDate", dataIndex: "EndDate" },
        { title: "Priority", key: "Priority", dataIndex: "Priority" },
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
            api={SeasonAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="SeasonID"
            listUrl={listUrl}
            modalTitle="Улирал"
            modalContent={<NewEdit />}
        />
    );
};

export default SeasonList;
