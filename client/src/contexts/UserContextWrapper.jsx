import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserContextWrapper = ({ children }) => {
    const [user, setUser] = useState(null);

    const handleSetUser = (data) => setUser(data);

    return (
        <UserContext.Provider value={{ user, setUser: handleSetUser }}>
            {children}
        </UserContext.Provider>
    );
}