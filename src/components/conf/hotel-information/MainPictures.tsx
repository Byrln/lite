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
        excelRenderPass: true,
        renderCell: (element: any) => {
            return (
                <CustomPicture
                    src={element.row.PictureFile}
                    name={element.row.PictureName}
                />
            );
        },
    },
];

const BankAccountList = () => {
    const { data, error } = PictureSWR({ IsMain: true, IsBanner: false });

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={PictureAPI}
                hasNew={true}
                hasUpdate={false}
                hasShow={false}
                hasDelete={true}
                id="PictureID"
                listUrl={listUrl}
                modalTitle="Main"
                modalContent={
                    <CustomUpload
                        IsMain={true}
                        IsBanner={false}
                        listUrl={listUrl}
                        mutateBody={{ IsMain: true }}
                    />
                }
                excelName="Main"
            />
        </>
    );
};

export default BankAccountList;
