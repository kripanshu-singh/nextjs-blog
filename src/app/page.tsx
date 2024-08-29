"use client";

import { searchByName } from "@/helpers/clientHelper";
import CardSkeleton from "@/my_utils/CardSkeleton";
import { useUser } from "@/userContext";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function Home() {
    const { user, setUser, contextLoading, setContextLoading, searchVal } =
        useUser();
    const [posts, setPosts] = useState<Post[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setContextLoading(true);
            try {
                const userResponse = await axios.get(
                    "/api/user/user_from_token"
                );
                setUser(userResponse.data.user);

                const postsResponse = await axios.get(
                    "/api/posts/get-all-posts"
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
    }, [setUser, setContextLoading]);

    // const handleNavigation = async (id: string) => {
    //     setContextLoading(true);
    //     await router.push(`/${id}`);
    // };

    return (
        <>
            {contextLoading ? (
                <div className="flex justify-center h-[100svh]">
                    <span className="loading loading-ring loading-lg md:w-20"></span>
                </div>
            ) : (
                <div className="flex mx-auto px-5 md:px-11 py-4 flex-wrap justify-evenly gap-y-5 md:gap-y-10 gap-x-5">
                    {searchByName(searchVal, posts).map((post: any) => {
                        console.log(post.creatorID);
                        return (
                            <div
                                key={post._id}
                                className="card bg-base-100 md:h-[32rem] md:w-[22rem] h-[32rem] w-[90svw] shadow-xl relative "
                            >
                                <Link
                                    href={`/post/${post._id}`}
                                    onClick={() => setContextLoading(true)}
                                >
                                    <div
                                        className="absolute inset-0 m-0 h-full w-full rounded-xl bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${post.thumbnail})`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-[RGBA(26,25,28,0.6)] to-transparent mt-1">
                                            <div className="w-full h-24 md:h-32 lg:h-40 bg-gradient-to-b from-transparent to-[rgb(2,8,23)] absolute bottom-0 left-0"></div>
                                        </div>
                                    </div>
                                </Link>
                                <div className="badge badge-xs p-2 px-2 rounded-lg bg-base-200 z-50 mt-2 ml-2">
                                    <Link href={`/post-tag/${post.category}`}>
                                        {post.category}
                                    </Link>
                                </div>
                                <Link
                                    href={`/post/${post._id}`}
                                    className="card-body flex flex-col justify-end items-center text-center text-white z-10 p-6"
                                    onClick={() => setContextLoading(true)}
                                >
                                    <div
                                        className="avatar flex flex-col w-full items-center gap-1"
                                        style={{
                                            height: " -webkit-fill-available",
                                        }}
                                    >
                                        <p className=" text-2xl font-semibold mb-3">
                                            {/* <span className=" p-2 rounded-lg"> */}
                                            {post.title}
                                            {/* </span> */}
                                        </p>
                                        {/* <p className="text-2xl font-semibold mb-3">
                                            <span className="p-2 rounded-lg bg-base-100 glass bg-opacity-50 backdrop-blur-sm">
                                                {post.title}
                                            </span>
                                        </p> */}

                                        <div className="w-24 rounded-full border-2 border-white mb-[1rem]">
                                            <Link
                                                href={`/post-user/${post.creatorID}`}
                                            >
                                                <img
                                                    src={post.creatorAvatar}
                                                    alt="Creator Avatar"
                                                />
                                            </Link>
                                        </div>
                                        <Link
                                            href={`/post-user/${post.creatorID}`}
                                        >
                                            <span className="badge-lg badge-neutral h-fit px-2  rounded-lg">
                                                {post.creatorName}
                                                {/* {post.creatorID} */}
                                            </span>
                                        </Link>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
