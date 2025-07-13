export default function PageHeader2() {
    return (
        <div id="pageheader-container" className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4">
            <div id="pageheader-left" className="flex flex-col">
                <span id="page-title" className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                    Dashboard
                </span>
                <div id="breadcrumb-links" className="flex items-center font-medium space-x-1 sm:space-x-2 mt-1 sm:mt-2 text-sm sm:text-base">
                    <span id="breadcrumb-home" className="text-gray-500">Dashboard</span>
                    <span id="breadcrumb-separator" className="text-gray-500">/</span>
                    <span id="breadcrumb-current" className="text-gray-500">Order List</span>
                </div>
            </div>
            <div id="action-button" className="mt-3 sm:mt-0">
                <button id="add-button" className="bg-hijau text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base">
		                Add Button
		            </button>
            </div>
        </div>
    );
}