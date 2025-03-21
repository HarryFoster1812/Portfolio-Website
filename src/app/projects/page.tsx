
"use client";
import { useState, useEffect } from "react";

// Define the structure of the object in the JSON data (GitHub repository structure)
interface Repo {
    id: number;
    name: string;
    description: string;
    updated_at: string;
    created_at: string;
}

function sort(json_data: Repo[], sortType: keyof Repo, ascendingType: string) {
    return json_data.sort((a, b) => {
        const aValue = a[sortType];
        const bValue = b[sortType];

        // If the values are strings, use localeCompare
        if (typeof aValue === "string" && typeof bValue === "string") {
            if (ascendingType === "asc") {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        }

        // If the values are numbers, just compare them directly
        if (typeof aValue === "number" && typeof bValue === "number") {
            if (ascendingType === "asc") {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        }

        // If we encounter unexpected types, return 0 (no sorting)
        return 0;
    });
}

export default function Projects() {
    const [repos, setRepos] = useState<Repo[]>([]); // Store the raw data
    const [sortedData, setSortedData] = useState<Repo[]>([]); // Store the sorted data
    const [sortType, setSortType] = useState<keyof Repo>('updated_at');
    const [ascendingType, setAscendingType] = useState('asc');

    // Sort the data when the sortType or ascendingType changes
    useEffect(() => {
        if (repos.length > 0) {
            const sorted = sort(repos, sortType, ascendingType);
            setSortedData(sorted);
        }
    }, [sortType, ascendingType, repos]); // Sort whenever sortType or ascendingType changes

    // Fetch data only once when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://api.github.com/users/HarryFoster1812/repos");
                const data: Repo[] = await response.json(); // Type the fetched data as Repo[]

                // Set the raw data and also sort it initially
                setRepos(data);
                const sorted = sort(data, sortType, ascendingType);
                setSortedData(sorted);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Only run this once when the component mounts

    return (
        <>
            <div className="flex justify-center items-center flex-col">
                <p>Projects</p>
                
                {/* Sort Type Dropdown */}
                <select className="bg-black text-white" onChange={(e) => setSortType(e.target.value as keyof Repo)} value={sortType}>
                    <option value="name">Name</option>
                    <option value="updated_at">Updated Date</option>
                    <option value="created_at">Created Date</option>
                </select>

                {/* Ascending/Descending Dropdown */}
                <select className="bg-black text-white" onChange={(e) => setAscendingType(e.target.value)} value={ascendingType}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>

                {/* Display Sorted Data */}
                {sortedData.length === 0 ? (
                    <p>Loading projects...</p> // Show loading message when no data is available
                ) : (
                    sortedData.map((repo) => (
                        <div key={repo.id}>
                            <p>{repo.name}</p>
                            <p>{repo.description}</p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

