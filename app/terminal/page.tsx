// app/terminal/page.tsx

import TerminalClient from "./TerminalClient";
import { fetchFilesystem } from "./data"; // Import the server-side data fetching function

export default async function TerminalPage() {
    const rootFS = await fetchFilesystem();

    return (
        <main>
            <TerminalClient rootFS={rootFS} />
        </main>
    );
}
