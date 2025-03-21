
"use client";
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    updated_at: string;
    created_at: string;
    message: string;
}

export default function DynamicProjectPage({ params }: { params: Promise<{ projectName: string }> }) {
    const [projectData, setProjectData] = useState<GitHubRepo | null>(null);
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Await the promise to resolve params
                const { projectName } = await params;

                const data = await fetch(`https://api.github.com/repos/HarryFoster1812/${projectName}`);
                const json_data: GitHubRepo = await data.json();
                
                if (json_data.message === "Not Found") {
                    setError('404 Not Found');
                    setLoading(false);
                    return;
                }
                
                setProjectData(json_data);

                const mdData = await fetch(`https://raw.githubusercontent.com/HarryFoster1812/${projectName}/main/README.md`);
                if (mdData.ok) {
                    const mdText = await mdData.text();
                    setMarkdownContent(mdText);
                } else {
                    setError('README.md not found');
                }
            } catch {
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params]); // Ensure params dependency is tracked

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    if (projectData) {
        return (
            <>
                <h1>{projectData.name}</h1>
                <h2>{projectData.description}</h2>
                <div style={{ display: 'none' }}>
                    <pre>{JSON.stringify(projectData, null, 2)}</pre>
                </div>
                <div>
                    <h3>Project README:</h3>
                    <Markdown>{markdownContent}</Markdown>
                </div>
            </>
        );
    }

    return <h1>Project data is unavailable</h1>;
}

