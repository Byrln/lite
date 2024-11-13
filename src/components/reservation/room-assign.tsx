import { useContext, useState, useEffect } from "react";
import {
    Checkbox,
    FormControlLabel,
    Grid,
    TextField,
    Menu,
    MenuItem,
} from "@mui/material";
import RoomTypeSelect from "../select/room-type";
import RoomSelect from "../select/room";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { LoadingButton } from "@mui/lab";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ReservationAPI } from "../../lib/api/reservation";
import { mutate } from "swr";
import { listUrl } from "../../lib/api/front-office";
import { toast } from "react-toastify";
import { ModalContext } from "../../lib/context/modal";
import AmendStayForm from "components/reservation/amend-stay";
import CancelReservationForm from "components/reservation/cancel-reservation";
import VoidTransactionForm from "components/reservation/void-transaction";

const RoomAssign = ({
    transactionInfo,
    reservation,
    additionalMutateUrl,
    customRerender,
}: any) => {
    const { handleModal }: any = useContext(ModalContext);
    const [loading, setLoading] = useState(false);
    const [roomAutoAssign, setRoomAutoAssign]: any = useState(false);
    const [baseStay, setBaseStay]: any = useState({
        roomType: {
            RoomTypeID: transactionInfo.RoomTypeID,
        },
        room: {
            RoomID: transactionInfo.RoomID ? transactionInfo.RoomID : null,
        },
        dateStart: new Date(transactionInfo.ArrivalDate),
        dateEnd: new Date(transactionInfo.DepartureDate),
        NewRate: 0,
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event: any, row: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const validationSchema = yup.object().shape({
        TransactionID: yup.number().required("Сонгоно уу"),
        RoomID: yup.number().notRequired(),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        resetField,
    } = useForm(formOptions);

    const onRoomChange = (room: any) => {
        setBaseStay({
            ...baseStay,
            room: room,
        });
    };

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {

            const res = await ReservationAPI.roomAssign(values);

            await mutate(listUrl);
            if (additionalMutateUrl) {
                await mutate(additionalMutateUrl);
            }
            if (customRerender) {
                customRerender();
            }
            toast("Амжилттай.");

            setLoading(false);
            handleModal();
        } catch (error) {
            setLoading(false);
            handleModal();
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="hidden"
                    {...register("TransactionID")}
                    value={transactionInfo.TransactionID}
                />

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <RoomSelect
                            register={register}
                            errors={errors}
                            baseStay={baseStay}
                            onRoomChange={onRoomChange}
                            roomAutoAssign={roomAutoAssign}
                            resetField={resetField}
                            setBaseStay={setBaseStay}
                        />
                    </Grid>
                </Grid>

                {/* <LoadingButton
                    size="small"
                    variant="contained"
                    loading={loading}
                    className="mt-3 mr-3"
                    onClick={(evt: any) => {
                        setRoomAutoAssign(true);
                    }}
                >
                    Автомат оноох
                </LoadingButton> */}

                <LoadingButton
                    size="small"
                    type="submit"
                    variant="contained"
                    loading={loading}
                    className="mt-3 mr-3"
                >
                    Өрөө оноох
                </LoadingButton>

                <LoadingButton
                    variant="outlined"
                    className="mt-3"
                    onClick={(e) => handleClick(e, transactionInfo)}
                >
                    Бусад
                </LoadingButton>

                <Menu
                    id={`menu`}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <a
                        href={`/transaction/edit/${transactionInfo.TransactionID}`}
                    >
                        <MenuItem onClick={() => {}}>Засварлах</MenuItem>
                    </a>
                    <MenuItem
                        onClick={() => {
                            handleModal(
                                true,
                                "Хугацаа өөрчлөх",
                                <AmendStayForm
                                    transactionInfo={transactionInfo}
                                    reservation={transactionInfo}
                                    additionalMutateUrl={additionalMutateUrl}
                                    customRerender={customRerender}
                                />
                            );
                        }}
                    >
                        Хугацаа өөрчлөх
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleModal(
                                true,
                                "Захиалга цуцлах",
                                <CancelReservationForm
                                    transactionInfo={transactionInfo}
                                    reservation={transactionInfo}
                                    customMutateUrl={additionalMutateUrl}
                                    customRerender={customRerender}
                                />
                            );
                        }}
                    >
                        Захиалга цуцлах
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleModal(
                                true,
                                "Устгах",
                                <VoidTransactionForm
                                    transactionInfo={transactionInfo}
                                    reservation={transactionInfo}
                                    customMutateUrl={additionalMutateUrl}
                                    customRerender={customRerender}
                                />
                            );
                        }}
                    >
                        Устгах
                    </MenuItem>
                    {/* <MenuItem
                                        key={`newOrder${selectedRow.GroupID}`}
                                        onClick={() => {
                                            handleModal(
                                                true,
                                                `New Reservation`,
                                                <NewReservation
                                                    dateStart={
                                                        selectedRow.ArrivalDate
                                                    }
                                                    dateEnd={
                                                        selectedRow.DepartureDate
                                                    }
                                                    workingDate={workingDate}
                                                    groupID={
                                                        selectedRow.GroupID
                                                    }
                                                />,
                                                null,
                                                "large"
                                            );
                                        }}
                                    >
                                        Шинэ зочин нэмэх
                                    </MenuItem> */}
                </Menu>
            </form>
        </>
    );
};

export default RoomAssign;
