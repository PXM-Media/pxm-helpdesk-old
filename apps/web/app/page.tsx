"use client";
import { useEffect, useState } from "react";

export default function Home() {
    const [brandName, setBrandName] = useState("Loading...");
    const [brandLogo, setBrandLogo] = useState("");

    useEffect(() => {
        fetch("http://localhost:3001/settings/public")
            .then(res => res.json())
            .then(data => {
                const name = data.find((s: any) => s.key === 'helpdesk_name')?.value;
                const logo = data.find((s: any) => s.key === 'helpdesk_logo')?.value;
                setBrandName(name || "PXM-Helpdesk");
                setBrandLogo(logo || "");
            })
            .catch(() => setBrandName("PXM-Helpdesk"));
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full text-center font-sans flex flex-col items-center">
                {brandLogo && <img src={brandLogo} alt="Logo" className="h-24 w-auto mb-6 object-contain" />}
                <h1 className="text-5xl font-bold mb-6 text-blue-600">{brandName} Portal</h1>
                <p className="mb-8 text-xl">Welcome to your support center.</p>

                <div className="flex gap-4 justify-center">
                    <a href="/portal/kb" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                        Browse Knowledge Base
                    </a>
                    <a href="/login" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
                        Agent Login
                    </a>
                </div>
            </div>
        </main>
    );
}
