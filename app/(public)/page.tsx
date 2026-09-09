import Link from 'next/link'
import Image from 'next/image'
import {
  QrCode,
  MonitorPlay,
  Lightning,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Image as ImageIcon,
} from '@phosphor-icons/react/dist/ssr'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/status-badge'

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <FeatureGrid />
        <HowItWorks />
        <Pricing />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.png" alt="" width={28} height={28} className="rounded-md" />
          <span className="text-[15px] font-semibold tracking-tight">OMNI Share</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/room/d3f2d9fc-36fd-47e3-8b28-fccf43433d23/wall">See a live wall</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/join">
              Join with a code <ArrowRight weight="bold" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="container grid gap-14 py-16 md:grid-cols-2 md:items-center md:py-24 lg:py-28">
      <div className="max-w-xl">
        <Badge variant="outline" className="mb-6 gap-1.5 border-primary/25 bg-primary/5 py-1 text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          Real-time · No account needed · Free to join
        </Badge>
        <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
          Your event, <span className="text-primary">on the wall.</span>
        </h1>
        <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
          Guests upload photos, you approve them, everyone sees them live on a big screen. Perfect
          for weddings, conferences, and every moment worth sharing.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="px-6">
            <Link href="/join">
              Join with a code <ArrowRight weight="bold" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="px-6">
            <Link href="/room/d3f2d9fc-36fd-47e3-8b28-fccf43433d23/wall">See a live wall</Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">Enter the 6-letter code from your host.</p>
      </div>
      <WallPreview />
    </section>
  )
}

