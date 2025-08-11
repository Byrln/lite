import { TextField, Grid, FormControlLabel, FormGroup, Typography, Box, Divider } from "@mui/material";
import { useState, useEffect } from "react";

import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Checkbox from "@mui/material/Checkbox";

import moment from "moment";
import { FloorSWR } from "lib/api/floor";
import { useIntl } from "react-intl";

const Search = ({ register, errors, control, search }: any) => {
  const intl = useIntl()
  const { data, error } = FloorSWR();
  const [floors, setFloors]: any = useState([]);

  useEffect(() => {
    if (search && search.Floors) {
      setFloors(search.Floors);
    }
  }, [search]);

  const handleToggle = (element: any) => (e: any) => {
    let tempValue = [...floors];
    if (tempValue && tempValue.includes(String(element.FloorID))) {
      tempValue.splice(tempValue.indexOf(element.FloorID), 1);
    } else {
      tempValue.push(String(element.FloorID));
    }
    setFloors(tempValue);
  };
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Date Selection Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {intl.formatMessage({ id: "TextDate" })}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="CurrDate"
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label={intl.formatMessage({ id: "TextDate" })}
                value={value}
                onChange={(value) =>
                  onChange(moment(value, "YYYY-MM-DD"))
                }
                renderInput={(params) => (
                  <TextField
                    size="medium"
                    id="CurrDate"
                    {...register("CurrDate")}
                    margin="normal"
                    fullWidth
                    {...params}
                    error={!!errors.CurrDate?.message}
                    helperText={errors.CurrDate?.message as string}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Floor Selection Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            {intl.formatMessage({ id: "TextFloor" })}
          </Typography>

          <Box sx={{
            bgcolor: 'grey.50',
            borderRadius: 2,
            p: 3,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <FormGroup>
              <Grid container spacing={2}>
                {data &&
                  data
                    .sort((a: any, b: any) => parseInt(a.FloorNo) - parseInt(b.FloorNo))
                    .map((element: any) => (
                      <Grid
                        key={element.FloorID}
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        lg={2}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                floors &&
                                  floors.includes(
                                    String(element.FloorID)
                                  )
                                  ? true
                                  : false
                              }
                              {...register("Floors")}
                              value={element.FloorID}
                              onChange={handleToggle(element)}
                              sx={{
                                '&.Mui-checked': {
                                  color: 'primary.main',
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {element.FloorNo} {intl.formatMessage({ id: "TextFloor" })}
                            </Typography>
                          }
                          sx={{
                            m: 0,
                            width: '100%',
                            '& .MuiFormControlLabel-label': {
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      </Grid>
                    ))}
              </Grid>
            </FormGroup>

            {(!data || data.length === 0) && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 2 }}
              >
                Давхарын мэдээлэл олдсонгүй
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Search;
