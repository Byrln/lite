import { useEffect, useState } from "react";

import CustomTable from "components/common/custom-table";
import { PictureAPI, listUrl } from "lib/api/picture";
import CustomPicture from "components/common/custom-picture";
import CustomUpload from "components/common/custom-upload";
import { useIntl } from "react-intl";

const BankAccountList = () => {
    const intl = useIntl();
    const [entity, setEntity]: any = useState(null);
    const columns = [
        {
            title: intl.formatMessage({id:"TextPicture"}),     
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
            const arr: any = await PictureAPI.get({
                IsMain: null,
                IsBanner: false,
            });
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
                modalTitle="Main"
                modalContent={
                    <CustomUpload
                        IsBanner={false}
                        IsMain={true}
                        listUrl={listUrl}
                        mutateBody={{ IsMain: null, IsBanner: false }}
                        functionAfterSubmit={fetchDatas}
                    />
                }
                excelName="Main"
                functionAfterSubmit={fetchDatas}
            />
        </>
    );
};

export default BankAccountList;
