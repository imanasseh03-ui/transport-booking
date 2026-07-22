import { createContext, useContext, useState } from "react";

const AuthContext = createContext();


export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem("bluewhales_user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;

    });


    const login = (userData) => {

        localStorage.setItem(
            "bluewhales_user",
            JSON.stringify(userData)
        );

        setUser(userData);
    };


    const logout = () => {

        localStorage.removeItem(
            "bluewhales_user"
        );

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(AuthContext);

}