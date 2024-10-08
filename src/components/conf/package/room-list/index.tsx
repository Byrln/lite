import { useState, useEffect, useContext } from "react";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

import { PackageRoomAPI, listUrl } from "lib/api/package-room";
import CustomTable from "components/common/custom-table";
import { PackageRoomSWR } from "lib/api/package-room";
import { ModalContext } from "lib/context/modal";
import NewEdit from "./new-edit";

const PackageList = ({ title, packageId }: any) => {
    const intl = useIntl();
    const router = useRouter();
    const { data, error } = PackageRoomSWR(packageId);
    const [entity, setEntity] = useState(false);
    const [loading, setLoading] = useState(false);

    const { handleModal }: any = useContext(ModalContext);

    useEffect(() => {
        let i = 0;
        if (data) {
            let tempValue: any = [];
            data.forEach((element: any, key: any) => {
                console.log("keyshuudee", element);
                tempValue.push({
                    ID: i,
                    RoomTypeID: element.RoomTypeID,
                    RoomID: element.RoomID,
                    RateTypeID: element.RateTypeID,
                    Adult: element.Adult,
                    Child: element.Child,
                    RoomRate: element.Rate,
                    RoomRateExtraAdult: element.ExtraAdult,
                    RoomRateExtraChild: element.ExtraChild,
                    RateTypeName: element.RateTypeName,
                    RoomTypeName: element.RoomTypeName,
                });
                i++;
            });
            setEntity(tempValue);
        }
    }, [data]);
    console.log("entity", JSON.stringify(entity));
    const columns = [
        {
            title: "Room Type",
            key: "RoomTypeName",
            dataIndex: "RoomTypeName",
        },
        {
            title: "Rate Type",
            key: "RateTypeName",
            dataIndex: "RateTypeName",
        },
        {
            title: "Rate",
            key: "RoomRate",
            dataIndex: "RoomRate",
        },
        {
            title: "Үйлдэл",
            key: "Action",
            dataIndex: "Action",
            renderCell: (element: any) => {
                console.log("element", element);
                return (
                    <>
                        <Button
                            variant={"outlined"}
                            size="small"
                            onClick={() => {
                                handleModal(
                                    true,
                                    "Засах",
                                    <NewEdit
                                        currentData={element.row}
                                        handleModal={handleModal}
                                        entity={entity}
                                        setEntity={setEntity}
                                        key={element}
                                    />,
                                    null,
                                    "medium"
                                );
                            }}
                        >
                            Засах
                        </Button>
                    </>
                );
            },
        },
    ];

    const onSubmit = async () => {
        try {
            setLoading(true);
            await PackageRoomAPI.new({
                PackageID: packageId,
                FullUpdate: true,
                Items: entity,
            });
            toast("Амжилттай.");
            router.replace("/conf/package");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CustomTable
                columns={columns}
                data={entity}
                error={error}
                api={PackageRoomAPI}
                hasNew={true}
                hasUpdate={false}
                hasShow={false}
                id="ID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={
                    <NewEdit
                        entity={entity}
                        setEntity={setEntity}
                        handleModal={handleModal}
                    />
                }
                excelName={title}
                modalsize="medium"
            />
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    onClick={onSubmit}
                    size="small"
                    className="mt-3"
                >
                    <SaveIcon
                        style={{ fontSize: "0.8125rem" }}
                        className="mr-1"
                    />
                    {intl.formatMessage({ id: "ButtonSave" })}
                </LoadingButton>
            </div>
        </>
    );
};

export default PackageList;
