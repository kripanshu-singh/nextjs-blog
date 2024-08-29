"use client";
import { useUser } from "@/userContext";
import React from "react";

const Page = () => {
    const { setContextLoading, contextLoading, user } = useUser();
    console.log(`\n ~ Page ~ user :- `, user);
    setContextLoading(false);
    return (
        <>
            {contextLoading && (
                <>
                    <div className="flex justify-center h-[100svh]">
                        <span className="loading loading-ring loading-lg md:w-20"></span>
                    </div>
                </>
            )}
            {!contextLoading && (
                <>
                    <div className="flex flex-wrap items-center justify-center w-full my-8 ">
                        <div className="h-full w-full shadow-lg flex flex-col transform duration-200 ease-in-out ">
                            <div className="flex justify-center  ">
                                <div className="avatar">
                                    <div className=" ring-primary ring-offset-base-100   ring ring-offset-4 md:ring-offset-2 w-28 md:w-40 rounded-full  ring-white shadow-cyan-100 shadow-2xl">
                                        <img src={(user as any).avatar} />
                                    </div>
                                </div>
                                {/* <img
                                    className="avatar h-28 md:h-32 w-28 md:w-32 bg-white p-1 rounded-full shadow-cyan-100 shadow-2xl"
                                    alt={(user as any).username}
                                    src={(user as any).avatar}
                                /> */}
                            </div>{" "}
                            <div className="px-4 md:px-12 py-6 text-center">
                                <h2 className="text-3xl font-bold">
                                    {(user as any).username}
                                </h2>
                                <span
                                    className="mt-2 block text-blue-500 hover:text-blue-700"
                                    rel="noopener noreferrer"
                                >
                                    {(user as any).email}
                                </span>
                                <p className="mt-2 text-sm"></p>
                                <div className="flex justify-center items-center  rounded-2xl mt-6 mx-auto md:w-[30rem] gap-x-[2px]">
                                    <div className="w-1/2 p-4 bg-base-200 hover:bg-base-300 rounded-2xl cursor-pointer hover:rounded-r-2xl ">
                                        <p>
                                            <span className="font-semibold">
                                                {(user as any).posts}
                                            </span>{" "}
                                            Posts
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Page;
