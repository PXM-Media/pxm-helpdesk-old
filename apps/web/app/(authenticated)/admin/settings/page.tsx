"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const res = await fetch("http://localhost:3001/settings/admin");
        if (res.ok) {
            const data = await res.json();
            // Convert array to object key-value
            const map: any = {};
            data.forEach((s: any) => map[s.key] = s.value);
            setSettings(map);
        }
        setLoading(false);
    };

    const handleSave = async (section: string) => {
        // For MVP just saving all fields that seem relevant to the section, 
        // but strictly we just send whatever is in 'settings' state mapping back to array.
        const payload = Object.keys(settings).map(key => ({ key, value: settings[key] }));

        const res = await fetch("http://localhost:3001/settings/admin", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings: payload })
        });
        if (res.ok) {
            alert("Settings Saved!");
            // Force reload to update global context if we had one, or just re-fetch
            window.location.reload();
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">System Settings</h1>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>General Configuration</CardTitle>
                        <CardDescription>Basic settings for your helpdesk instance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Helpdesk Name</Label>
                            <Input
                                value={settings['helpdesk_name'] || ''}
                                onChange={e => setSettings({ ...settings, helpdesk_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Helpdesk Logo URL</Label>
                            <Input
                                value={settings['helpdesk_logo'] || ''}
                                placeholder="http://example.com/logo.png"
                                onChange={e => setSettings({ ...settings, helpdesk_logo: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Support Email Address</Label>
                            <Input
                                value={settings['support_email'] || ''}
                                onChange={e => setSettings({ ...settings, support_email: e.target.value })}
                            />
                        </div>
                        <Button onClick={() => handleSave('general')}>Save General Settings</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Email Server (SMTP)</CardTitle>
                        <CardDescription>Configure outgoing email settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>SMTP Host</Label>
                            <Input
                                value={settings['smtp_host'] || ''}
                                onChange={e => setSettings({ ...settings, smtp_host: e.target.value })}
                            />
                        </div>
                        <Button variant="secondary" onClick={() => alert("Test not implemented yet")}>Test Connection</Button>
                        <Button className="ml-2" onClick={() => handleSave('email')}>Save Email Settings</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
