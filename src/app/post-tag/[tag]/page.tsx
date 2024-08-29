"use client";
import { searchByName } from "@/helpers/clientHelper";
import CardSkeleton from "@/my_utils/CardSkeleton";
import { useUser } from "@/userContext";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
    interface Post {
        _id: string;
        thumbnail: string;
        title: string;
        body: string;
        category: string;
        creator: string;
        creatorAvatar: string;
        creatorName: string;
        creatorID: string;
    }

    const { tag } = useParams();
    console.log(`\n ~ page ~ tag :- `, tag);

    const { setContextLoading, contextLoading, searchVal } = useUser();
    const [posts, setPosts] = useState<Post[]>([]);
    console.log(`\n ~ page ~ posts :- `, posts);

    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         setContextLoading(true);

    //         try {
    //             const response = await axios.get(`/api/posts/category/${tag}`);
    //             setContextLoading(false);
    //             setPosts(response?.data?.posts);
    //         } catch (error) {
    //             console.error("Error fetching user data:", error);
    //             setContextLoading(false);
    //         }
    //     };

    //     fetchPosts();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            setContextLoading(true);
            try {
                const postsResponse = await axios.get(
                    `/api/posts/category/${tag}`
                );
                const postsWithCreators = await Promise.all(
                    postsResponse.data.posts.map(async (post: Post) => {
                        const creatorResponse = await axios.get(
                            `/api/user/${post.creator}`
                        );
                        return {
                            ...post,
                            creatorName: creatorResponse.data.user.username,
                            creatorAvatar: creatorResponse.data.user.avatar,
                            creatorID: creatorResponse.data.user._id,
                        };
                    })
                );

                setPosts(postsWithCreators);
                setContextLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setContextLoading(false);
            }
        };

        fetchData();
    }, [setContextLoading]);

    return (
        // <></>
        <>
            {" "}
            {/* {contextLoading && (
                <div className="flex mx-auto px-5 md:px-11 py-4 flex-wrap justify-between gap-y-5  md:gap-y-10 mt-5">
                    {[...Array(10)].map((_, index) => (
                        <div className="card bg-base-100 md:h-[32rem] md:w-[22rem] h-[32rem] w-[90svw] shadow-xl relative ">
                            <CardSkeleton key={index} />
                        </div>
                    ))}
                 
                </div>
            )} */}
            {contextLoading && (
                <>
                    <div className="flex justify-center h-[100svh]">
                        <span className="loading loading-ring loading-lg md:w-20"></span>
                    </div>
                </>
            )}{" "}
            {!contextLoading && (
                <>
                    <div className="flex mx-auto px-5 md:px-11 py-4 flex-wrap justify-evenly gap-y-5  md:gap-y-10 ">
                        {searchByName(searchVal, posts).map((post: any) => {
                            const url = post?.thumbnail;

                            return (
                                <>
                                    <Link
                                        href={`/post/${post._id}`}
                                        key={post._id}
                                    >
                                        <div className="card bg-base-100 md:h-[32rem] md:w-[22rem] h-[32rem] w-[90svw] shadow-xl relative ">
                                            <figure
                                                className="absolute inset-0 m-0 h-full w-full rounded-xl bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url(${url})`,
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-[RGBA(26,25,28,0.6)]  to-transparent mt-1">
                                                    {" "}
                                                    <div className=" w-full h-24 md:h-32 lg:h-40 bg-gradient-to-b from-transparent to-[rgb(2,8,23)] absolute bottom-0 left-0"></div>
                                                    <ul className="flex flex-col gap-2 absolute top-0 left-0 m-2">
                                                        <li className="badge badge-xs p-2 px-2 rounded-lg bg-base-200">
                                                            {post.category}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </figure>
                                            <div className="card-body flex flex-col justify-end items-center text-center text-white z-10 p-6">
                                                <div className="avatar flex flex-col w-full items-center gap-1">
                                                    <p className="text-2xl font-semibold mb-3">
                                                        {post.title}
                                                    </p>
                                                    <div className="w-24  rounded-full border-2 border-white">
                                                        <img
                                                            src={
                                                                post.creatorAvatar
                                                            }
                                                        />
                                                    </div>
                                                    <span className="badge-lg badge-neutral h-fit px-2 rounded-lg">
                                                        {post.creatorName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
};

export default page;
