import Image from "next/image";
import { notFound } from "next/navigation";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import { cache } from "react";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Image src={icon} alt={alt} width={14} height={14} />
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agenda }: { agenda: string[] }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agenda?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex gap-1.5">
      {tags?.map((item) => (
        <div key={item} className="pill">
          {item}
        </div>
      ))}
    </div>
  );
};

export default async function EventDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  "use cache";
  cacheLife("hours");
  const { slug } = await params;

  let event;
  try {
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!request.ok) {
      if (request.status === 404) {
        return notFound();
      }
      throw new Error(`Failed to fetch event: ${request.statusText}`);
    }

    const response = await request.json();
    event = response.data;

    if (!event) {
      return notFound();
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    return notFound();
  }

  const similarEvents: IEvent[] = await cache(async (): Promise<IEvent[]> => {
    const similarEvents = await getSimilarEventsBySlug(event.slug);
    return similarEvents as IEvent[];
  })();

  return (
    <section id="event">
      <div>
        <div className="header">
          <h1>{event.title}</h1>
          <p>{event.description}</p>
        </div>
        <div className="details">
          <div className="content">
            <Image
              src={event.image}
              alt={event.title}
              width={800}
              height={800}
              className="banner"
            />
            <section className="flex-col-gap-2">
              <h2>Overview</h2>
              <p>{event.overview}</p>
            </section>
            <section className="flex-col-gap-2">
              <h2>Event Details</h2>
              <EventDetailItem
                icon="/icons/calendar.svg"
                alt="Date"
                label={event.date}
              />
              <EventDetailItem
                icon="/icons/clock.svg"
                alt="Time"
                label={event.time}
              />
              <EventDetailItem
                icon="/icons/pin.svg"
                alt="Location"
                label={event.location}
              />
              <EventDetailItem
                icon="/icons/mode.svg"
                alt="Mode"
                label={event.mode}
              />
              <EventDetailItem
                icon="/icons/audience.svg"
                alt="Audience"
                label={event.audience}
              />
            </section>
            <EventAgenda agenda={event.agenda} />
            <section className="flex-col-gap-2">
              <h2>About the organizer</h2>
              <p>{event.organizer}</p>
            </section>
            <EventTags tags={event.tags} />
          </div>
          <aside className="booking">
            <div className="signup-card">
              <h2>Book your spot</h2>
              <BookEvent eventId={event._id} />
            </div>
          </aside>
        </div>
      </div>
      <div className="flex flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents &&
            similarEvents.length > 0 &&
            similarEvents.map((event: IEvent) => (
              <EventCard key={event.slug} {...event} />
            ))}
        </div>
      </div>
    </section>
  );
}
