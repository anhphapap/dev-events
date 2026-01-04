import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  description: string;
  slug: string;
}
const EventCard = ({
  title,
  image,
  date,
  time,
  location,
  description,
  slug,
}: Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />
      <div className="flex gap-1 items-center">
        <Image src="/icons/pin.svg" alt="Pin" width={14} height={14}></Image>
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>
      <div className="flex gap-1 items-center justify-between">
        <div className="flex gap-1 items-center">
          <Image
            src="/icons/calendar.svg"
            alt="Calendar"
            width={14}
            height={14}
          ></Image>
          <p>{date}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Image
            src="/icons/clock.svg"
            alt="Clock"
            width={14}
            height={14}
          ></Image>
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
