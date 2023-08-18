import { GuestHistorySummarySWR } from "lib/api/guest-database";
import { useAppState } from "lib/context/app";

const GuestHistory = ({ title }: any) => {
    const [state]: any = useAppState();

    const { data, error } = GuestHistorySummarySWR(state.editId);
    console.log("data", data);
    return (
        <>
            Total : {data[0].TotalTransactions}
            <br />
            Paid : {data[0].TotalPaid}
            <br />
            Status Reservation: {data[0].Reservations}
            <br />
            Staying: {data[0].StayTransactions}
            <br />
            Checked Out: {data[0].StayTransactions}
        </>
    );
};

export default GuestHistory;
