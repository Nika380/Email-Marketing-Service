import React, { useState } from 'react'
import SideMenu from '../components/SideMenu'
import { Alert, Button, CircularProgress, FormHelperText, IconButton, InputAdornment, Slide, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { Helmet } from 'react-helmet';
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { API } from '../utils/API';
import { VisibilityOff, Visibility } from '@mui/icons-material';

const ChangePassword = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [alertText, setAlertText] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);


    const schema = yup.object().shape({
        oldPassword: yup.string().required("This Field Is Required!"),
        newPassword: yup.string().min(8, "New Password Must Be At Least 8 Characters Long").required("This Field Is Required!"),
        confirmPassword: yup.string().oneOf([yup.ref("newPassword")], "Passwords Don't Match").required("This Field Is Required!")
    });

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    })

    const handleAlertClose = () => {
        setShowAlert(false);
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const sendPasswordChangeRequest = async (data: any) => {
        const jwt = localStorage.getItem("jwtToken");
        const tok = JSON.parse(jwt || "");
        setLoading(true)
        try {
        const response = await API.put(
            `/change-password`,
            {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
            },
            {
            headers: {
                Authorization: `Bearer ${tok?.token}`
            }
            }
        );
        if(response.status === 201) {
            setLoading(false);
            setAlertText("Password Changed Successfully!");
            setIsSuccess(true);
            setShowAlert(true);
        }
    } catch (error: any) {
        setLoading(false);
        if(error.response.status === 409) {
            setAlertText("Old Password Is Not Correct!");
        } else {
            setAlertText("Something Went Wrong!");
        }
        setIsSuccess(false);
        setShowAlert(true);
        console.log(error)
    }
    }
  return (
    <>
    <Helmet>
        <title>Change Password</title>
    </Helmet>
    <SideMenu />
        <div className='change-password'>
            <Typography 
            position="absolute"
            top="150px"
            fontSize="22px"
            >Change Password</Typography>
               <form onSubmit={handleSubmit(sendPasswordChangeRequest)} >
                <Stack direction="column" spacing={3} width="500px">
                    <TextField 
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                     label="Old Password"
                      {...register("oldPassword")}
                      helperText={
                        <FormHelperText style={{color:"red"}}>
                            <>{errors.oldPassword?.message}</>
                        </FormHelperText>
                    }
                     />
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        label="New Password"
                        {...register("newPassword")}
                        
                        helperText={
                            <FormHelperText style={{color:"red"}}>
                                <>{errors.newPassword?.message}</>
                            </FormHelperText>}
                        />

                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        label="Confirm Password"
                        {...register("confirmPassword")}
                        helperText={
                            <FormHelperText style={{color:"red"}}>
                                <>{errors.confirmPassword?.message}</>
                            </FormHelperText>
                        }
                        />
                        <Stack direction="row" justifyContent="end" marginTop="50px">
                            <Button type='submit' sx={{textTransform:"none"}} variant='contained'>Change Password</Button>
                            
                        </Stack>
                </Stack>
               </form>
        </div>
        {loading &&
              <div className="loading">
                <CircularProgress color='secondary' />
              </div>
            }

            <Snackbar
                open={showAlert}
                autoHideDuration={4000}
                onClose={handleAlertClose}
                TransitionComponent={Slide}
            >
                <Alert onClose={handleAlertClose} severity={isSuccess ? "success" : "error"}> {alertText} </Alert>
            </Snackbar>
    </>
  )
}

export default ChangePassword