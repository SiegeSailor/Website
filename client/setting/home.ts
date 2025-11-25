import { TECHNOLOGY_TO_ICON } from "@/setting/icon";
import { STAGE } from "@/setting/site";

export const SUMMARY: Readonly<{ title: string; portion: number }>[] = [
  { title: "DevOps", portion: 1.75 },
  { title: "Back-End", portion: 3.5 },
  { title: "Front-End", portion: 2.5 },
  { title: "Leadership", portion: 1.75 },
  { title: "System Design", portion: 2.25 },
] as const;

export const EXPERIENCE: Readonly<{ title: string; time: string }[]> = [
  {
    title: "Senior Software Engineer at CooperSurgical",
    time: "Jun 2025 - Present",
  },
  {
    title: "Software Engineer at CooperSurgical",
    time: "Jan 2024 - May 2025",
  },
  {
    title:
      "Certificate in Data Science and Machine Learning at Massachusetts Institute of Technology",
    time: "Aug 2023 - Nov 2023",
  },
  {
    title: "Software Engineering Intern at CooperSurgical",
    time: "May 2023 - Aug 2023",
  },
  {
    title: "Master in Computer Science at Boston University",
    time: "May 2022 - Jan 2024",
  },
  {
    title: "Software Engineer at StageSource",
    time: "Sep 2022 - Dec 2022",
  },
  {
    title: "Software Engineer at Shopee",
    time: "Jan 2022 - Feb 2022",
  },
  {
    title: "Software Engineer at Edallianz",
    time: "Jan 2019 - Nov 2019",
  },
  {
    title: "Software Engineer at Servicetech International",
    time: "Jun 2017 - Nov 2018",
  },
  {
    title: "Software Engineering Intern at Servicetech International",
    time: "Jun 2016 - Jan 2017",
  },
  {
    title: "Game Development Intern at DY Game",
    time: "May 2014 - Aug 2014",
  },
] as const;

