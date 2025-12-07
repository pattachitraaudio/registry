"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrench, Sparkles, ArrowRight, Mail } from "lucide-react";

export default function Maintenance() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden px-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" />
                <div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow"
                    style={{ animationDelay: "1.5s" }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-4xl w-full text-center">
                {/* Floating icon */}
                <div className="mb-8 inline-flex items-center justify-center animate-float">
                    <div className="relative">
                        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl scale-150" />
                        <div className="relative bg-card border border-border p-6 rounded-full">
                            <Wrench className="w-12 h-12 text-accent" />
                        </div>
                    </div>
                </div>

                {/* Giant typography */}
                <div className="animate-slide-up">
                    <h1 className="text-[clamp(3rem,15vw,12rem)] font-bold leading-none tracking-tighter text-foreground">
                        WO
                        <span className="text-accent">R</span>K
                    </h1>
                    <h1 className="text-[clamp(2rem,10vw,8rem)] font-bold leading-none tracking-tighter text-muted-foreground -mt-2 md:-mt-4">
                        IN PROGRESS
                    </h1>
                </div>

                {/* Subtext */}
                <p
                    className="mt-8 text-muted-foreground text-lg md:text-xl max-w-md mx-auto animate-slide-up"
                    style={{ animationDelay: "0.2s" }}
                >
                    We&apos;re crafting something extraordinary. Our team is working hard to bring you an amazing
                    experience.
                </p>

                {/* Status indicator */}
                <div
                    className="mt-8 flex items-center justify-center gap-3 animate-slide-up"
                    style={{ animationDelay: "0.3s" }}
                >
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                    </span>
                    <span className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
                        Under Maintenance
                    </span>
                </div>

                {/* Email signup */}
                <div className="mt-12 animate-slide-up" style={{ animationDelay: "0.4s" }}>
                    {!isSubmitted ? (
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
                        >
                            <div className="relative w-full sm:flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-card border-border h-12 text-foreground placeholder:text-muted-foreground focus:ring-accent"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-6 gap-2"
                            >
                                Notify Me
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-accent">
                            <Sparkles className="w-5 h-5" />
                            <span className="font-medium">Thanks! We&apos;ll keep you updated.</span>
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div
                    className="mt-16 pt-8 border-t border-border/50 animate-slide-up"
                    style={{ animationDelay: "0.5s" }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                        <a href="mailto:hello@example.com" className="hover:text-accent transition-colors">
                            hello@example.com
                        </a>
                        <span className="hidden sm:block">•</span>
                        <span className="font-mono">Expected: Coming Soon</span>
                    </div>
                </div>
            </div>

            {/* Bottom decorative bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent/30">
                <div className="h-full w-1/3 bg-accent animate-pulse" />
            </div>
        </main>
    );
}
