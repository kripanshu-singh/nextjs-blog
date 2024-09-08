"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { PlaceholdersAndVanishInputDemo } from "./Search";
import { useUser } from "@/userContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const Navbar = () => {
    const {
        searchVal,
        setSearchVal,
        user,
        setUser,
        contextLoading,
        setContextLoading,
    } = useUser();
    console.log(`\n ~ Navbar ~ user :- `, user);

    // const isUserEmpty = Object.keys(user).length === 0; // Check if user object is empty
    // console.log(`\n ~ Navbar ~ isUserEmpty :- `, isUserEmpty);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            setContextLoading(true);
            const response = await axios.get("/api/user/logout");

            await router.push(`/`);
            console.log(`\n ~ fetchData ~ response :- `, response);

            console.log(
                `\n ~ fetchData ~ response.data :- `,
                response?.data?.user
            );
            setUser(response?.data?.user);
            setContextLoading(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            // Handle error, e.g., setUser(null);
            // setContextLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/user/user_from_token");
                console.log(`\n ~ fetchData ~ response :- `, response);

                console.log(
                    `\n ~ fetchData ~ response.data :- `,
                    response?.data?.user
                );
                setUser(response?.data?.user);
                // setContextLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                // setContextLoading(false);
                // Handle error, e.g., setUser(null);
            }
        };

        fetchData();

        // Ensure to add any dependencies if needed, e.g., [dependency]
    }, []);

    return (
        <div>
            {contextLoading && <></>}
            {!contextLoading && (
                <>
                    <div className="navbar border-b-2 ">
                        <div className="flex-1">
                            <Link
                                href={"/"}
                                className="btn btn-ghost text-xl"
                                onClick={() => setSearchVal("")}
                            >
                                daisyUI
                            </Link>
                        </div>
                        <div className="flex">
                            <div className="form-control md:block hidden w-24 md:w-auto">
                                <PlaceholdersAndVanishInputDemo />
                            </div>
                            {!user && (
                                <>
                                    <div className=" mx-2">
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href="/login"
                                                className="flex justify-between mx-2"
                                            >
                                                <HoverBorderGradient
                                                    className="bg-[#020817]"
                                                    containerClassName="rounded-full"
                                                    as="button"
                                                >
                                                    Login
                                                </HoverBorderGradient>
                                            </Link>
                                            <Link
                                                onClick={() =>
                                                    setContextLoading(true)
                                                }
                                                href="/signup"
                                                className="flex justify-between mx-2"
                                            >
                                                <HoverBorderGradient
                                                    className="bg-[#020817]"
                                                    containerClassName="rounded-full "
                                                    as="button"
                                                >
                                                    Register
                                                </HoverBorderGradient>
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                            {user && (
                                <>
                                    <div className="dropdown dropdown-end relative">
                                        <div
                                            tabIndex={0}
                                            role="button"
                                            className="btn btn-ghost btn-circle"
                                        >
                                            <div className="indicator">
                                                <svg
                                                    width="24px"
                                                    height="24px"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    stroke="currentColor"
                                                    strokeWidth="0.192"
                                                >
                                                    <g
                                                        id="SVGRepo_bgCarrier"
                                                        strokeWidth="0"
                                                    ></g>
                                                    <g
                                                        id="SVGRepo_tracerCarrier"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    ></g>
                                                    <g id="SVGRepo_iconCarrier">
                                                        <path
                                                            d="M1 22C1 21.4477 1.44772 21 2 21H22C22.5523 21 23 21.4477 23 22C23 22.5523 22.5523 23 22 23H2C1.44772 23 1 22.5523 1 22Z"
                                                            fill="currentColor"
                                                        ></path>
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M18.3056 1.87868C17.1341 0.707107 15.2346 0.707107 14.063 1.87868L3.38904 12.5526C2.9856 12.9561 2.70557 13.4662 2.5818 14.0232L2.04903 16.4206C1.73147 17.8496 3.00627 19.1244 4.43526 18.8069L6.83272 18.2741C7.38969 18.1503 7.89981 17.8703 8.30325 17.4669L18.9772 6.79289C20.1488 5.62132 20.1488 3.72183 18.9772 2.55025L18.3056 1.87868ZM15.4772 3.29289C15.8677 2.90237 16.5009 2.90237 16.8914 3.29289L17.563 3.96447C17.9535 4.35499 17.9535 4.98816 17.563 5.37868L15.6414 7.30026L13.5556 5.21448L15.4772 3.29289ZM12.1414 6.62869L4.80325 13.9669C4.66877 14.1013 4.57543 14.2714 4.53417 14.457L4.0014 16.8545L6.39886 16.3217C6.58452 16.2805 6.75456 16.1871 6.88904 16.0526L14.2272 8.71448L12.1414 6.62869Z"
                                                            fill="currentColor"
                                                        ></path>
                                                    </g>
                                                </svg>
                                                <span className="badge badge-xs indicator-item">
                                                    {user.posts}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            tabIndex={0}
                                            className="card card-compact dropdown-content bg-base-100 dark:bg-base-200 z-[80] mt-3 w-52 shadow"
                                        >
                                            <div className="card-body">
                                                <span className="text-lg font-bold">
                                                    {user.posts} Posts
                                                </span>
                                                <div className="card-actions">
                                                    <Link
                                                        href={"/view-post"}
                                                        onClick={() =>
                                                            setContextLoading(
                                                                true
                                                            )
                                                        }
                                                        className="btn btn-primary btn-block"
                                                    >
                                                        View Posts
                                                    </Link>
                                                    <Link
                                                        href={"/create"}
                                                        className="btn btn-accent btn-block"
                                                        onClick={() =>
                                                            setContextLoading(
                                                                true
                                                            )
                                                        }
                                                    >
                                                        Create Posts
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropdown dropdown-end relative">
                                        <div
                                            tabIndex={0}
                                            role="button"
                                            className="btn btn-ghost btn-circle avatar"
                                        >
                                            <div className="w-10 rounded-full">
                                                <img
                                                    alt={(user as any).username}
                                                    src={(user as any).avatar}
                                                />
                                            </div>
                                        </div>
                                        <ul
                                            tabIndex={0}
                                            className="menu menu-sm dropdown-content bg-base-100 dark:bg-base-200 rounded-box z-[80] mt-3 w-52 p-2 shadow"
                                        >
                                            {" "}
                                            <li>
                                                <Link
                                                    href={"/profile"}
                                                    className="justify-between"
                                                    onClick={() =>
                                                        setContextLoading(true)
                                                    }
                                                >
                                                    Profile
                                                </Link>
                                            </li>{" "}
                                            <li>
                                                <Link
                                                    href={"/editprofile"}
                                                    onClick={() =>
                                                        setContextLoading(true)
                                                    }
                                                >
                                                    Edit{" "}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={"/authors"}
                                                    onClick={() =>
                                                        setContextLoading(true)
                                                    }
                                                    className="justify-between"
                                                >
                                                    Authors
                                                </Link>
                                            </li>
                                            {/* <li className="md:hidden">
                                                <Link
                                                    onClick={() =>
                                                        setContextLoading(true)
                                                    }
                                                    href={"/random"}
                                                    className="justify-between"
                                                >
                                                    Random Blog
                                                    <span className="badge-xs px-1 rounded-sm">
                                                        Special
                                                    </span>
                                                </Link>
                                            </li> */}
                                            <li>
                                                <div className="form-control sm: md:hidden">
                                                    <PlaceholdersAndVanishInputDemo />
                                                </div>
                                            </li>
                                            <li>
                                                <span
                                                    // href={"login"}
                                                    className="link-error"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Navbar;
