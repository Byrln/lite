import CustomTable from "components/common/custom-table";
import { GuestSWR, GuestAPI, listUrl } from "lib/api/guest";
import NewEdit from "./new-edit";

const GuestList = () => {
    const { data, error } = GuestSWR();

    const columns = [
        { title: "GuestID", key: "GuestID", dataIndex: "GuestID" },
        { title: "GuestTitle", key: "GuestTitle", dataIndex: "GuestTitle" },
        { title: "Name", key: "Name", dataIndex: "Name" },
        { title: "Surname", key: "Surname", dataIndex: "Surname" },
        { title: "FullName", key: "GuestFullName", dataIndex: "GuestFullName" },
        { title: "IDTypeName", key: "IDTypeName", dataIndex: "IDTypeName" },
        {
            title: "IdentityValue",
            key: "IdentityValue",
            dataIndex: "IdentityValue",
        },
        { title: "Gender", key: "Gender", dataIndex: "Gender" },
        { title: "Mobile", key: "Mobile", dataIndex: "Mobile" },
        { title: "Email", key: "Email", dataIndex: "Email" },
        { title: "Status", key: "Status", dataIndex: "Status" },
    ];

    return (
        <CustomTable
            columns={columns}
            data={data}
            error={error}
            api={GuestAPI}
            hasNew={true}
            hasUpdate={true}
            hasDelete={true}
            id="GuestID"
            listUrl={listUrl}
            modalTitle="Зочин бүртгэл"
            modalContent={<NewEdit />}
        />
    );
};

export default GuestList;
