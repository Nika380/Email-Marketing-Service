import { createContext, useState, useEffect } from "react";

interface IAuthContext {
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<IAuthContext>({
  auth: false,
  setAuth: () => {}
});

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState(false);
    
    useEffect(() => {
        const checkAuth = JSON.parse(localStorage.getItem("jwtToken") || "null");
        console.log(checkAuth?.token)
        if(checkAuth?.token != null && checkAuth?.expireTime > new Date()) {
            setAuth(true);
        } else {
            setAuth(false)
            localStorage.removeItem('jwtToken');
        }
    }, [])
    
    useEffect(() => {
      console.log(auth)
    }, [localStorage])

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;

