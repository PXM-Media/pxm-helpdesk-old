"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, firstName, lastName })
            })

            if (res.ok) {
                toast.success("Account created successfully!", {
                    description: "You can now log in with your credentials."
                })
                router.push('/login')
            } else {
                toast.error("Registration failed", {
                    description: "Please check your details and try again."
                })
            }
        } catch (error) {
            toast.error("An error occurred", {
                description: "Please try again later."
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-40 animate-blob" />

            <Card className="w-full max-w-md z-10 shadow-2xl border-border backdrop-blur-sm bg-card/80">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold tracking-tight text-center text-foreground">Create account</CardTitle>
                    <p className="text-center text-muted-foreground">
                        Join us to get support and track your tickets
                    </p>
                </CardHeader>
                <CardContent className="grid gap-4 pt-4">
                    <form onSubmit={handleRegister} className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first">First Name</Label>
                                <Input id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="h-11" placeholder="John" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last">Last Name</Label>
                                <Input id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="h-11" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <Button className="w-full h-11 mt-2 text-base" type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full text-muted-foreground">
                        Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">Sign in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
