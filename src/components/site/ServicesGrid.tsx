import { Card, CardContent } from "@/components/m3e/card"
import { Icon } from "@/components/m3e/icon"
import { cn } from "@/lib/m3e/cn"
import { Reveal } from "./Reveal"
import { SERVICES, SECTION_TITLES } from "@/config"

/**
 * The seven Sharea services as consistent M3E filled cards in a responsive
 * grid. One short natural description each — no invented prices or promises.
 */
export function ServicesGrid() {
  return (
    <section aria-labelledby="services-title" className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <Reveal>
        <h2
          id="services-title"
          className="text-center font-heading text-headline-small font-semibold text-on-surface"
        >
          {SECTION_TITLES.services}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center font-body-ar text-body-medium text-on-surface-variant">
          {SECTION_TITLES.servicesIntro}
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service, i) => (
          <Reveal key={service.icon} className="h-full" style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
            <Card
              variant="filled"
              className={cn("h-full justify-start text-center [&>div]:items-center")}
            >
              <CardContent className="flex flex-col items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-primary-container text-on-primary-container">
                  <Icon name={service.icon} size={24} />
                </span>
                <h3 className="font-heading text-title-medium font-semibold text-on-surface">
                  {service.title}
                </h3>
                <p className="font-body-ar text-body-medium text-on-surface-variant">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
