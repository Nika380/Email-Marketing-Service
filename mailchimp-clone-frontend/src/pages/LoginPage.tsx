import { Button, Stack, TextField } from "@mui/material"
import { API } from "../utils/API"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthProvider"
import { Helmet } from "react-helmet"


export const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {setAuth} : any = useContext(AuthContext);

    const login = async (e: any) => {
        e.preventDefault();
       try{
        const response = await API.post('/auth/authenticate',{
            email: email,
            password: password
           });
           if(response.status === 201) {
                const now = new Date();
                const expireTime = now.getTime() + 30 * 60 * 1000;
                const tokenData = {
                    token: response.data.jwtToken,
                    expireTime: expireTime
                  };
                localStorage.setItem('jwtToken', JSON.stringify(tokenData));
                setAuth(true);
                navigate('/dashboard')
           }
       } catch (error) {
        console.log(error);
       }
    } 
    
    
    return (
        <div className="login-page">
            <Helmet>
                <title>Login</title>
            </Helmet>
            <button className='go-back-btn' onClick={() => navigate(-1)}>Go Back</button>
            <h1 className="title">Sign In</h1>
            <div className="login-form">
                <Stack sx={{width:"400px"}} spacing={5}>
                    <TextField type="email" label="Email" onChange={(e) => setEmail(e.target.value)}/>
                    <TextField type="password" label="Password" onChange={(e) => setPassword(e.target.value)}/>
                </Stack>
                
                <Stack sx={{width:"400px"}} spacing={5} direction="row" className="buttons">
                    <Button className="register-btn" variant="outlined" onClick={() => navigate('/register')}>Register</Button>
                    <Button className="login-btn" variant="contained" onClick={(e) => login(e)}>Login</Button>
                </Stack>

                <Button sx={{textTransform:'none', textDecoration:'underline'}} onClick={() => navigate('/reset-password')}>Forget Password</Button>
            </div>
        </div>
    )
}