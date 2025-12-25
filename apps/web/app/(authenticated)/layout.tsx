"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { LayoutDashboard, PlusCircle, Settings, FileText, BarChart3, Users, Book, LogOut, Globe } from "lucide-react"

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/login')
    }

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

    const navItemClass = (path: string) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground ${pathname === path ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`

    return (
        <div className="flex min-h-screen w-full bg-background">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-card px-4 py-6 md:flex shadow-sm">
                <div className="mb-8 px-2 flex items-center gap-3">
                    <div className="bg-primary/10 p-1.5 rounded-lg">
                        {brandLogo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={brandLogo} alt="Logo" className="h-6 w-6 object-contain" />
                        ) : (
                            <Globe className="h-6 w-6 text-primary" />
                        )}
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">{brandName}</span>
                </div>

                <nav className="flex flex-col space-y-1 flex-1">
                    <Link href="/dashboard" className={navItemClass('/dashboard')}>
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link href="/tickets/new" className={navItemClass('/tickets/new')}>
                        <PlusCircle className="h-4 w-4" />
                        New Ticket
                    </Link>
                    {/* Placeholder for Profile - will implement page later if needed, or remove link to avoid confusion */}
                    {/* <Link href="/profile" className={navItemClass('/profile')}>
                        <Users className="h-4 w-4" />
                        Profile
                    </Link> */}

                    <div className="mt-8 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Admin Tools
                    </div>
                    <Link href="/admin/forms" className={navItemClass('/admin/forms')}>
                        <FileText className="h-4 w-4" />
                        Forms Builder
                    </Link>
                    <Link href="/admin/kb" className={navItemClass('/admin/kb')}>
                        <Book className="h-4 w-4" />
                        Knowledge Base
                    </Link>
                    <Link href="/admin/reporting" className={navItemClass('/admin/reporting')}>
                        <BarChart3 className="h-4 w-4" />
                        Reporting
                    </Link>
                    <Link href="/admin/settings" className={navItemClass('/admin/settings')}>
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </nav>

                <div className="mt-auto">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </aside>
            <main className="flex-1 md:ml-64 p-8 min-h-screen">
                <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}
