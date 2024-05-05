import { createContext, useContext, useState } from "react";
import React from "react"

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }:{children:React.ReactNode}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
