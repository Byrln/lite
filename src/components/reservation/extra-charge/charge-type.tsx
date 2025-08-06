import { Checkbox, TextField, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { listUrl } from "lib/api/front-office";
import { formatNumber } from "lib/utils/helpers";
import { ChargeTypeAPI } from "lib/api/charge-type";
import CustomTable from "components/common/custom-table";
import { formatPrice } from "lib/utils/helpers";

const ExtraCharge = ({ entity, setEntity, register, errors, chargeType }: any) => {
  const intl = useIntl();
  const [rerenderKey, setRerenderKey] = useState(0);

  const fetchDatas = async () => {
    try {
      const arr: any = await ChargeTypeAPI.list({
        IsExtraCharge: true,
        RoomChargeTypeGroupID: chargeType,
      });
      if (arr) {
        setEntity(arr);
      }
    } finally {
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [chargeType]);

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
      title: "",
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
              if (e.target.checked == true) {
                tempEntity[dataIndex].BaseRate = 1;
                tempEntity[dataIndex].Total =
                  tempEntity[dataIndex].RoomChargeTypeRate *
                  tempEntity[dataIndex].BaseRate;
              } else {
                tempEntity[dataIndex].BaseRate = 0;
                tempEntity[dataIndex].Total = 0;
              }

              setEntity(tempEntity);
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderExtraChargeGroup",
      }),
      key: "RoomChargeTypeGroupName",
      dataIndex: "RoomChargeTypeGroupName",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderExtraCharge",
      }),
      key: "RoomChargeTypeName",
      dataIndex: "RoomChargeTypeName",
    },
    {
      title: intl.formatMessage({
        id: "RowHeaderRate",
      }),
      key: "RoomChargeTypeRate",
      dataIndex: "RoomChargeTypeRate",
      render: function render(
        id: any,
        value: any,
        element: any,
        dataIndex: any
      ) {
        return (
          <TextField
            size="small"
            fullWidth
            disabled={
              entity &&
              entity[dataIndex] &&
              (!entity[dataIndex].isChecked ||
                !entity[dataIndex].EditableRate ||
                entity[dataIndex].RoomChargeTypeGroupName ==
                "Mini Bar")
            }
            value={
              entity &&
              entity[dataIndex] &&
              formatNumber(entity[dataIndex].RoomChargeTypeRate)
            }
            InputLabelProps={{
              shrink: true,
            }}
            margin="dense"
            onChange={(evt: any) => {
              let tempEntity = [...entity];
              tempEntity[dataIndex].RoomChargeTypeRate =
                parseFloat(
                  evt.target.value.replace(/[^0-9.]/g, "")
                );
              tempEntity[dataIndex].Total =
                tempEntity[dataIndex].RoomChargeTypeRate *
                tempEntity[dataIndex].BaseRate;
              setEntity(tempEntity);
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "TextQuantity",
      }),
      key: "Quantity",
      dataIndex: "Quantity",
      render: function render(
        id: any,
        value: any,
        element: any,
        dataIndex: any
      ) {
        const handleQuantityChange = (newValue: number) => {
          let tempEntity = [...entity];
          tempEntity[dataIndex].BaseRate = Math.max(0, newValue);
          tempEntity[dataIndex].Total =
            tempEntity[dataIndex].RoomChargeTypeRate *
            tempEntity[dataIndex].BaseRate;
          setEntity(tempEntity);
        };

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              sx={{ width: '45px' }}
              disabled={
                entity &&
                entity[dataIndex] &&
                !entity[dataIndex].isChecked
              }
              value={
                entity &&
                entity[dataIndex] &&
                formatNumber(entity[dataIndex].BaseRate)
              }
              InputLabelProps={{
                shrink: true,
              }}
              margin="dense"
              onChange={(evt: any) => {
                const newValue = parseFloat(
                  evt.target.value.replace(/[^0-9.]/g, "")
                );
                handleQuantityChange(isNaN(newValue) ? 0 : newValue);
              }}
            />
          </Box>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: "TextAmount",
      }),
      key: "Total",
      dataIndex: "Total",
      render: function render(
        id: any,
        value: any,
        element: any,
        dataIndex: any
      ) {
        return (
          <div>
            {entity &&
              entity[dataIndex] &&
              entity[dataIndex].Total > 0
              ? formatNumber(entity[dataIndex].Total)
              : "0"}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={entity}
        hasNew={false}
        id="RoomChargeTypeID"
        listUrl={listUrl}
        excelName={intl.formatMessage({
          id: "ButtonExtraCharge",
        })}
        datagrid={false}
        hasPrint={false}
        hasExcel={false}
        customHeight="400px"
        size="small"
        showRowNumbers={false}
      />
    </>
  );
};

export default ExtraCharge;
