import React from "react";

const CardSkeleton = () => {
    return (
        <div>
            <div className="flex gap-4 flex-col card bg-base-100 md:h-[32rem] md:w-[22rem] h-[32rem] w-[90svw] shadow-xl relative p-4">
                <div className="skeleton h-full bg-base-300  w-full"></div>
                <div className="skeleton h-4 w-28 bg-base-300"></div>
                <div className="skeleton h-4 w-full bg-base-300"></div>
                <div className="skeleton h-4 w-full bg-base-300"></div>
            </div>
        </div>
    );
};

export default CardSkeleton;
