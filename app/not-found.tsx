import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center px-5 pt-24"><div className="text-center"><p className="text-[10px] uppercase tracking-[.22em] text-violet">AURAÉ / 404</p><h1 className="mt-5 font-display text-6xl text-ink">This glow got away.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted">The page you’re looking for is no longer here, or maybe it was never part of the ritual.</p><Link href="/"><Button className="mt-8"><ArrowLeft size={15} /> Back to the edit</Button></Link></div></main>;
}
