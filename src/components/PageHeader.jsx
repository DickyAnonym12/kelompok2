import React from "react";

export default function PageHeader({ title, breadcrumb, children }) {
    const renderBreadcrumb = () => {
        if (typeof breadcrumb === "string") {
            return <span className="text-gray-500">{breadcrumb}</span>;
        }

        if (Array.isArray(breadcrumb)) {
            return breadcrumb.map((item, index) => (
                <div key={index} className="flex items-center text-gray-500">
                    {index > 0 && <span className="mx-1">/</span>}
                    <span>{item}</span>
                </div>
            ));
        }

        return null;
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4">
            <div className="flex flex-col">
                <span className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                    {title}
                </span>
                <div className="flex items-center font-medium space-x-1 sm:space-x-2 mt-1 sm:mt-2 text-sm sm:text-base">
                    {renderBreadcrumb()}
                </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                {children}
            </div>
        </div>
    );
}
