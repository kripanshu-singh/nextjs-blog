"use client";
import Test from "@/my_utils/Author";
import { useUser } from "@/userContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Page = () => {
    const [data, setData] = useState();
    useEffect(() => {
        const fetchAuthors = async () => {
            setContextLoading(true);
            try {
                const response = await axios.get("/api/user/alluser");
                console.log(`\n ~ fetchAuthors ~ response :- `, response);

                console.log(
                    `\n ~ fetchAuthors ~ response.data :- `,
                    response?.data?.allUsers
                );
                setData(response?.data?.allUsers);
                setContextLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setContextLoading(false);
            }
        };

        fetchAuthors();

        // Ensure to add any dependencies if needed, e.g., [dependency]
    }, []);
    const { user, setUser, contextLoading, setContextLoading } = useUser();
    return (
        <>
            {contextLoading && (
                <>
                    <div className="flex justify-center h-[100svh]">
                        <span className="loading loading-ring loading-lg md:w-20"></span>
                    </div>
                </>
            )}{" "}
            {!contextLoading && <Test data={data!} />}
        </>
    );
};

export default Page;
