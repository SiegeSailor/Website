"use client";

import React from "react";
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
import clsx from "clsx";
import dynamic from "next/dynamic";

import CardBlock from "@/component/CardBlock";
import SpinnerCenter from "@/component/SpinnerCenter";

const ScrollShadowChips = dynamic(
  () =>
    import("@/component/ScrollShadowChips").then((module) => module.default),
  { ssr: false, loading: () => <SpinnerCenter /> }
);

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock className={clsx(className)} href="/blog" title="My Skills">
      <div className="w-full h-full flex flex-col gap-5">
        <ScrollShadowChips
          rows={[
            [
              { name: "Python", icon: <SiPython /> },
              { name: "TypeScript", icon: <SiTypescript /> },
              { name: "JavaSCript", icon: <SiJavascript /> },
              { name: "Bash", icon: <SiGnubash /> },
              { name: "C++", icon: <SiCplusplus /> },
              { name: ".NET", icon: <SiDotnet /> },
            ],
            [
              { name: "Docker", icon: <SiDocker /> },
              { name: "AWS", icon: <SiAmazon /> },
              { name: "GCP", icon: <SiGooglecloud /> },
              { name: "GitHub", icon: <SiGithub /> },
              { name: "GitLab", icon: <SiGitlab /> },
              { name: "Linux", icon: <SiLinux /> },
              { name: "Kubernetes", icon: <SiKubernetes /> },
            ],
            [
              { name: "MongoDB", icon: <SiMongodb /> },
              { name: "MySQL", icon: <SiMysql /> },
              { name: "Redis", icon: <SiRedis /> },
              { name: "RabbitMQ", icon: <SiRabbitmq /> },
              { name: "Nginx", icon: <SiNginx /> },
              { name: "Terraform", icon: <SiTerraform /> },
            ],
            [
              { name: "Express.js", icon: <SiExpress /> },
              { name: "Flask", icon: <SiFlask /> },
              { name: "Django", icon: <SiDjango /> },
            ],
            [
              { name: "React.js", icon: <SiReact /> },
              { name: "Tailwind CSS", icon: <SiTailwindcss /> },
              { name: "Three.js", icon: <SiThreedotjs /> },
              { name: "Electron", icon: <SiElectron /> },
              { name: "Redux", icon: <SiRedux /> },
              { name: "HTML", icon: <SiHtml5 /> },
              { name: "CSS", icon: <SiCss3 /> },
              { name: "Webpack", icon: <SiWebpack /> },
              { name: "Gulp", icon: <SiGulp /> },
              { name: "Babel", icon: <SiBabel /> },
            ],
          ]}
        />
      </div>
    </CardBlock>
  );
}
