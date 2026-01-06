import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { notFound } from "next/navigation";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import EventCard from "@/components/EventCard";
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

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { data: event } = await response.json();

  if (!event) return notFound();

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

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
              <BookEvent />
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
};

export default EventDetailsPage;
