"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/userContext";

const Page = () => {
    const router = useRouter();
    const { user, contextLoading, setContextLoading } = useUser();
    const [username, setUsername] = useState<string>(user?.username || "");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarURL, setAvatarURL] = useState<string | null>(
        user?.avatar || ""
    );
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastError, setToastError] = useState<string>("");
    const [hideToast, setHideToast] = useState<boolean>(false);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setAvatar(file);
            setAvatarURL(URL.createObjectURL(file));
        }
    };

    const handleNavigation = async () => {
        await router.push("/");
    };

    useEffect(() => setContextLoading(false), []);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setContextLoading(true);
        try {
            const formData = new FormData();
            formData.append("username", username);
            if (avatar) {
                formData.append("avatar", avatar);
            }

            const response = await axios.post(
                `/api/user/update-user/${user._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.error) {
                setToastError(response.data.error);
            } else {
                setToastMessage("User Updated Successfully");
                await handleNavigation();
            }
            setHideToast(false);
            setTimeout(() => setHideToast(true), 3000);
        } catch (error: any) {
            setToastError("An error occurred. Please try again.");
            setHideToast(false);
            setTimeout(() => setHideToast(true), 3000);
        } finally {
            setContextLoading(false);
        }
    };

    return (
        <div>
            {contextLoading && (
                <div className="flex justify-center h-[100svh]">
                    <span className="loading loading-ring loading-lg md:w-20"></span>
                </div>
            )}
            {!contextLoading && (
                <div className="hero min-h-screen bg-[#020817]">
                    <div className="hero-content flex-col lg:flex-row-reverse mx-1 md:mx-28 md:gap-x-32">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl font-bold">Login now!</h1>
                            <p className="py-6">
                                Provident cupiditate voluptatem et in. Quaerat
                                fugiat ut assumenda excepturi exercitationem
                                quasi. In deleniti eaque aut repudiandae et a id
                                nisi.
                            </p>
                        </div>
                        <div className="card bg-[#040C20] w-full max-w-sm shrink-0 shadow-2xl">
                            {!hideToast && toastMessage && (
                                <div
                                    role="alert"
                                    className={`flex alert alert-success ${
                                        hideToast ? "opacity-0" : "opacity-100"
                                    }`}
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
                            )}
                            {!hideToast && toastError && (
                                <div
                                    role="alert"
                                    className={`flex alert alert-error ${
                                        hideToast ? "opacity-0" : "opacity-100"
                                    }`}
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
                            )}

                            <form
                                className="card-body"
                                onSubmit={onSubmitHandler}
                            >
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Full name
                                        </span>
                                    </label>
                                    <input
                                        value={username || user?.username}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => setUsername(e.target.value)}
                                        type="text"
                                        placeholder="Full name"
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                <label className="form-control w-full max-w-sm md:max-w-[55rem]">
                                    <div className="label">
                                        <span className="label-text">
                                            Pick a thumbnail
                                        </span>
                                    </div>
                                    <input
                                        onChange={handleImageChange}
                                        type="file"
                                        className="file-input file-input-bordered w-full max-w-sm md:max-w-[55rem]"
                                    />
                                    {avatarURL && (
                                        <div className="avatar mx-auto mt-5">
                                            <div className="w-28 md:w-32 ring-2 md:ring-4 ring-white rounded-full">
                                                <img
                                                    src={
                                                        avatarURL ||
                                                        user?.avatar
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </label>

                                <div className="form-control mt-6">
                                    <button
                                        className={`btn btn-primary ${
                                            contextLoading ? "btn-disabled" : ""
                                        }`}
                                        type="submit"
                                        disabled={contextLoading}
                                    >
                                        {contextLoading
                                            ? "Updating..."
                                            : "Update"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
