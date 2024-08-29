"use client";
import React from "react";
import { PinContainer } from "@/components/ui/3d-pin";
import Link from "next/link";

interface DataItem {
    _id: string;
    username: string;
    posts: number;
    avatar: string;
}

interface DataProps {
    data: DataItem[];
}

const Test: React.FC<DataProps> = ({ data }) => {
    console.log(`\n ~ Test ~ data :- `, data);

    return (
        <div className="flex flex-wrap justify-evenly md:m-16 gap-y-12 md:gap-20 md:gap-y-24 mb-12 md:my-[5rem] ">
            {data &&
                data.map((item) => {
                    const url = item.avatar;
                    return (
                        <PinContainer
                            key={item._id}
                            title={
                                <Link
                                    href={"/"}
                                    onClick={() => console.log("first")}
                                >
                                    <div className="">Posts: {item.posts}</div>
                                </Link>
                            }
                        >
                            <div className="card bg-base-100 w-36 h-36 md:w-52 md:h-52 shadow-xl relative flex flex-col justify-between">
                                <figure
                                    className="flex absolute inset-0 m-0 h-full w-full rounded-xl bg-cover bg-center"
                                    style={{ backgroundImage: `url(${url})` }}
                                >
                                    <div className="absolute inset-0 mt-1"></div>
                                </figure>
                                <span className="m-1 bg-gray-400 shadow-xl w-fit badge-sm glass md:badge-lg font-semibold rounded-md">
                                    {item.username}
                                </span>
                            </div>
                        </PinContainer>
                    );
                })}
        </div>
    );
};

export default Test;
