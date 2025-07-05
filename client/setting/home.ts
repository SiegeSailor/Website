import { Route } from "next";

import { TECHNOLOGY_ICON } from "@/setting/icon";

export const SUMMARY: Readonly<{ title: string; portion: number }>[] = [
  { title: "DevOps", portion: 1.75 },
  { title: "Back-End", portion: 3.5 },
  { title: "Front-End", portion: 2.5 },
  { title: "Leadership", portion: 1.75 },
  { title: "System Design", portion: 2.25 },
] as const;

export const EXPERIENCE: Readonly<{ title: string; time: string }[]> = [
  {
    title: "Software Engineer at Shopee",
    time: "Jan 2022 - Feb 2022",
  },
  {
    title: "Software Engineer at StageSource",
    time: "Sep 2022 - Dec 2022",
  },
  {
    title: "Master in Computer Science at Boston University",
    time: "May 2022 - Jan 2024",
  },
  {
    title: "Software Engineering Intern at CooperSurgical",
    time: "May 2023 - Aug 2023",
  },
  {
    title:
      "Certificate in Data Science and Machine Learning at Massachusetts Institute of Technology",
    time: "Aug 2023 - Nov 2023",
  },
  {
    title: "Software Engineer at CooperSurgical",
    time: "Jan 2024 - May 2025",
  },
  {
    title: "Senior Software Engineer at CooperSurgical",
    time: "Jun 2025 - Present",
  },
] as const;

export const SKILL: (keyof typeof TECHNOLOGY_ICON)[][] = [
  ["Python", "TypeScript", "JavaScript", "Bash", "C++", ".NET", "Go"],
  ["Docker", "AWS", "GCP", "GitHub", "GitLab", "Linux", "Kubernetes"],
  ["MongoDB", "MySQL", "Redis", "RabbitMQ", "Nginx", "Terraform"],
  ["Django", "Flask", "Express.js", "Next.js", "React.js"],
  [
    "Tailwind CSS",
    "Three.js",
    "Redux",
    "HTML",
    "CSS",
    "Webpack",
    "Gulp",
    "Babel",
    "Electron",
  ],
] as const;

export const PROJECT: Readonly<
  { title: string; description: string; href: Route }[]
> = [
  {
    title: "Dynamic Account Hub",
    description:
      "Scalable Cloud-Based Web Microservices that allows users to manage their accounts and settings. The CBWMs provides an event-driven architecture comes with a eventual consistency model and various communication protocols for different use cases.",
    href: "https://github.com/SiegeSailor/OpenSource.AccountHub",
  },
  {
    title: "Cryptography CLI",
    description:
      "A Command-Line Interface for encrypting and decrypting files using various algorithms. The CLI also provides demonstration of the secured communication between two parties using different algorithms and methods.",
    href: "https://github.com/SiegeSailor/OpenSource.Formulas",
  },
] as const;
