export interface Event {
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  description: string;
  slug: string;
}

export const events: Event[] = [
  {
    title: "Google I/O 2026",
    image: "/images/event1.png",
    date: "May 14-15, 2026",
    time: "10:00 AM - 6:00 PM PDT",
    location: "Shoreline Amphitheatre, Mountain View, CA",
    description:
      "Google's annual developer conference featuring the latest in Android, Chrome, Machine Learning, Cloud, and more. Join thousands of developers worldwide for keynotes, sessions, and hands-on demos.",
    slug: "google-io-2026",
  },
  {
    title: "AWS re:Invent 2026",
    image: "/images/event2.png",
    date: "November 30 - December 4, 2026",
    time: "8:00 AM - 8:00 PM PST",
    location: "Las Vegas Convention Center, NV",
    description:
      "The world's largest cloud computing conference by Amazon Web Services. Features technical sessions, training, certifications, and announcements of new AWS services and features.",
    slug: "aws-reinvent-2026",
  },
  {
    title: "Microsoft Build 2026",
    image: "/images/event3.png",
    date: "May 19-21, 2026",
    time: "9:00 AM - 5:00 PM PDT",
    location: "Seattle Convention Center, WA",
    description:
      "Microsoft's flagship developer conference showcasing the latest tools, technologies, and platforms including Azure, AI, .NET, and Microsoft 365. Connect with experts and fellow developers.",
    slug: "microsoft-build-2026",
  },
  {
    title: "React Summit 2026",
    image: "/images/event4.png",
    date: "June 13-17, 2026",
    time: "9:00 AM - 6:00 PM CEST",
    location: "Amsterdam, Netherlands",
    description:
      "The biggest React conference in Europe. Learn about React, React Native, GraphQL, and the latest web development trends from industry leaders and core team members.",
    slug: "react-summit-2026",
  },
  {
    title: "GitHub Universe 2026",
    image: "/images/event5.png",
    date: "October 29-30, 2026",
    time: "9:00 AM - 5:00 PM PDT",
    location: "Yerba Buena Center, San Francisco, CA",
    description:
      "GitHub's annual conference bringing together the developer community. Explore the future of software development with sessions on AI-powered development, DevOps, and open source.",
    slug: "github-universe-2026",
  },
  {
    title: "Next.js Conf 2026",
    image: "/images/event6.png",
    date: "October 24, 2026",
    time: "9:00 AM - 4:00 PM PDT",
    location: "Virtual & San Francisco, CA",
    description:
      "The official conference by Vercel for Next.js developers. Discover the latest features, best practices, and real-world use cases from the team behind Next.js and the community.",
    slug: "nextjs-conf-2026",
  },
];

export default events;
