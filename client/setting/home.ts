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
    title: "Game Development Intern at DY Game",
    time: "May 2014 - Aug 2014",
  },
  {
    title: "Software Engineering Intern at Servicetech International",
    time: "Jun 2016 - Jan 2017",
  },
  {
    title: "Software Engineer at Servicetech International",
    time: "Jun 2017 - Nov 2018",
  },
  {
    title: "Software Engineer at Edallianz",
    time: "Jan 2019 - Nov 2019",
  },
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

export const PUBLICATION: Readonly<
  { title: string; description: string; href: Route }[]
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
