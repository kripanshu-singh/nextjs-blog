"use client";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

interface User {
    _id: string;
    username: string;
    avatar: string;
    posts: number; // Add other properties as needed
    // avater: string; // Add other properties as needed
}

interface UserContextType {
    searchVal: string;
    setSearchVal: Dispatch<SetStateAction<string>>;
    showSearch: boolean;
    setShowSearch: Dispatch<SetStateAction<boolean>>;
    data: { data: any[]; status: string };
    setData: Dispatch<SetStateAction<{ data: any[]; status: string }>>;
    user: User;
    setUser: Dispatch<SetStateAction<User>>; // Update to use the User interface
    contextLoading: boolean;
    setContextLoading: Dispatch<SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [searchVal, setSearchVal] = useState<string>("");
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [contextLoading, setContextLoading] = useState<boolean>(true);
    const [data, setData] = useState<{ data: any[]; status: string }>({
        data: [],
        status: "loading",
    });
    const [user, setUser] = useState<User>({
        _id: "",
        username: "",
        avatar: "",
        posts: 0,
    });

    const contextValue: UserContextType = {
        searchVal,
        setSearchVal,
        showSearch,
        setShowSearch,
        data,
        setData,
        user,
        setUser,
        contextLoading,
        setContextLoading,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export { useUser, UserProvider };
