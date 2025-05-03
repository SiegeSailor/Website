import * as next from "next";
import {
  SiAmazon,
  SiCplusplus,
  SiCss3,
  SiDjango,
  SiDocker,
  SiDotnet,
  SiExpress,
  SiFlask,
  SiGithub,
  SiGitlab,
  SiGnubash,
  SiGooglecloud,
  SiHtml5,
  SiReact,
  SiJavascript,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNginx,
  SiPython,
  SiRabbitmq,
  SiTerraform,
  SiTypescript,
  SiWebpack,
  SiGulp,
  SiBabel,
  SiRedux,
  SiRedis,
  SiTailwindcss,
  SiThreedotjs,
  SiElectron,
} from "react-icons/si";

export const site = {
  name: "Jin Yu Zhang's Website",
  article: {
    path: "public/article",
  },
};

export const home = {
  summary: [
    { title: "DevOps", portion: 1.5 },
    { title: "System Design", portion: 2 },
    { title: "Leadership", portion: 1.5 },
    { title: "Front-End", portion: 4 },
    { title: "Back-End", portion: 4.5 },
  ],
  experience: [
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
      time: "Jan 2024 - Present",
    },
  ],
  skill: [
    [
      { name: "Python", icon: SiPython },
      { name: "TypeScript", icon: SiTypescript },
      { name: "JavaScript", icon: SiJavascript },
      { name: "Bash", icon: SiGnubash },
      { name: "C++", icon: SiCplusplus },
      { name: ".NET", icon: SiDotnet },
    ],
    [
      { name: "Docker", icon: SiDocker },
      { name: "AWS", icon: SiAmazon },
      { name: "GCP", icon: SiGooglecloud },
      { name: "GitHub", icon: SiGithub },
      { name: "GitLab", icon: SiGitlab },
      { name: "Linux", icon: SiLinux },
      { name: "Kubernetes", icon: SiKubernetes },
    ],
    [
      { name: "MongoDB", icon: SiMongodb },
      { name: "MySQL", icon: SiMysql },
      { name: "Redis", icon: SiRedis },
      { name: "RabbitMQ", icon: SiRabbitmq },
      { name: "Nginx", icon: SiNginx },
      { name: "Terraform", icon: SiTerraform },
    ],
    [
      { name: "Express.js", icon: SiExpress },
      { name: "Flask", icon: SiFlask },
      { name: "Django", icon: SiDjango },
    ],
    [
      { name: "React.js", icon: SiReact },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Three.js", icon: SiThreedotjs },
      { name: "Electron", icon: SiElectron },
      { name: "Redux", icon: SiRedux },
      { name: "HTML", icon: SiHtml5 },
      { name: "CSS", icon: SiCss3 },
      { name: "Webpack", icon: SiWebpack },
      { name: "Gulp", icon: SiGulp },
      { name: "Babel", icon: SiBabel },
    ],
  ],
  project: [
    {
      title: "A.I. Story Writer",
      description:
        "A web application that generates stories using OpenAI's GPT-3.5-turbo model.",
      href: "/project",
    },
    {
      title: "Dynamic Account Hub",
      description:
        "A web application that allows users to manage their accounts and settings.",
      href: "/project",
    },
    {
      title: "Cryptography CLI",
      description:
        "A command-line interface for encrypting and decrypting files using various algorithms.",
      href: "/project",
    },
  ] as { title: string; description: string; href: next.Route }[],
};
