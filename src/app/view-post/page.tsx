"use client";

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
}

export default function Page() {
    const { user, setUser, contextLoading, setContextLoading } = useUser();
    console.log(`\n ~ Page ~ contextLoading :- `, user);
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        try {
            setContextLoading(true);
            const response = await axios.get(`/api/posts/my-posts`);
            console.log(`\n ~ fetchPosts ~ response :- `, response);

            console.log(
                `\n ~ fetchPosts ~ response.data :- `,
                response?.data?.posts
            );
            setPosts(response?.data?.posts);
            setContextLoading(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setContextLoading(false);
            // Handle error, e.g., setUser(null);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const deletePost = async (id: string) => {
        console.log("All good, deleting");
        try {
            setContextLoading(true);
            await axios.get(`/api/posts/delete/${id}`);
            console.log(`\n ~ deletePost ~ post deleted`);
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post._id !== id)
            );
            setContextLoading(false);
        } catch (error) {
            console.error("Error deleting post:", error);
            setContextLoading(false);
        }
    };

    const router = useRouter();
    const handleNavigation = async (id: number) => {};
    return (
        <>
            {contextLoading && (
                <>
                    <div className="flex justify-center h-[100svh]">
                        <span className="loading loading-ring loading-lg md:w-20"></span>
                    </div>
                </>
            )}{" "}
            {/* {contextLoading && (
                <div className="flex mx-auto px-5 md:px-11 py-4 flex-wrap justify-evenly gap-y-5  md:gap-y-10 mt-5">
                    {[...Array(10)].map((_, index) => (
                        <div
                            className="card bg-base-100 md:h-[32rem] md:w-[22rem] h-[32rem] w-[90svw] shadow-xl relative "
                            key={index}
                        >
                            <CardSkeleton key={index} />
                        </div>
                    ))}
                </div>
            )} */}
            {!contextLoading && !posts.length && (
                <div
                    className="hero min-h-screen"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1719153863464-b2ee7e28b6df?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                    }}
                >
                    {" "}
                    <div className="hero-overlay bg-opacity-60"></div>
                    <div className="hero-content text-neutral-content text-center">
                        <div className="max-w-md">
                            <h1 className="mb-5 text-5xl font-bold">
                                Post not found
                            </h1>
                            <Link href={"/create"}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setContextLoading(true)}
                                >
                                    Create post
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            {!contextLoading && posts.length > 0 && (
                <div
                    className="flex mx-auto px-5 md:px-11 py-4 flex-wrap justify-evenly
                     gap-y-5  md:gap-y-10 "
                >
                    {posts.map((post) => {
                        const url = post?.thumbnail;

                        return (
                            <div
                                className="card bg-base-100 md:h-[32rem] md:w-[22rem] h-[32rem] w-[90svw] shadow-xl relative "
                                key={post._id}
                            >
                                <Link href={`/post/${post._id}`} key={post._id}>
                                    <Link
                                        href={`/post/${post._id}`}
                                        key={post._id}
                                        className="absolute inset-0 m-0 h-full w-full rounded-xl bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${url})`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-[RGBA(26,25,28,0.6)]  to-transparent mt-1">
                                            {" "}
                                            <div className=" w-full h-24 md:h-32 lg:h-40 bg-gradient-to-b from-transparent to-[rgb(2,8,23)] absolute bottom-0 left-0"></div>
                                        </div>
                                    </Link>
                                </Link>
                                <div className="badge badge-xs p-2 px-2 rounded-lg bg-base-200 z-50 mt-2 ml-2">
                                    <Link href={`/post-tag/${post.category}`}>
                                        {post.category}
                                    </Link>
                                </div>

                                <div className="card-body flex flex-col justify-end items-center text-center text-white z-10 p-6">
                                    <div className="avatar flex flex-col w-full items-center gap-1">
                                        <p className="text-2xl font-semibold mb-3">
                                            {post.title}
                                        </p>{" "}
                                    </div>
                                    <div className="flex gap-x-8">
                                        <Link
                                            href={`/edit-post/${post._id}`}
                                            onClick={() =>
                                                setContextLoading(true)
                                            }
                                        >
                                            <button className="btn btn-primary">
                                                Edit
                                            </button>
                                        </Link>

                                        <button
                                            className="btn btn-secondary z-[100]"
                                            onClick={() => deletePost(post._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
