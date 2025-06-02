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
        <div className="flex items-center justify-between p-4">
            <div className="flex flex-col">
                <span className="text-3xl font-semibold">
                    {title}
                </span>
                <div className="flex items-center font-medium space-x-2 mt-2">
                    {renderBreadcrumb()}
                </div>
            </div>
            <div className="flex space-x-2">
                {children}
            </div>
        </div>
    );
}
