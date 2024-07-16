import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import CustomTable from "components/common/custom-table";
import { PictureAPI, listUrl } from "lib/api/picture";
import CustomPicture from "components/common/custom-picture";
import CustomUpload from "components/common/custom-upload";


const BankAccountList = () => {
    const intl = useIntl();
    const [entity, setEntity]: any = useState(null);
    const columns = [
        {
            title: intl.formatMessage({id:"TextPicture"}), 
            key: "PictureFile", 
            dataIndex: "PictureFile",
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
    
    const fetchDatas = async () => {
        try {
            const arr: any = await PictureAPI.get({ IsBanner: true });
            if (arr) {
                setEntity(arr);
            }
        } finally {
        }
    };

    useEffect(() => {
        fetchDatas();
    }, []);

    return (
        <>
            <CustomTable
                columns={columns}
                data={entity}
                api={PictureAPI}
                hasNew={true}
                hasUpdate={false}
                hasShow={false}
                hasDelete={true}
                id="PictureID"
                listUrl={listUrl}
                modalTitle="Banner"
                modalContent={
                    <CustomUpload
                        IsBanner={true}
                        listUrl={listUrl}
                        mutateBody={{ IsBanner: true }}
                        functionAfterSubmit={fetchDatas}
                    />
                }
                excelName="Banner"
                functionAfterSubmit={fetchDatas}
            />
        </>
    );
};

export default BankAccountList;
