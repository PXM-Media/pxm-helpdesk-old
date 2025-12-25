"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function DashboardPage() {
    const [tickets, setTickets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTickets = async () => {
            const token = localStorage.getItem('token')
            if (!token) return;
            try {
                const res = await fetch('http://localhost:3001/tickets', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    setTickets(await res.json())
                }
            } finally {
                setLoading(false)
            }
        }
        fetchTickets()
    }, [])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your current support requests.
                    </p>
                </div>
                <Link href="/tickets/new">
                    <Button size="lg" className="shadow-lg shadow-primary/20">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Ticket
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary-foreground">{tickets.length}</div>
                        <p className="text-xs text-primary-foreground/80 mt-1 opacity-80">All time</p>
                    </CardContent>
                </Card>
                <Card className="bg-card text-card-foreground">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground">
                            {tickets.filter(t => t.status === 'NEW' || t.status === 'OPEN').length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
                    </CardContent>
                </Card>
                <Card className="bg-card text-card-foreground">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground">
                            {tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Completed</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-lg" />
                                ))}
                            </div>
                        ) : tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <Link key={ticket.id} href={`/tickets/${ticket.id}`} className="block group">
                                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all duration-200">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {ticket.subject}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Created {new Date(ticket.createdAt).toLocaleDateString()} &middot; ID: #{ticket.id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${ticket.priority === 'HIGH' ? 'bg-destructive/10 text-destructive' :
                                                    ticket.priority === 'MEDIUM' ? 'bg-orange-500/10 text-orange-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {ticket.priority}
                                            </span>
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${ticket.status === 'NEW' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    ticket.status === 'CLOSED' ? 'bg-muted text-muted-foreground' :
                                                        'bg-primary/10 text-primary'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>No tickets found.</p>
                                <Link href="/tickets/new" className="text-primary hover:underline mt-2 inline-block">
                                    Create your first ticket
                                </Link>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
