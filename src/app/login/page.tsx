"use client";

import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/userContext";

const Page = () => {
    const router = useRouter();
    const { setUser } = useUser();

    const handleNavigation = async () => {
        await router.push("/");
    };
    const { user, contextLoading, setContextLoading } = useUser();

    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastError, setToastError] = useState<string>("");
    const [hideToast, setHideToast] = useState<boolean>(false);
    // const [loading, setLoading] = useState<boolean>(contextLoading);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setContextLoading(true);

            const response = await axios.post("/api/user/login", {
                email,
                password,
            });
            setContextLoading(false);

            if (response.data.error) {
                setToastError(response.data.error);
                setToastMessage("");
            } else {
                setUser(response.data.newUser);
                await handleNavigation();
                setToastMessage("User logged in Successfully");
            }

            setHideToast(false);
            setTimeout(() => setHideToast(true), 3000);
        } catch (error: any) {
            setContextLoading(false);
            console.error("Error:", error.message || error);
            setToastError("An error occurred. Please try again.");
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
                <div className="hero bg-base-200 min-h-screen">
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
                        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
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
                                            Email
                                        </span>
                                    </label>
                                    <input
                                        value={email}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => setEmail(e.target.value)}
                                        type="email"
                                        placeholder="email"
                                        className="input input-bordered"
                                        required
                                    />
                                </div>
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
                                        placeholder="password"
                                        className="input input-bordered"
                                        required
                                    />
                                    <label className="label">
                                        <a
                                            href="#"
                                            className="label-text-alt link link-hover"
                                        >
                                            Forgot password?
                                        </a>
                                    </label>
                                </div>
                                <div className="form-control mt-6">
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        Login
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
