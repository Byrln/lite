import { useState, useEffect } from "react";

import { FrontOfficeAPI } from "lib/api/front-office";
import { ChargeAPI } from "lib/api/charge";

import ReservationDetail from "components/reservation/item-detail";

const NewEdit = ({ transactionID, additionalMutateUrl }: any) => {
    const [reservation, setReservation]: any = useState(null);
    const [summary, setSummary]: any = useState(null);

    const reloadDetailInfo = async () => {
        var res = await FrontOfficeAPI.transactionInfo(transactionID);

        setReservation(res);
    };
    const reloadReservationData = async () => {
        var res = await ChargeAPI.summary(transactionID);

        setSummary(res.data.JsonData[0]);
    };

    useEffect(() => {
        reloadDetailInfo();
        reloadReservationData();
    }, [transactionID]);

    return (
        <div>
            {reservation && summary && (
                <ReservationDetail
                    reservation={reservation}
                    reloadDetailInfo={reloadDetailInfo}
                    additionalMutateUrl={additionalMutateUrl}
                    summary={summary}
                />
            )}
        </div>
    );
};

export default NewEdit;
