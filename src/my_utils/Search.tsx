"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useUser } from "@/userContext";

export function PlaceholdersAndVanishInputDemo() {
    const {
        searchVal,
        setSearchVal,
        user,
        setUser,
        contextLoading,
        setContextLoading,
    } = useUser();

    const placeholders = [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?",
    ];
    console.log(searchVal);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchVal(e.target.value.toLowerCase());
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    return (
        <PlaceholdersAndVanishInput
        
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
        />
    );
}
