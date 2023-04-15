import { Button, InputLabel, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../utils/API'


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
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [verify, setVerify] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>('');
    // const [permissions, setPermissions] = useState<permissionName[]>([]);
   

    const registerUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const date = new Date(birthDate ?? '');
        const formattedDate = date.toISOString().substring(0,10);
        const updatedRequest: registerInfo = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          birthDate: formattedDate
        };
      
        API.post('/users/register', updatedRequest)
        .then(res => {
            if(res.status === 200) {
                setVerify(true);
            }
        })
      }
      
      const verifyEmail = () => {
        API.post(`/email/activate/${email}/${otp}`)
        .then(res => {
            if(res.status === 200) {
                navigate('/login')
            }
        })
      }
      

  return (
    <div className='register-page'>
        <h1 className="title">Register</h1>

        <div className="register-form">
            <Stack direction='row' spacing={1}>
                <TextField type='text' className='firstname' placeholder='Firstname' label="Firsname" onChange={(e) => setFirstName(e.target.value)}/>
                <TextField type='text' className='lastname' placeholder='Lastname' label="Lastname" onChange={(e) => setLastName(e.target.value)}/>
            </Stack>  

            <Stack direction="row" spacing={2} sx={{position:'relative'}}>
                <TextField type='email' className='email' placeholder='Email' label="Email"
                onChange={(e) => setEmail(e.target.value)}/>
                <InputLabel htmlFor="birthdate" className='birth-label'>Birthdate</InputLabel>
                <TextField id="birthdate" type="date" className='birthdate'
                onChange={(e) => setBirthDate(new Date(e.target.value))}/>
            </Stack>  

            <Stack spacing={2}>
                <TextField type='password' className='password' placeholder='Password'label="Password"
                onChange={(e) => setPassword(e.target.value)}/>
                <TextField type='password' className='confirm-password' placeholder='Confirm Password' label="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}/>
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

            <Stack sx={{width:"500px", marginTop:'30px'}} spacing={5} direction="row" className="buttons" justifyContent='center'>
                    <Button className="register-btn" variant="outlined" onClick={(e) => registerUser(e)}>Register</Button>
                    <Button className="login-btn" variant="contained" onClick={() => navigate('/login')}>Login</Button>
            </Stack>
            
        </div>

    </div>
  )
}

export default RegisterPage