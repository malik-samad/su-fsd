"use client"; // This marks the component as a Client Component
import { useEffect, useState } from "react";
import { ItemType } from "./api/items/route";
import axios from "axios";

export default function Home() {
  const [sortOption, setSortOption] = useState("created at");
  const [showFilterDropDown, setShowFilterDropDown] = useState(false);
  const [files, setFiles] = useState<ItemType[]>([]);

  useEffect(() => {
    axios
      .get("/api/items?sortBy=" + sortOption)
      .then((res) => setFiles(res.data as never));
  }, [sortOption]);

  return (
    <div className="min-h-screen bg-gray-900 p-10">
      <div className="flex flex-col justify-between items-center mb-8">
        {/* Dropdown Menu */}
        <div
          className="relative inline-block text-left"
          onClick={() => setShowFilterDropDown(!showFilterDropDown)}
        >
          <div>
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              Sort by {sortOption}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Dropdown panel */}
          {showFilterDropDown && (
            <div
              className=" origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1 flex flex-col" role="none">
                <button
                  onClick={() => setSortOption("created at")}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  role="menuitem"
                >
                  Created at
                </button>
                <button
                  onClick={() => setSortOption("filename ascendent")}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  role="menuitem"
                >
                  Filename ascendent
                </button>
                <button
                  onClick={() => setSortOption("filename descendent")}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  role="menuitem"
                >
                  Filename descendent
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 gap-6">
        {files.map((file, i) => (
          <div
            key={i}
            className="col-span-1 items-center bg-gray-800 rounded-lg  border border-gray-300 shadow-md p-6"
          >
            <p className="text-sm text-white">{file["created at"]}</p>
            <p className="mt-2 text-lg text-white">{file.filename}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
