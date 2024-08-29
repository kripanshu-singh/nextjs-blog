"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
// import Test from "@/my_utils/RandomBlog";

import axios from "axios";
import { PlaceholdersAndVanishInputDemo } from "@/my_utils/Search";
import { useUser } from "@/userContext";
import { useRouter } from "next/navigation";
import { Editor } from "@tiptap/react";
import Tiptap from "@/my_utils/Tiptap";

const page = () => {
    const router = useRouter();

    const tags = [
        "Travel",
        "Entertainment",
        "Lifestyle",
        "Food",
        "Health",
        "Technology",
        "Education",
        "Finance",
        "Fashion_beauty",
        "DIY_craft",
        "Uncategorized",
    ];

    const [image, setImage] = useState<File | null>(null);
    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");

    const [category, setCategory] = useState<string>("");
    const { contextLoading, setContextLoading } = useUser();
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastError, setToastError] = useState<string>("");
    const [hideToast, setHideToast] = useState<boolean>(false);
    useEffect(() => setContextLoading(false), []);

    const handleNavigation = async () => {
        await router.push("/");
    };

    const onSubmitHandler = async () => {
        try {
            // if (!image) return;
            setContextLoading(true);
            console.log("Form submitted with image:", image);
            const formData = new FormData();

            // formData.append("image", image || null);
            if (image) {
                formData.append("image", image);
            }

            formData.append("title", title);
            formData.append("body", body);
            formData.append("category", category);
            console.log(`\n ~ onSubmitHandler ~ category :- `, category);
            console.log(`\n ~ onSubmitHandler ~ body :- `, body);
            console.log(`\n ~ onSubmitHandler ~ title :- `, title);
            console.log(`\n ~ onSubmitHandler ~ image :- `, image);

            const response = await axios.post(
                "/api/posts/createpost",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            // await handleNavigation();
            // console.log("Response:", response);
            // console.log("Response data:", response.data);
            if (response.data.error) {
                setToastError(response.data.error);
            } else {
                await handleNavigation();
                setToastError("");
                setToastMessage("Post Created Successfully");
            }
            setHideToast(false);
            setTimeout(() => setHideToast(true), 3000);
            setContextLoading(false);
        } catch (error: any) {
            console.error("Error:", error.message || error);
            setToastMessage("An error occurred. Please try again.");
            setHideToast(false);
            setTimeout(() => setHideToast(true), 3000);
            setContextLoading(false);
        }
    };
    const handleContentChange = (reason: any) => {
        console.log(body);
        setBody(reason);
    };

    return (
        <>
            {" "}
            {contextLoading && (
                <>
                    <div className="flex justify-center h-[100svh]">
                        <span className="loading loading-ring loading-lg md:w-20"></span>
                    </div>
                </>
            )}{" "}
            {!contextLoading && (
                <div className="flex flex-col items-center gap-y-2 my-7 mb-10 ">
                    {" "}
                    <label className="form-control w-full max-w-sm md:max-w-[55rem] ">
                        {!hideToast && toastMessage && (
                            <>
                                <div
                                    role="alert"
                                    className={`flex alert alert-success ${
                                        hideToast ? "opacity-0" : "opacity-100"
                                    }}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 shrink-0 stroke-current"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{toastMessage}</span>
                                </div>
                            </>
                        )}
                        {!hideToast && toastError && (
                            <>
                                <div
                                    role="alert"
                                    className={`flex alert alert-error ${
                                        hideToast ? "opacity-0" : "opacity-100"
                                    }}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 shrink-0 stroke-current"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{toastError}</span>
                                </div>
                            </>
                        )}

                        <div className="label">
                            <span className="label-text">Title</span>
                        </div>
                        <input
                            value={title!}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setTitle(e.target.value)
                            }
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-sm md:max-w-[55rem]"
                        />
                    </label>{" "}
                    <label className="form-control w-full max-w-sm md:max-w-[55rem] ">
                        <div className="label">
                            <span className="label-text">Blog </span>
                        </div>
                        {/* <textarea
                            value={body!}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                setBody(e.target.value)
                            }
                            className="textarea textarea-bordered w-full h-52 max-w-sm md:max-w-[55rem]"
                            style={{ whiteSpace: "pre-line" }}
                            placeholder="Body"
                        ></textarea> */}
                        <Tiptap
                            content={body}
                            onChange={(newContent: string) =>
                                handleContentChange(newContent)
                            }
                        />
                    </label>
                    {/*  */}
                    <div className="form-control w-full max-w-sm md:max-w-[55rem]">
                        <label className="form-control w-full max-w-sm md:max-w-[55rem] ">
                            <div className="label">
                                <span className="label-text">
                                    Select Category
                                </span>
                            </div>
                            <select
                                className="select select-bordered"
                                value={category}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setCategory(e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    select
                                </option>
                                {tags.map((tag, i) => (
                                    <option value={tag} key={i}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    {/*  */}
                    <label className="form-control w-full max-w-sm md:max-w-[55rem]">
                        <div className="label">
                            <span className="label-text">Pick a thumbnail</span>
                        </div>
                        <input
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                ) {
                                    setImage(e.target.files[0]);
                                }
                            }}
                            type="file"
                            className="file-input file-input-bordered w-full max-w-sm md:max-w-[55rem]"
                        />
                    </label>
                    <div className="flex gap-14">
                        <button
                            className="btn btn-outline btn-primary mt-5 "
                            onClick={onSubmitHandler}
                        >
                            Submit
                        </button>
                        <button
                            className="btn btn-outline btn-error mt-5"
                            onClick={() => {
                                setImage(null);
                                setBody("");
                                setTitle("");
                                setCategory("");
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default page;
