import moment from "moment";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useIntl } from "react-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Stack from "@mui/material/Stack";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { mutate } from "swr";
import { toast } from "react-toastify";

import CustomSearch from "components/common/custom-search";
import CustomTable from "components/common/custom-table";
import { RoomBlockSWR, RoomBlockAPI, listUrl } from "lib/api/room-block";
import NewEdit from "./new-edit";
import Search from "./search";
import Typography from "@mui/material/Typography";

const RoomBlockList = ({ title, workingDate }: any) => {
    const [entity, setEntity] = useState<any>({});
    const intl = useIntl();
    const [rerenderKey, setRerenderKey] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState({
        StartDate: moment(workingDate).format("YYYY-MM-DD"),
        EndDate: moment(workingDate).add(15, "days").format("YYYY-MM-DD"),
    });
    const { data, error } = RoomBlockSWR(search);

    useEffect(() => {
        if (data) {
            setEntity(data);
        }
    }, [data]);

    const validationSchema = yup.object().shape({
        StartDate: yup.string().nullable(),
        EndDate: yup.string().nullable(),
        RoomID: yup.string().nullable(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm(formOptions);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        reset({
            StartDate: moment(workingDate).format("YYYY-MM-DD"),
            EndDate: moment(workingDate).add(1, "days").format("YYYY-MM-DD"),
        });
    }, []);

    const handleDelete = async () => {
        setLoading(true);

        try {
            // Process room block updates sequentially to avoid database deadlocks
            for (const room of entity) {
                if (room.isChecked == true) {
                    const tempValues = {
                        RoomBlockID: room.RoomBlockID,
                        Status: false,
                    };
                    await RoomBlockAPI.updateStatus(tempValues);
                }
            }

            await mutate(listUrl);

            toast("Өрөөний блок болив.");

            setLoading(false);
            handleClose();
        } catch {
            setLoading(false);
            handleClose();
        }
    };

    const onCheckboxChange = (e: any) => {
        let tempEntity = [...entity];
        tempEntity.forEach(
            (element: any) => (element.isChecked = e.target.checked)
        );
        setEntity(tempEntity);
        setRerenderKey((prevKey) => prevKey + 1);
    };

    const columns = [
        {
            title: "№",
            key: "test",
            dataIndex: "test",
        },
        {
            title: intl.formatMessage({ id: "ReportCheck" }),
            key: "check",
            dataIndex: "check",
            withCheckBox: true,
            onChange: onCheckboxChange,
            render: function render(
                id: any,
                value: any,
                element: any,
                dataIndex: any
            ) {
                return (
                    <Checkbox
                        key={rerenderKey}
                        checked={
                            entity &&
                            entity[dataIndex] &&
                            entity[dataIndex].isChecked
                        }
                        onChange={(e: any) => {
                            let tempEntity = [...entity];
                            tempEntity[dataIndex].isChecked = e.target.checked;
                            setEntity(tempEntity);
                        }}
                    />
                );
            },
        },
        {
            title: intl.formatMessage({ id: "MenuRooms" }),
            key: "RoomFullName",
            dataIndex: "RoomFullName",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderBeginDate" }),
            key: "BeginDate",
            dataIndex: "BeginDate",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderEndDate" }),
            key: "EndDate",
            dataIndex: "EndDate",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderBlockedOn" }),
            key: "RowHeaderBlockedOn",
            dataIndex: "RowHeaderBlockedOn",
        },
        {
            title: intl.formatMessage({ id: "RowHeaderBlockedBy" }),
            key: "CreatedDate",
            dataIndex: "CreatedDate",
        },
        {
            title: intl.formatMessage({ id: "ConfigReasons" }),
            key: "UserName",
            dataIndex: "UserName",
        },
    ];

    return (
        <>
            {moment(workingDate).format("YYYY-MM-DD") +
                " - " +
                moment(workingDate).add(1, "days").format("YYYY-MM-DD")}
            <CustomTable
                columns={columns}
                data={data}
                error={error}
                api={RoomBlockAPI}
                hasNew={true}
                //hasUpdate={true}
                //hasDelete={true}
                id="RoomBlockID"
                listUrl={listUrl}
                modalTitle={title}
                modalContent={<NewEdit />}
                excelName={title}
                datagrid={false}
                search={
                    <CustomSearch
                        listUrl={listUrl}
                        search={search}
                        setSearch={setSearch}
                        handleSubmit={handleSubmit}
                        reset={reset}
                    >
                        <Search
                            register={register}
                            errors={errors}
                            control={control}
                            reset={reset}
                        />
                    </CustomSearch>
                }
                additionalButtons={
                    <>
                        <Button
                            disabled={loading}
                            variant="outlined"
                            onClick={handleClickOpen}
                            className="mr-3"
                        >
                            Өр.Блок болих
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            {/*<DialogTitle id="alert-dialog-title" className=""></DialogTitle>*/}
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <HelpOutlineIcon />
                                        <Typography>
                                            Та итгэлтэй байна уу?
                                        </Typography>
                                    </Stack>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Үгүй</Button>
                                <LoadingButton
                                    loading={loading}
                                    onClick={handleDelete}
                                    autoFocus
                                >
                                    Тийм
                                </LoadingButton>
                            </DialogActions>
                        </Dialog>
                    </>
                }
            />
        </>
    );
};

export default RoomBlockList;
