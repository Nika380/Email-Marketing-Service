import { Button, FormHelperText, IconButton, InputAdornment, InputLabel, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../utils/API'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet'
import { VisibilityOff, Visibility } from '@mui/icons-material'


// interface permissionName {
//     permissionName: String;
// }

interface registerInfo {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    birthDate: Date | null | String,
    // permissions: permissionName[]
}

const RegisterPage = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [verify, setVerify] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>('');
    const [text, setText] = useState<string>('Send Verification Code');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    // const [permissions, setPermissions] = useState<permissionName[]>([]);
    const schema = yup.object().shape({
        firstName: yup.string().required("This Field Is Required!"),
        lastName: yup.string().required("This Field Is Required!"),
        email: yup.string().email("This Does Not Look Like Correct Email Format!").required("This Field Is Required!"),
        birthDate: yup.string().required("This Field Is Required!"),
        password: yup.string().min(8, "Password Must Be At Least 8 Characters Long").required("This Field Is Required!"),
        confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords Does Not Match").required("This Field Is Required!")
    })
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    })

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const registerUser = (data: any) => {
        setEmail(data.email)
        setText("Send Again")
        API.post('/users/register', data)
        .then(res => {
            if(res.status === 200) {
                setVerify(true);
            }
        })
      }
      
      const verifyEmail = () => {
        API.get(`/email/activate/${email}/${otp}`)
        .then(res => {
            if(res.status === 201) {
                setText("Account Was Created");
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            } else {
                setText("OTP is not Correct")
            }
        })
      }
      

  return (
    <div className='register-page'>
        <Helmet>
            <title>Registration</title>
        </Helmet>
        <button className='go-back-btn' onClick={() => navigate(-1)}>Go Back</button>
        <h1 className="title">Register</h1>

        <form className="register-form" onSubmit={handleSubmit(registerUser)}>
            <Stack direction='row' spacing={1}>
                <TextField type='text' className='firstname' placeholder='Firstname' label="Firsname"
                 {...register("firstName")}
                 helperText={
                    <FormHelperText style={{color:"red"}}>
                        <>{errors.firstName?.message}</>
                    </FormHelperText>
                }
                 />
                <TextField type='text' className='lastname' placeholder='Lastname' label="Lastname"
                 {...register("lastName")}
                 helperText={
                    <FormHelperText style={{color:"red"}}>
                        <>{errors.lastName?.message}</>
                    </FormHelperText>
                }
                 />
            </Stack>  

            <Stack direction="row" spacing={2} sx={{position:'relative'}}>
                <TextField type='email' className='email' placeholder='Email' label="Email"
                {...register("email")}
                helperText={
                    <FormHelperText style={{color:"red"}}>
                        <>{errors.email?.message}</>
                    </FormHelperText>
                }
                />
                <InputLabel htmlFor="birthdate" className='birth-label'>Birthdate</InputLabel>
                <TextField id="birthdate" type="date" className='birthdate'
                {...register("birthDate")}
                helperText={
                    <FormHelperText style={{color:"red"}}>
                        <>{errors.birthDate?.message}</>
                    </FormHelperText>
                }
                />
            </Stack>  

            <Stack spacing={2}>
                <TextField className='password' placeholder='Password'label="Password"
                {...register("password")}
                helperText={
                    <FormHelperText style={{color:"red"}}>
                        <>{errors.password?.message}</>
                    </FormHelperText>
                }
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
                />
                <TextField className='confirm-password' placeholder='Confirm Password' label="Confirm Password"
                {...register("confirmPassword")}
                helperText={
                    <FormHelperText style={{color:"red"}}>
                        <>{errors.confirmPassword?.message}</>
                    </FormHelperText>
                }
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
                />
            </Stack>

            <Stack direction='row' spacing={1}>
                <TextField
                    type='text'
                    label="Verify Email"
                    placeholder='Type OTP code that was send to your email'
                    sx={{ width: '450px' }}
                    disabled={!verify}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <Button disabled={!verify} variant={verify ? 'outlined' : 'text'} onClick={verifyEmail}>Verify</Button>
            </Stack>

            <Stack sx={{width:"500px", marginTop:'30px'}} direction="row" className="buttons" justifyContent='center'>
                    <Button type='submit' className="register-btn" variant="outlined" >{text}</Button>
                    {/* <Button className="login-btn" variant="contained" onClick={() => navigate('/login')}>Login</Button> */}
            </Stack>
            
        </form>

    </div>
  )
}

export default RegisterPage