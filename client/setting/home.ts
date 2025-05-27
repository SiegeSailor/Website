import { Route } from "next";

import { TECHNOLOGY_ICON } from "@/setting/icon";

export const SUMMARY = [
  { title: "DevOps", portion: 1.5 },
  { title: "System Design", portion: 2 },
  { title: "Leadership", portion: 1.5 },
  { title: "Front-End", portion: 4 },
  { title: "Back-End", portion: 4.5 },
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

export const SKILL = [
  [
    { name: "Python", icon: TECHNOLOGY_ICON.Python },
    { name: "TypeScript", icon: TECHNOLOGY_ICON.TypeScript },
    { name: "JavaScript", icon: TECHNOLOGY_ICON.JavaScript },
    { name: "Bash", icon: TECHNOLOGY_ICON.Bash },
    { name: "C++", icon: TECHNOLOGY_ICON["C++"] },
    { name: ".NET", icon: TECHNOLOGY_ICON[".NET"] },
  ],
  [
    { name: "Docker", icon: TECHNOLOGY_ICON.Docker },
    { name: "AWS", icon: TECHNOLOGY_ICON.AWS },
    { name: "GCP", icon: TECHNOLOGY_ICON.GCP },
    { name: "GitHub", icon: TECHNOLOGY_ICON.GitHub },
    { name: "GitLab", icon: TECHNOLOGY_ICON.GitLab },
    { name: "Linux", icon: TECHNOLOGY_ICON.Linux },
    { name: "Kubernetes", icon: TECHNOLOGY_ICON.Kubernetes },
  ],
  [
    { name: "MongoDB", icon: TECHNOLOGY_ICON.MongoDB },
    { name: "MySQL", icon: TECHNOLOGY_ICON.MySQL },
    { name: "Redis", icon: TECHNOLOGY_ICON.Redis },
    { name: "RabbitMQ", icon: TECHNOLOGY_ICON.RabbitMQ },
    { name: "Nginx", icon: TECHNOLOGY_ICON.Nginx },
    { name: "Terraform", icon: TECHNOLOGY_ICON.Terraform },
  ],
  [
    { name: "Express.js", icon: TECHNOLOGY_ICON["Express.js"] },
    { name: "Flask", icon: TECHNOLOGY_ICON.Flask },
    { name: "Django", icon: TECHNOLOGY_ICON.Django },
  ],
  [
    { name: "React.js", icon: TECHNOLOGY_ICON["React.js"] },
    { name: "Tailwind CSS", icon: TECHNOLOGY_ICON["Tailwind CSS"] },
    { name: "Three.js", icon: TECHNOLOGY_ICON["Three.js"] },
    { name: "Electron", icon: TECHNOLOGY_ICON["Electron"] },
    { name: "Redux", icon: TECHNOLOGY_ICON["Redux"] },
    { name: "HTML", icon: TECHNOLOGY_ICON.HTML },
    { name: "CSS", icon: TECHNOLOGY_ICON.CSS },
    { name: "Webpack", icon: TECHNOLOGY_ICON.Webpack },
    { name: "Gulp", icon: TECHNOLOGY_ICON.Gulp },
    { name: "Babel", icon: TECHNOLOGY_ICON.Babel },
  ],
] as const;

export const PROJECT = [
  {
    title: "Dynamic Account Hub",
    description:
      "A scalable cloud-based web service that allows users to manage their accounts and settings. The service provides an event-driven architecture comes with a eventual consistency model.",
    href: "https://github.com/SiegeSailor/OpenSource.AccountHub",
  },
  {
    title: "Cryptography CLI",
    description:
      "A command-line interface for encrypting and decrypting files using various algorithms. The CLI also provides demonstration of the secured communication between two parties using different algorithms and methods.",
    href: "https://github.com/SiegeSailor/OpenSource.Formulas",
  },
] as Readonly<{ title: string; description: string; href: Route }[]>;
