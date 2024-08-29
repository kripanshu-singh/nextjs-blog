"use client";
import { useUser } from "@/userContext";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
    interface Post {
        _id: string;
        thumbnail: string;
        title: string;
        body: string;
        category: string;
        creatorAvatar: string;
        creatorName: string;
    }
    const { id } = useParams();
    const { setContextLoading, contextLoading } = useUser();
    const [post, setPost] = useState<Post>();

    useEffect(() => {
        const fetchPosts = async () => {
            setContextLoading(true);

            try {
                const response = await axios.get(`/api/posts/${id}`);
                setContextLoading(false);
                setPost(response?.data?.post);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setContextLoading(false);
            }
        };

        fetchPosts();
    }, [id, setContextLoading]);

    const myhtmlComp = post?.body;
    return (
        <>
            {contextLoading && (
                <div className="flex justify-center h-[100svh]">
                    <span className="loading loading-ring loading-lg md:w-20"></span>
                </div>
            )}
            {!contextLoading && (
                <div className="relative flex flex-col gap-[25px] md:gap-[30px] md:mx-10 md:flex-row my-6 md:mt-9">
                    <figure
                        className="absolute inset-0 m-0 h-full w-full rounded-xl bg-cover bg-center opacity-55 blur-lg"
                        style={{
                            backgroundImage: `url(${post?.thumbnail})`,
                        }}
                    >
                        {/* <div className="absolute inset-0 bg-black opacity-50 rounded-xl"></div> */}
                    </figure>

                    {/* LEFT */}
                    <div className="shrink-0 top-0 md:self-start md:z-30 self-center">
                        <span className="filter blur-0 transition duration-300 ease-in-out">
                            <div className="m-3 avatar rounded-md shadow-2xl shadow-[#020817]">
                                <div className="md:max-h-[38rem] rounded-lg">
                                    <img
                                        src={post?.thumbnail}
                                        alt="Post Thumbnail"
                                    />
                                </div>
                            </div>
                        </span>
                    </div>

                    {/* RIGHT */}
                    <div className="text-white md:overflow-y-auto md:h-[100vh] md:pt-[50px] mx-6 scrollbar-hide relative z-30">
                        {/* TITLE */}
                        <div className="text-2xl leading-8 z-30 md:text-4xl md:leading-10 mb-5">
                            {post?.title}
                        </div>
                        <div
                            className="text-[16px] leading-6 mb-4 opacity-75  md:text-xl md:leading-7"
                            dangerouslySetInnerHTML={{ __html: myhtmlComp! }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default page;
