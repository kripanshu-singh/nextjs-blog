"use client";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";

const Page = () => {
    const [image, setImage] = useState<File | null>(null);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!image) return;

            console.log("Form submitted with image:", image);
            const formData = new FormData();
            formData.append("file", image); // Updated key to "file"

            const response = await axios.post(
                "/api/user/change-avatar",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Response:", response);
            console.log("Response data:", response.data);
        } catch (error: any) {
            console.error("Error:", error.message);
        }
    };

    return (
        <div className="flex mt-10 justify-center">
            <form
                onSubmit={onSubmitHandler}
                className="overflow-hidden relative border-[1px] rounded-xl"
                name=""
                id=""
            >
                <label className="cursor-pointer bg-blue hover:bg-blue-light text-black font-bold py-2 px-4 w-full items-center flex justify-evenly rounded-xl">
                    <svg
                        fill="#000"
                        height="32"
                        viewBox="0 0 24 24"
                        width="32"
                        className="rounded-full border-[1px] p-2 cursor-pointer "
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                    </svg>
                    <span className="ml-2 cursor-pointer">Upload Document</span>
                    <input
                        onChange={onChangeHandler}
                        className="absolute block py-2 px-4 w-full opacity-0 pin-r pin-t cursor-pointer"
                        type="file"
                        name="file" // Updated name to "file"
                        accept="image/*"
                    />
                </label>
                <button
                    type="submit"
                    className="bg-blue hover:bg-blue-light text-black font-bold py-2 px-4 w-full mt-4 rounded-xl cursor-pointer"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Page;
