import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import CustomSelect from "components/common/custom-select";
import { UserRoleSWR } from "lib/api/user-role";
import { useIntl } from "react-intl";

const UserRoleSelect = ({
  register,
  errors,
  field,
  entity,
  setEntity,
}: any) => {
  const intl = useIntl()
  const { data, error } = UserRoleSWR({});

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
      field={field}
      label={intl.formatMessage({ id: "MenuUserRole" })}
      options={data}
      optionValue="UserRoleID"
      optionLabel="UserRoleName"
      entity={entity}
      onChange={(evt: any) => {
        setEntity &&
          setEntity({
            ...entity,
            [field]: Number(evt),
          });
      }}
    />
  );
};

export default UserRoleSelect;
