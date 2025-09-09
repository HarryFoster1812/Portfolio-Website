import { DirNode } from "@/lib/filesystem_types";

export async function fetchFilesystem(): Promise<DirNode> {
    try {
        const res = await fetch("http://localhost:3000/api/terminal_filesystem");
        if (!res.ok) {
            throw new Error("Failed to fetch filesystem");
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching filesystem:", error);
        // Return a default, empty filesystem in case of error
        return { type: "dir", children: {} };
    }
}
