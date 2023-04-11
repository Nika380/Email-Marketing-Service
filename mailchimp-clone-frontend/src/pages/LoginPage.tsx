import { Button, TextField } from "@mui/material"
import { API } from "../utils/API"
import { useState } from "react"

export const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        console.log("words");
       try{
        const response = await API.post('/auth/authenticate',{
            email: email,
            password: password
           });
           console.log(response);
           localStorage.setItem('jwtToken', response.data.jwtToken);
       } catch (error) {
        console.log(error);
       }
    }

    const test = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.log('JWT token not found');
            return;
        }
    
        try {
            console.log("In Try Box")
            console.log(jwtToken)
            const response = await API.get("/test", {
                headers: {
                  Authorization: `Bearer ${jwtToken}`
                }
            });
            console.log(response);
        } catch (error) {
            console.log("Int Catch Box")
            console.log('Error:', error);
        }
    };
    
    return (
        <div className="login-page">
            <div className="login-form">
                <TextField type="email" className="email-input" onChange={(e) => setEmail(e.target.value)}/>
                <TextField type="password" onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={login}>Login</Button>
                <Button onClick={test}>Test</Button>
            </div>
        </div>
    )
}