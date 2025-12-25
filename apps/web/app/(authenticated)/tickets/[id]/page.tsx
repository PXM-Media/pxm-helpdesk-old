"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ArrowLeft, Clock, User } from "lucide-react"
import Link from "next/link"

export default function TicketDetailPage() {
    const params = useParams()
    const [ticket, setTicket] = useState<any>(null)

    useEffect(() => {
        const fetchTicket = async () => {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:3001/tickets/${params.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setTicket(await res.json())
            }
        }
        if (params.id) fetchTicket()
    }, [params.id])

    if (!ticket) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading ticket details...</div>

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                <Link href="/dashboard" className="text-sm font-medium">Back to Dashboard</Link>
            </div>

            <div className="grid gap-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{ticket.subject}</h1>
                            <span className="text-lg text-muted-foreground">#{ticket.id}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(ticket.createdAt).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {ticket.requester?.email || 'Unknown User'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${ticket.priority === 'HIGH' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                ticket.priority === 'MEDIUM' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            }`}>
                            {ticket.priority} Priority
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${ticket.status === 'NEW' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                ticket.status === 'CLOSED' ? 'bg-muted text-muted-foreground border-border' :
                                    'bg-primary/10 text-primary border-primary/20'
                            }`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>

                <Card className="border-border shadow-sm">
                    <CardHeader className="bg-muted/40 border-b border-border">
                        <CardTitle className="text-base font-semibold text-foreground">Description</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed min-h-[100px]">
                            {ticket.description}
                        </p>
                    </CardContent>
                </Card>

                {/* Placeholder for Conversation History */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-background px-2 text-sm text-muted-foreground">Conversation History</span>
                    </div>
                </div>

                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                    <p>Comments functionality coming soon.</p>
                </div>
            </div>
        </div>
    )
}
