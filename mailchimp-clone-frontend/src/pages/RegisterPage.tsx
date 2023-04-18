import { Button, InputLabel, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../utils/API'
import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'


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
    const [text, setText] = useState<string>('Send Verification Code');
    // const [permissions, setPermissions] = useState<permissionName[]>([]);
    const schema = yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().email().required(),
        birthDate: yup.string().required(),
        password: yup.string().min(8).required(),
        confirmPassword: yup.string().oneOf([yup.ref("password")]).required()
    })
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    })


    const registerUser = (data: any) => {
        // e.preventDefault();
        // const date = new Date(birthDate ?? '');
        // const formattedDate = date.toISOString().substring(0,10);
        // const updatedRequest: registerInfo = {
        //   firstName: firstName,
        //   lastName: lastName,
        //   email: email,
        //   password: password,
        //   birthDate: formattedDate
        // };
        console.log(data.email)
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
        <h1 className="title">Register</h1>

        <form className="register-form" onSubmit={handleSubmit(registerUser)}>
            <Stack direction='row' spacing={1}>
                <TextField type='text' className='firstname' placeholder='Firstname' label="Firsname" {...register("firstName")}/>
                <TextField type='text' className='lastname' placeholder='Lastname' label="Lastname" {...register("lastName")}/>
            </Stack>  

            <Stack direction="row" spacing={2} sx={{position:'relative'}}>
                <TextField type='email' className='email' placeholder='Email' label="Email"
                {...register("email")}/>
                <InputLabel htmlFor="birthdate" className='birth-label'>Birthdate</InputLabel>
                <TextField id="birthdate" type="date" className='birthdate'
                {...register("birthDate")} />
            </Stack>  

            <Stack spacing={2}>
                <TextField type='password' className='password' placeholder='Password'label="Password"
                {...register("password")}/>
                <TextField type='password' className='confirm-password' placeholder='Confirm Password' label="Confirm Password"
                {...register("confirmPassword")}/>
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