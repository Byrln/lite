import {useState, useEffect, useContext} from "react";
import NewEdit from "components/reservation/new-edit";
import {ReservationApi} from "lib/api/reservation";
import {mutate} from "swr";
import {listUrl as reservationListUrl} from "lib/api/front-office";
import {toast} from "react-toastify";
import {Alert, Box, Divider} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {ModalContext} from "lib/context/modal";

const styleAccordion = {
    boxShadow: "none",
    borderTop: "1px solid #d9d9d9",
    borderBottom: "1px solid #d9d9d9",
};

const styleAccordionContent = {
    px: 0,
};

const ReservationMake = ({timelineCoord, workingDate}: any) => {
    const [reservations, setReservations]: any = useState([
        {isMain: true, defaultData: null, submitValues: null},
    ]);
    const [commonValues, setCommonValues]: any = useState({
        GroupID: 0,
        GroupColor: "#dc6f2b",
    });
    const [openIndex, setOpenIndex]: any = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const {handleModal}: any = useContext(ModalContext);

    const onAccordionChange = (keyIndex: any) => {
        if (openIndex == keyIndex) {
            return;
        }
        setOpenIndex(keyIndex);
    };

    const addReservations = (defaultData: any, count: number) => {
        var i;
        var ress = [...reservations];
        for (i = 0; i < count; i++) {
            ress.push({isMain: false, defaultData: defaultData, submitValues: null});
        }
        setReservations(ress);
    };

    const onColorChange = (color: any) => {
        setCommonValues({
            ...commonValues,
            GroupColor: color,
        });
    };

    const submitGeneral = () => {
        setSubmitting(true);
    };

    const submitAll = async () => {
        try {
            var res;
            var isGroup = (reservations.length > 1);
            var groupId = 0;
            var values = {...reservations[0].submitValues};

            values.isGroup = isGroup;
            values.GroupID = groupId;
            if (isGroup) {
                values.GroupColor = commonValues.GroupColor;
            }

            res = await ReservationApi.new(values);

            if (isGroup && res.data.length > 0) {
                groupId = res.data[0].GroupID;
            }

            var i;
            for (i = 1; i < reservations.length; i++) {
                if (!reservations[i].submitValues) {
                    continue;
                }
                values = {...reservations[i].submitValues};
                values.isGroup = isGroup;
                if (isGroup) {
                    values.GroupID = groupId;
                    values.GroupColor = commonValues.GroupColor;
                }
                res = await ReservationApi.new(values);
            }

            await mutate(reservationListUrl);

            setSubmitting(false);

            toast("Амжилттай!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            handleModal();

        } catch (e: any) {

        }
    };

    const onSingleSubmit = (values: any, keyIndex: number) => {
        if (!reservations[keyIndex]) {
            console.log("Key index does not exists: ", keyIndex);
            return;
        }

        var r = [...reservations];
        r[keyIndex].submitValues = values;
        setReservations(r);

        console.log("Reservations for submit: ", reservations);

        var complete = true;
        var i;

        for (i in reservations) {
            if (!reservations[i].submitValues) {
                complete = false;
                break;
            }
        }

        if (!complete) {
            return;
        }

        submitAll();

    };

    return (
        <>
            {
                reservations.map((res: any, index: number) => {
                    return <>
                        <NewEdit
                            key={index}
                            timelineCoord={timelineCoord}
                            workingDate={workingDate}
                            addReservations={addReservations}
                            keyIndex={index}
                            isMain={res.isMain}
                            defaultData={res.defaultData}
                            onAccordionChange={onAccordionChange}
                            openIndex={openIndex}
                            onSingleSubmit={onSingleSubmit}
                            submitting={submitting}
                            onColorChange={onColorChange}
                        />
                    </>
                })
            }
            <Divider/>
            <Box sx={{display: "flex", justifyContent: "end", mt: 2}}>
                {/*<LoadingButton*/}
                {/*    variant="outlined"*/}
                {/*    loading={loading}*/}
                {/*>Walk In</LoadingButton>*/}
                <LoadingButton
                    variant="contained"
                    loading={submitting}
                    onClick={(evt: any) => {
                        evt.preventDefault();
                        submitGeneral();
                        return false;
                    }}
                >Reservation</LoadingButton>
            </Box>
        </>
    );
};

export default ReservationMake;
