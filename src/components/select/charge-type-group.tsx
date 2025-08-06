import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useIntl } from "react-intl";

import CustomSelect from "components/common/custom-select";
import { ChargeTypeGroupSWR } from "lib/api/charge-type-group";

const ChargeTypeGroupSelect = ({
  register,
  errors,
  IsRoomCharge,
  IsExtraCharge,
  IsMiniBar,
  IsDiscount,
  onChange,
}: any) => {
  console.log("IsMiniBar", IsMiniBar);
  const intl = useIntl();
  const { data, error } = ChargeTypeGroupSWR({
    IsRoomCharge: IsRoomCharge ? IsRoomCharge : false,
    IsExtraCharge: IsExtraCharge ? IsExtraCharge : false,
    IsMiniBar: IsMiniBar ? IsMiniBar : false,
    IsDiscount: IsDiscount ? IsDiscount : false,
  });

  if (error) return <Alert severity="error">{error.message}</Alert>;

  if (!error && !data)
    return (
      <Box sx={{ width: "100%" }}>
        <Skeleton />
        <Skeleton animation="wave" />
      </Box>
    );

  return (
    <CustomSelect
      register={register}
      errors={errors}
      field="RoomChargeTypeGroupID"
      label={intl.formatMessage({ id: "RowHeaderExtraChargeGroup" })}
      options={data}
      optionValue="RoomChargeTypeGroupID"
      optionLabel="RoomChargeTypeGroupName"
      onChange={onChange}
    />
  );
};

export default ChargeTypeGroupSelect;
