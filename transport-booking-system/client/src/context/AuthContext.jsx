import { useState } from "react";
import { AuthContext } from "./authContextValue";


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    if (!savedUser || savedUser === "undefined") {
        return null;
    }

    try {
        return JSON.parse(savedUser);
    } catch {
        localStorage.removeItem("user");
        return null;
    }

});


    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
    };


    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
