import { Route } from "next";

import { TECHNOLOGY_ICON } from "@/setting/icon";

export const SUMMARY = [
  { title: "DevOps", portion: 1.25 },
  { title: "System Design", portion: 2.25 },
  { title: "Leadership", portion: 1.65 },
  { title: "Front-End", portion: 2.5 },
  { title: "Back-End", portion: 3.5 },
] as const;

export const EXPERIENCE = [
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
    time: "May 2025 - Present",
  },
] as const;

export const SKILL: (keyof typeof TECHNOLOGY_ICON)[][] = [
  ["Python", "TypeScript", "JavaScript", "Bash", "C++", ".NET"],
  ["Docker", "AWS", "GCP", "GitHub", "GitLab", "Linux", "Kubernetes"],
  ["MongoDB", "MySQL", "Redis", "RabbitMQ", "Nginx", "Terraform"],
  ["Express.js", "Flask", "Django"],
  [
    "React.js",
    "Tailwind CSS",
    "Three.js",
    "Electron",
    "Redux",
    "HTML",
    "CSS",
    "Webpack",
    "Gulp",
    "Babel",
  ],
] as const;

export const PROJECT = [
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
] as Readonly<{ title: string; description: string; href: Route }[]>;
