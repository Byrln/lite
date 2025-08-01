import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import {
  Link as MaterialLink,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import { getSession, signIn } from "next-auth/react";
import { UserAPI } from "lib/api/user";
import moment from "moment";

import axios from "lib/utils/axios";
import { CompanyDatabaseAPI } from "lib/api/company-database";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${(session as any).token}`;
        router.replace("/");
      } else {
        axios.defaults.headers.common["Authorization"] = "";
      }
    });
  }, [router]);

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    hotel: yup
      .number()
      .required("Hotel is required")
      .typeError("Hotel must be a number"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const onSubmit = async (values: any) => {
    setLoading(true);

    const result: any = await signIn("credentials", {
      username: values.username + "_" + values.hotel,
      password: values.password,
      redirect: false,
    });
    if (!result.error) {
      getSession().then(async (session) => {
        if (session) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${(session as any).token}`;
          // console.log("session.expires", session);
          // console.log("session.expires", new Date());

          localStorage.setItem("hotelId", values.hotel);
          localStorage.setItem("username", values.username);
          localStorage.setItem(
            "expires",
            moment().add(2, "hours").format("YYYY-MM-DD HH:mm:ss")
          );

          let privileges = await UserAPI.getPrivileges();
          let companyDatabase = await CompanyDatabaseAPI.list({});
          let isHaveDashBoard = false;
          await privileges.map((action: any) =>
            action.ActionName == "DashBoard" &&
              action.Status == true
              ? (isHaveDashBoard = true)
              : null
          );
          router.replace(
            companyDatabase && companyDatabase.length > 0
              ? isHaveDashBoard
                ? "/mon/"
                : "/mon/report/daily"
              : "/mon/front-office/guide"
          );
        } else {
          axios.defaults.headers.common["Authorization"] = "";
          window.location.href = "/auth/signin";
        }
      });
    } else {
      setError(result.error);
      setLoading(false);
      setOpen(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClick={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            label="Хэрэглэгчийн нэр"
            {...register("username")}
            margin="dense"
            error={!!errors?.username?.message}
            helperText={errors?.username?.message as string}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Нууц үг"
            {...register("password")}
            margin="dense"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleShowPassword}
                    edge="end"
                  >
                    <Icon
                      icon={
                        showPassword
                          ? eyeFill
                          : eyeOffFill
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!errors?.password?.message}
            helperText={errors?.password?.message as string}
          />

          <TextField
            fullWidth
            label="Зочид буудлын код"
            {...register("hotel")}
            margin="dense"
            error={!!errors?.hotel?.message}
            helperText={errors?.hotel?.message as string}
          />
        </Stack>

        {/* <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ my: 2 }}
                >
                    <Link href="#" passHref>
                        <MaterialLink variant="subtitle2">
                            Forgot password?
                        </MaterialLink>
                    </Link>
                </Stack> */}

        <LoadingButton
          fullWidth
          size="small"
          type="submit"
          variant="contained"
          loading={loading}
          sx={{ my: 2 }}
        >
          Нэвтрэх
        </LoadingButton>
      </form>
    </>
  );
}
