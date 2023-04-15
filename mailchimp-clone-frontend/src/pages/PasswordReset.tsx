import { Button, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Api } from '@mui/icons-material';
import { API } from '../utils/API';
import { useNavigate } from 'react-router-dom';

interface resetPasswordInfo {
    email: string,
    otp: string,
    newPassword: string
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
    const url = "/auth/reset-password/check-otp";
    const resetEmail = '/auth/reset-password/send-otp/zaaaazz126@gmail.com';
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
                setLinkSent(false);
            } 
        })
    }

    const resetPassword = () => {
        const info: resetPasswordInfo = {
            email: email,
            otp: otp,
            newPassword: password
        };

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
            <Stack spacing={2} alignItems='center'>
                <TextField type='text' label="New Password" sx={{width:'100%'}} onChange={(e) => setPassword(e.target.value)}/>
                <TextField type='text' label="Confirm Password" sx={{width:'100%'}} onChange={(e) => setConfirmPassword(e.target.value)}/>
                <Button sx={{textTransform:'none', width:'50%'}} variant='contained' onClick={resetPassword}>Submit</Button>
            </Stack>

        }
        </div>
    </div>
  )
}

export default PasswordReset