export const SKILL: (keyof typeof TECHNOLOGY_TO_ICON)[][] = [
  ["Python", "TypeScript", "JavaScript", "Bash", "C++", ".NET"],
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

export const PUBLICATION: Readonly<
  { title: string; description: string; href: string }[]
> = [
  {
    title: "Quantitative DevSecOps Metrics for Cloud-Based Web Microservices",
    description:
      "The widespread adoption of CBWMs and DevSecOps methodologies has significantly improved modern software development, particularly regarding scalability, agility, and security. However, the true success of these implementations hinges on the ability to measure their effectiveness accurately. Metrics serve as a critical tool in this process, providing quantifiable data on service performance, security, and operational efficiency. By leveraging these metrics, organizations can better assess the efficiency of their DevSecOps practices, making them invaluable for informed decision-making, trend analysis, process management, and continuous improvement. This paper introduces 12 key quantitative metrics specifically designed to evaluate the quality of CBWMs developed through DevSecOps practices. These metrics were identified using a Multi-Vocal Literature Review methodology, sourcing information from 92 relevant studies (2018-2023) on IEEE Xplore, Springer, and Google Scholar. The selected metrics are widely applicable across CBWMs and are easy to measure with existing tools, offering a comprehensive framework for thorough assessment.",
    href: "https://ieeexplore.ieee.org/document/10735195",
  },
  {
    title:
      "A Quantitative DevSecOps Assessment Framework for Cloud-Based Web Microservices",
    description:
      "As DevSecOps practices become increasingly standardized in software development, there is a growing emphasis on consistently providing quantitative metrics for CBWMs. To achieve this, adopting an iterative workflow with a feedback loop becomes a crucial strategy for incorporating security throughout the SDLC of CBWMs. This approach effectively integrates DevSecOps principles, which are essential for the continuous provision of quantitative metrics in CBWMs. It aligns with the fundamental tenets of DevSecOps, which prioritize the direct integration of security measures into the SDLC. Consequently, the goal is to establish a continuous, metrics-driven framework that not only enhances security but also caters to the dynamic requirements of CBWMs in DevSecOps environments. Our proposed assessment flow follows the principles and concepts of DevSecOps, and it is not only a guideline for team members to follow but also a culture focusing on automating, monitoring, evaluating, and providing feedback continuously.",
    href: "https://www.proquest.com/openview/0da942d980b35cc6e5e421a32d71ba5d/1?pq-origsite=gscholar&cbl=18750&diss=y",
  },
] as const;

export const PROJECTS: Readonly<
  {
    title: string;
    description: string;
    href: string;
    stage: (typeof STAGE)[number];
  }[]
> = [
  {
    title: "Cryptography CLI",
    description:
      "Available on `brew`, a *Rust* Command-Line Interface for executing cryptographic algorithms. The CLI provides a collection of functions and simulated secured communications between two parties.",
    href: "https://github.com/SiegeSailor/OpenSource.Formulas",
    stage: "Development",
  },
  {
    title: "AI-Driven Development Tools Integration",
    description:
      "*macOS*-specific desktop integration of AI-driven development tools for automating workflows with *MCPs* and *Agents*, including onboarding environment setup, credential management, **Slack** and **GitLab** integration, image, icon, and sprite sheet generation, and **Gmail** and *Webhooks* triggers.",
    href: "https://github.com/SiegeSailor",
    stage: "Prototype",
  },
  {
    title: "Concurrency Toolkit",
    description:
      "Available on `pip`, a *Python* concurrent class wrapper for managing multiple tasks with error handling and logging. Based on `asyncio`. This is a go-to solution for simplified asynchronous programming with easy-to-use abstractions.",
    href: "https://github.com/SiegeSailor",
    stage: "Prototype",
  },
  {
    title: "Account Management CBWMs",
    description:
      "Scalable *OWASP*-Complied Cloud-Based Microservice that allows users to manage their accounts and settings. It provides an event-driven architecture comes with a eventual consistency model and various communication protocols for different use cases and CBWMs.",
    href: "https://github.com/SiegeSailor/OpenSource.AccountHub",
    stage: "Development",
  },
  {
    title: "Configurable Bucket CBWM Boilerplate",
    description:
      "A project boilerplate that provides a *RESTful* interface for *AWS S3* using *Flask*. Following the microservices principle, this project has been wrapped with *Docker*, *LocalStack*, and *Terraform* to isolate the running/deploying environments with a fully configurable layer that supports development on local laptops, testing in *GitHub Actions* CI/CD pipelines, and deployment to *AWS*.",
    href: "https://github.com/SiegeSailor/OpenSource.Bucket",
    stage: "Development",
  },
  {
    title: "Deployable UI Library Boilerplate",
    description:
      "Quick start for deploying *React* components on `npm`. A project boilerplate that provides a set of team-oriented development tools, such as *GitLab CI/CD*, *Semantic Release*, *TypeScript*, *Jest*, *ESLint*, *Stylelint*, and *Ladle*, and best practices.",
    href: "https://github.com/SiegeSailor",
    stage: "Prototype",
  },
  {
    title: "Self-Development Assistant",
    description:
      "An *iOS* application built with *Godot* that comes with often-used self-development and assistance features, such as the tomato timer, diet tracking, goals-oriented schedules, and everyday-motivating quotes, to help users build confidence and assertiveness.",
    href: "https://github.com/SiegeSailor",
    stage: "Prototype",
  },
  {
    title: "Jin Yu Zhang's Website",
    description:
      "This website. A SSR that provides *GitHub* integration, markdown file handling, and in-website search. It is built with *Next.js*, *TailwindCSS*, *HeroUI*, the *UnifiedJS* ecosystem, *Framer Motion*, *Mermaid*, *Zustand*, and *Chart.js*.",
    href: "https://github.com/SiegeSailor/Website",
    stage: "Development",
  },
] as const;
