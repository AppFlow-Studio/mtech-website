import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  paginate,
  nextPage,
  prevPage,
}: PaginationProps) => {
  // Determine which page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3; // Number of pages to show around current page

    // Always show first page
    pages.push(1);

    // Add ellipsis if needed
    if (currentPage - maxVisiblePages > 1) {
      pages.push(-1); // -1 will represent ellipsis
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (currentPage + maxVisiblePages < totalPages) {
      pages.push(-1);
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages.filter(
      (page, index, array) => page !== -1 || array[index - 1] !== -1
    );
  };

  return (
    <nav className="flex items-center justify-between gap-2 mt-16">
      <button
        onClick={prevPage}
        disabled={currentPage === 1}
        className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-[#24044C33] dark:border-[#F0F3FD33] border ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <ArrowLeft className="h-5 w-5 text-[#672AB2] dark:text-white" />
      </button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === -1 ? (
            <button
              key={`ellipsis-${index}`}
              className="w-9 h-9 text-sm font-semibold rounded-full border dark:border-[#F0F3FD33] hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
              disabled
            >
              ...
            </button>
          ) : (
            <button
              key={pageNumber}
              onClick={() => paginate(pageNumber)}
              className={`w-9 h-9 text-sm font-semibold rounded-full ${
                currentPage === pageNumber
                  ? "bg-[#672AB2] text-white"
                  : "border dark:border-[#F0F3FD33] hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>

      <button
        onClick={nextPage}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-600"
            : "bg-[#672AB2] dark:bg-[#F0F3FD33]"
        } transition-colors border-[#24044C33] border`}
      >
        <ArrowRight className="h-5 w-5 text-white" />
      </button>
    </nav>
  );
};

export default Pagination;
