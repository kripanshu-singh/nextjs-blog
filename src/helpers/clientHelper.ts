"use client";

export function searchByName(inputString: any, arrayOfObjects: any) {
    // Convert the input string to lowercase for case-insensitive search
    const searchString = inputString.toLowerCase();

    // Filter the array of objects based on the name property
    const result = arrayOfObjects?.filter((obj: any) =>
        obj.title.toLowerCase().includes(searchString)
    );

    return result;
}
