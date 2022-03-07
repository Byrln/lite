import {useState, useEffect} from "react";
import NewEdit from "components/reservation/new-edit";

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
        {isMain: true, defaultData: null},
        {isMain: false, defaultData: null},
    ]);

    const addReservations = (defaultData: any, ) => {
        var r = reservations;
        r.push({isMain: false, defaultData: defaultData});
        setReservations(r);
    };

    return (<>
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
                    />
                </>
            })
        }
    </>);
};

export default ReservationMake;
