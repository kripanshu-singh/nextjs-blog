"use client";

import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/userContext";

const Page = () => {
    const router = useRouter();

    const handleNavigation = async () => {
        await router.push("/login");
    };

    const { user, contextLoading, setContextLoading } = useUser();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarURL, setAvatarURL] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastError, setToastError] = useState<string>("");
    const [hideToast, setHideToast] = useState<boolean>(false);
    // const [loading, setLoading] = useState<boolean>(contextLoading);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setAvatar(file);
            setAvatarURL(URL.createObjectURL(file));
        }
    };

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setContextLoading(true);
        try {
            if (!avatar) {
                return setToastError("Avatar is required");
            }
            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("avatar", avatar);

            const response = await axios.post("/api/user/signup", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Response:", response);
            console.log("Response data:", response.data);
            if (response.data.error) {
                setToastError(response.data.error);
            } else {
                await handleNavigation();
                setToastMessage("User Created Successfully");
            }
            setHideToast(false);
            setTimeout(() => setHideToast(true), 3000);
            setContextLoading(false);
        } catch (error: any) {
            setContextLoading(false);
            console.error("Error:", error.message || error);
            setToastMessage("An error occurred. Please try again.");
            setHideToast(false);
            setTimeout(() => setHideToast(true), 3000);
        }
    };
    setContextLoading(false);

    return (
        <div>
            {contextLoading && (
                <div className="flex justify-center h-[100svh]">
                    <span className="loading loading-ring loading-lg md:w-20"></span>
                </div>
            )}
            {!contextLoading && (
                <>
                    <div className="hero bg-base-200 min-h-screen">
                        <div className="hero-content flex-col lg:flex-row-reverse mx-1 md:mx-28 md:gap-x-32">
                            <div className="text-center lg:text-left">
                                <h1 className="text-5xl font-bold">
                                    Login now!
                                </h1>
                                <p className="py-6">
                                    Provident cupiditate voluptatem et in.
                                    Quaerat fugiat ut assumenda excepturi
                                    exercitationem quasi. In deleniti eaque aut
                                    repudiandae et a id nisi.
                                </p>
                            </div>
                            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                                {!hideToast && toastMessage && (
                                    <>
                                        <div
                                            role="alert"
                                            className={`flex alert alert-success ${
                                                hideToast
                                                    ? "opacity-0"
                                                    : "opacity-100"
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
                                                hideToast
                                                    ? "opacity-0"
                                                    : "opacity-100"
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
                                            value={username}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) => setUsername(e.target.value)}
                                            type="text"
                                            placeholder="Full name"
                                            className="input input-bordered"
                                            required
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">
                                                Email
                                            </span>
                                        </label>
                                        <input
                                            value={email}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) => setEmail(e.target.value)}
                                            type="email"
                                            placeholder="Email"
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
                                                    <img src={avatarURL} />
                                                </div>
                                            </div>
                                        )}
                                    </label>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">
                                                Password
                                            </span>
                                        </label>
                                        <input
                                            value={password}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) => setPassword(e.target.value)}
                                            type="password"
                                            placeholder="Password"
                                            className="input input-bordered"
                                            required
                                        />
                                    </div>
                                    <div className="form-control mt-6">
                                        <button
                                            className="btn btn-primary"
                                            type="submit"
                                        >
                                            Signup
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}{" "}
        </div>
    );
};

export default Page;
