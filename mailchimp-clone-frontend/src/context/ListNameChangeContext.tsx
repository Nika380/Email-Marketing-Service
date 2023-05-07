import { createContext, useState } from "react";

interface ListNameChangeContextValue {
    listName: string;
    setListName: (newGroupName: string) => void;
  }
  

const ListNameChangeContext = createContext<ListNameChangeContextValue>({
    listName: "",
    setListName: () => {}
  });

export const ChangeListNameContextProvider = ({children}: {children: React.ReactNode}) => {
    const [listName, setListName] = useState("");

    return (
        <ListNameChangeContext.Provider value={{listName, setListName}}>
            {children}
        </ListNameChangeContext.Provider>
    )
}

export default ListNameChangeContext;