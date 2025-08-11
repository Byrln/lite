import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { PromotionTypeSWR } from "lib/api/promotion-type";
import { useIntl } from "react-intl";

const PromotionTypeSelect = ({ register, errors }: any) => {
  const intl = useIntl()
  const { data, error } = PromotionTypeSWR();

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
      field="PromotionTypeID"
      label={intl.formatMessage({ id: "MenuPromotionType" })}
      options={data?.map((item: any) => ({
        ...item,
        PromotionTypeName: intl.formatMessage({ id: item.PromotionTypeName }),
      }))}
      optionValue="PromotionTypeID"
      optionLabel="PromotionTypeName"
    />
  );
};

export default PromotionTypeSelect;
