import ToggleChecked from "components/common/custom-switch";
import CustomTable from "components/common/custom-table";
import { PictureSWR, PictureAPI, listUrl } from "lib/api/picture";
import Tooltip from "@mui/material/Tooltip";
import CustomPicture from "components/common/custom-picture";
import CustomUpload from "components/common/custom-upload";

const columns = [
    {
        title: "Зураг",
        key: "PictureFile",
        dataIndex: "PictureFile",
        render: function render(id: any, value: any, element: any) {
            return (
                <CustomPicture
                    src={element.PictureFile}
                    name={element.PictureName}
                />
            );
        },
    },
];

const BankAccountList = () => {
    const { data, error } = PictureSWR({ IsBanner: true });

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={PictureAPI}
                hasNew={true}
                hasUpdate={false}
                hasDelete={false}
                id="PictureID"
                listUrl={listUrl}
                modalTitle="Banner"
                modalContent={
                    <CustomUpload
                        IsBanner={true}
                        listUrl={listUrl}
                        mutateBody={{ IsBanner: true }}
                    />
                }
                excelName="Banner"
            />
        </>
    );
};

export default BankAccountList;
