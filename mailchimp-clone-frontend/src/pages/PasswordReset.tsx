import { Button, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import {  Visibility, VisibilityOff } from '@mui/icons-material';
import { API } from '../utils/API';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; 
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet';

interface resetPasswordInfo {
    email: string,
    otp: string,
    newPassword: string,
}

const PasswordReset = () => {
    const [linkSent, setLinkSent] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [otpMatch, setOtpMatch] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('Check your email');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const schema = yup.object().shape({
      password: yup.string().min(8).required(),
      confirmPassword: yup.string()
    .nullable()
    .oneOf([yup.ref('password', {})], 'Passwords does not match')
    .required('passwords does not match')



    });
    const {register, handleSubmit, formState: {errors}} = useForm({
      resolver: yupResolver(schema)
    });


  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
  const sendResetLink = () => {
        API.post(`/auth/reset-password/send-otp/${email}`)
        .then(res => {
            if(res.status === 200) {
                setLinkSent(true);
            }
        })
    }

    const checkOtp = () => {
        API.post(`/auth/reset-password/check-otp/${email}/${otp}`)
        .then(res => {
            if(res.status === 200) {
                setOtpMatch(true);
                setMessage("Type New Password");
            } 
        })
    }

    const resetPassword = (data: any) => {
        const info: resetPasswordInfo = {
            email: email,
            otp: otp,
            newPassword: password,
        };
        console.log(data)

          API.post('/auth/reset-password', info)
        .then(res => {
            console.log(res);
            if(res.status === 200) {
                setMessage("Password Changed Successfully");
                setLinkSent(true);
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            }
            
        })
        }
  



  return (
    <div className='password-reset'>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <button className='go-back-btn' onClick={() => navigate(-1)}>Go Back</button>
        <h1 className="title">Reset Password</h1>
        {linkSent && <p className="message">{message}</p>}
        <div className="reset-form">
            {!otpMatch ? 
            <>  
                <Stack direction='row' spacing={2}>
                      <TextField type='text' label="Email" className='email'
                          onChange={(e) => setEmail(e.target.value)} />
                      <Button sx={{ textTransform: 'none' }}
                          onClick={sendResetLink}>Send Link</Button>
                  </Stack><Stack direction='row' spacing={2}>
                          <TextField type='text' label="One Time Password" className='otp' disabled={!linkSent}
                          onChange={(e) => setOtp(e.target.value)} />
                          <Button sx={{ textTransform: 'none' }} disabled={!linkSent} onClick={checkOtp}>Submit</Button>
                      </Stack>
            </> : 
               <form onSubmit={handleSubmit(resetPassword)}>
                 <Stack spacing={2} alignItems='center'>
                  <TextField
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    label="Password"
                    // onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    {...register("password")}
                  />

                  <TextField
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    label="Confirm Password"
                    // onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    helperText={
                      <FormHelperText style={{ color: 'red' }}>
                      {errors.confirmPassword?.message?.toString()}
                    </FormHelperText>
                    }
                    {...register("confirmPassword")}

                  />
                  <Button sx={{textTransform:'none', width:'50%'}} variant='contained' type='submit' >Submit</Button>
              </Stack>
               </form>

        }
          
        </div>
    </div>
  )
}

export default PasswordReset