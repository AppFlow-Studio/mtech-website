// components/Pagination.tsx
import { ArrowLeft, ArrowRight } from "lucide-react";

const Pagination = () => {
  return (
    <nav className="flex items-center justify-between gap-2 mt-16">
      <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-[#24044C33] dark:border-[#F0F3FD33] border">
        <ArrowLeft className="h-5 w-5 text-[#672AB2] dark:text-white" />
      </button>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 text-sm font-semibold rounded-full bg-[#672AB2] text-white">
          1
        </button>
        <button className="w-9 h-9 text-sm font-semibold rounded-full border dark:border-[#F0F3FD33] hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200">
          2
        </button>
        <button className="w-9 h-9 text-sm font-semibold rounded-full border dark:border-[#F0F3FD33] hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200">
          3
        </button>
        <button
          className="w-9 h-9 text-sm font-semibold rounded-full border dark:border-[#F0F3FD33] hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
          disabled
        >
          ...
        </button>
        <button className="w-9 h-9 text-sm font-semibold rounded-full border dark:border-[#F0F3FD33] hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200">
          10
        </button>
      </div>

      <button className="p-2 rounded-full bg-[#672AB2] dark:bg-[#F0F3FD33] transition-colors border-[#24044C33] border">
        <ArrowRight className="h-5 w-5 text-white" />
      </button>
    </nav>
  );
};

export default Pagination;
