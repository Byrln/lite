import CustomTable from "components/common/custom-table";
import { GuestSWR, GuestAPI, listUrl } from "lib/api/guest";
import GuestSelect from "./guest-select";
import NewEdit from "./new-edit";
import { Button } from "@mui/material";
import { ModalContext } from "lib/context/modal";
import { useContext, useState } from "react";

const GuestList = () => {
    const { data, error } = GuestSWR({});
    const { handleModal }: any = useContext(ModalContext);
    const [idEditing, setIdEditing]: any = useState(null);

    const columns = [
        { title: "GuestID", key: "GuestID", dataIndex: "GuestID" },
        { title: "GuestTitle", key: "GuestTitle", dataIndex: "GuestTitle" },
        { title: "Name", key: "Name", dataIndex: "Name" },
        { title: "Surname", key: "Surname", dataIndex: "Surname" },
        { title: "FullName", key: "GuestFullName", dataIndex: "GuestFullName" },
        {
            title: "IdentityTypeID",
            key: "IdentityTypeID",
            dataIndex: "IdentityTypeID",
        },
        { title: "IDTypeName", key: "IDTypeName", dataIndex: "IDTypeName" },
        {
            title: "IdentityValue",
            key: "IdentityValue",
            dataIndex: "IdentityValue",
        },
        { title: "GenderID", key: "GenderID", dataIndex: "GenderID" },
        { title: "Gender", key: "Gender", dataIndex: "Gender" },
        { title: "Mobile", key: "Mobile", dataIndex: "Mobile" },
        { title: "Email", key: "Email", dataIndex: "Email" },
        { title: "Status", key: "Status", dataIndex: "Status" },
    ];

    return (
        <>
            <Button
                variant="outlined"
                className="mr-3"
                onClick={() => {
                    handleModal(true, "Зочин сонгох", <GuestSelect />);
                }}
            >
                Сонгох
            </Button>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={GuestAPI}
                hasNew={true}
                hasUpdate={true}
                hasDelete={true}
                id="GuestID"
                setIdEditing={setIdEditing}
                listUrl={listUrl}
                modalTitle="Зочин бүртгэл"
                modalContent={<NewEdit idEditing={idEditing} />}
            />
        </>
    );
};

export default GuestList;