function WallPreview() {
  const tiles = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-600',
    'from-rose-400 to-red-500',
    'from-indigo-400 to-blue-600',
    'from-yellow-400 to-amber-500',
    'from-cyan-400 to-sky-600',
  ]
  return (
    <div className="relative">
      <div className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-2xl" />
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-12px_rgba(0,0,0,0.14)]">
        <div className="flex items-center gap-1.5 border-b border-border/70 bg-muted/30 px-4 py-3">
          <div className="size-3 rounded-full bg-destructive/30" />
          <div className="size-3 rounded-full bg-warning/40" />
          <div className="size-3 rounded-full bg-success/40" />
          <div className="mx-4 flex h-5 flex-1 items-center rounded-md bg-muted px-3">
            <span className="font-mono text-xs text-muted-foreground">wall.omnidesk.one/room/tech-summit/wall</span>
          </div>
        </div>
        <div className="bg-zinc-950 p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tiles.map((g, i) => (
              <div
                key={i}
                className={`flex items-center justify-center rounded-lg bg-gradient-to-br opacity-90 ${g} ${
                  i % 3 === 0 ? 'h-28' : i % 3 === 1 ? 'h-36' : 'h-24'
                }`}
              >
                <ImageIcon className="size-6 text-white/60" weight="thin" />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between px-1">
            <span className="text-xs font-medium text-white/40">Tech Summit 2026 — Live Wall</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              24 guests online
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TrustStrip() {
  const items = [
    { icon: QrCode, label: 'Join by code, no app needed' },
    { icon: Lightning, label: 'Photos on the wall within seconds' },
    { icon: ShieldCheck, label: 'Every photo moderated first' },
    { icon: MonitorPlay, label: 'Cast to any screen' },
  ]
  return (
    <section className="border-y border-border/60 bg-muted/20">
      <div className="container grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:gap-8">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Icon className="size-4 shrink-0 text-primary" />
            {label}
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Join with a code', description: 'Your host shares a 6-character code. Enter it on your phone — no account, no app download.' },
    { n: '02', title: 'Upload your photos', description: 'Take a shot or pick from your gallery. Drag and drop or tap to upload — up to 10 at once.' },
    { n: '03', title: 'See it on the wall', description: 'Once approved, your photo appears live on the big screen for everyone to enjoy.' },
  ]
  return (
    <section id="workflow" className="py-20 md:py-28">
      <div className="container">
        <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Three steps, zero friction.
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <div key={s.n}>
              <span className="text-sm font-medium text-primary">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureGrid() {
  return (
    <section id="platform" className="container py-20 md:py-28">
      <div className="max-w-2xl">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Built for the moment, not just the memory.
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          A guest sees their own photo on the big screen minutes after taking it — not buried in
          an album days later.
        </p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-6 md:grid-rows-2">
        <FeatureCard
          className="md:col-span-4 md:row-span-1"
          icon={QrCode}
          title="Join with a code, upload in seconds"
          description="Your host shares a 6-character code. Guests upload straight from their phone — no app to install, no account to create."
        />
        <FeatureCard
          className="md:col-span-2 md:row-span-2"
          icon={MonitorPlay}
          title="Cast to any screen in the room"
          description="A TV, a projector, a monitor — the wall is built for a massive screen at a conference and works just as well on a laptop for a small gathering."
        />
        <FeatureCard
          className="md:col-span-2 md:row-span-1"
          icon={Lightning}
          title="Live within seconds"
          description="Approved photos appear on the wall the moment they're approved — no refreshing, no waiting."
        />
        <FeatureCard
          className="md:col-span-2 md:row-span-1"
          icon={ShieldCheck}
          title="Every photo moderated first"
          description="Nothing hits the wall without your approval — full control over what the room sees."
        />
        <FeatureCard
          className="md:col-span-6 md:row-span-1 md:flex-row md:items-center md:gap-8"
          icon={CheckCircle}
          title="Every guest's photo, not just the official ones"
          description="Weddings, conferences, launches — every moment worth sharing ends up on the wall, not scattered across a dozen camera rolls."
          wide
        />
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  className = '',
  wide = false,
}: {
  icon: PhosphorIcon
  title: string
  description: string
  className?: string
  wide?: boolean
}) {
  return (
    <div
      className={`group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 transition-colors hover:border-primary/30 ${
        wide ? 'md:flex-row' : ''
      } ${className}`}
    >
      <div className={wide ? 'md:max-w-md' : ''}>
        <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-[18px]" weight="duotone" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function Pricing() {
  const tiers = [
    { name: 'Free trial', price: 'Free', period: 'first month', features: ['Full access, all features', 'No commitment', 'Cancel before billing'], cta: 'Start free', variant: 'secondary' as const },
    { name: 'Monthly', price: '$10', period: '/month', features: ['All features included', 'Unlimited usage', 'Priority support'], cta: 'Get started', variant: 'primary' as const },
    { name: 'Annual', price: '$100', period: '/year', features: ['Everything in Monthly', '2 months free', 'Annual receipt'], cta: 'Get started', variant: 'primary' as const, badge: 'Best value' },
  ]
  return (
    <section id="pricing" className="container py-20 md:py-28">
      <div className="text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Simple, transparent pricing</h2>
        <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground">Start free for your first month. No credit card required.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div key={t.name} className={`relative flex flex-col rounded-xl border p-8 ${t.badge ? 'border-2 border-primary' : 'border-border/80'}`}>
            {t.badge && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                {t.badge}
              </span>
            )}
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.name}</p>
            <div className="mb-2 mt-4 flex items-end gap-1">
              <span className="text-4xl font-semibold tracking-tight">{t.price}</span>
              <span className="mb-1 text-sm text-muted-foreground">{t.period}</span>
            </div>
            <ul className="mb-8 mt-4 flex-1 space-y-3 text-sm text-muted-foreground">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="mt-0.5 size-4 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant={t.variant} className="w-full justify-center">
              <Link href="/join">{t.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="container pb-20 md:pb-28">
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-foreground px-8 py-16 text-center text-background md:px-16">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Ready to join?</h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-background/70">
            Get your code from the event host and start sharing in seconds.
          </p>
          <Button asChild size="lg" className="mt-8 justify-center bg-background px-6 !text-foreground hover:bg-background/90">
            <Link href="/join">
              Enter your room code <ArrowRight weight="bold" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-6">
      <div className="container flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Image src="/icon.png" alt="" width={18} height={18} className="rounded" />
          <span>OMNI Share</span>
        </div>
        <p>&copy; {new Date().getFullYear()} OMNI Share. All rights reserved.</p>
      </div>
    </footer>
  )
}
