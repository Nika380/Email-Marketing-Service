import { createContext, useState } from "react";

interface ChangeGroupNameContextValue {
    groupName: string;
    setGroupName: (newGroupName: string) => void;
  }
  

const ChangeGroupNameContext = createContext<ChangeGroupNameContextValue>({
    groupName: "",
    setGroupName: () => {}
  });

export const ChangeGroupNameContextProvider = ({children}: {children: React.ReactNode}) => {
    const [groupName, setGroupName] = useState("");

    return (
        <ChangeGroupNameContext.Provider value={{groupName, setGroupName}}>
            {children}
        </ChangeGroupNameContext.Provider>
    )
}

export default ChangeGroupNameContext;