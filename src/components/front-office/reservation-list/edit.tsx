import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Grid, Card, CardContent } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import { useState, useEffect } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import NewEditForm from "components/common/new-edit-form";
import { FrontOfficeAPI, listUrl } from "lib/api/front-office";
import { useAppState } from "lib/context/app";
import { dateStringToObj } from "lib/utils/helpers";
import NewForm from "./new-form";
import ReservationDetail from "components/reservation/item-detail";

const validationSchema = yup.object().shape({
    DeparturedListName: yup.string().notRequired(),
});

const NewEdit = ({ transactionID, additionalMutateUrl }: any) => {
    const [reservation, setReservation]: any = useState(null);

    const reloadDetailInfo = async () => {
        var res = await FrontOfficeAPI.transactionInfo(transactionID);

        setReservation(res);
    };

    useEffect(() => {
        reloadDetailInfo();
    }, [transactionID]);

    return (
        <div>
            {reservation && (
                <ReservationDetail
                    reservation={reservation}
                    reloadDetailInfo={reloadDetailInfo}
                    additionalMutateUrl={additionalMutateUrl}
                />
            )}
        </div>
    );
};

export default NewEdit;
