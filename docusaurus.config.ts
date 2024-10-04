import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  baseUrl: "/",
  baseUrlIssueBanner: true,
  clientModules: [],
  deploymentBranch: "main",
  favicon: "img/favicon.ico",
  future: undefined,
  githubHost: "jinyu-zhang.com",
  githubPort: "443",
  headTags: [],
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    localeConfigs: {
      en: {
        label: "English",
        direction: "ltr",
        htmlLang: "en-US",
        calendar: "gregory",
        path: "en",
      },
    },
  },
  markdown: {
    anchors: {
      maintainCase: false,
    },
    format: "detect",
    mdx1Compat: undefined,
    mermaid: true,
    parseFrontMatter: async (parameters) => {
      const result = await parameters.defaultParseFrontMatter(parameters);
      if (result.frontMatter.tags) {
        if (result.frontMatter.keywords)
          console.warn(
            `${result.frontMatter.keywords} will be overwritten by ${result.frontMatter.tags}.`
          );
        result.frontMatter.keywords = result.frontMatter.tags;
      }

      return result;
    },
    preprocessor: undefined,
    remarkRehypeOptions: undefined,
  },
  noIndex: false,
  onBrokenAnchors: "throw",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  onDuplicateRoutes: "throw",
  organizationName: "SiegeSailor",
  plugins: [],
  presets: [
    [
      "classic",
      {
        blog: {
          admonitions: undefined,
          archiveBasePath: "archive",
          authorsBasePath: "authors",
          authorsMapPath: "authors.yml",
          beforeDefaultRehypePlugins: undefined,
          beforeDefaultRemarkPlugins: undefined,
          blogArchiveComponent: "@theme/BlogArchivePage",
          blogAuthorsListComponent: "@theme/Blog/Pages/BlogAuthorsListPage",
          blogAuthorsPostsComponent: "@theme/Blog/Pages/BlogAuthorsPostsPage",
          blogDescription: "A DevOps Engineer",
          blogListComponent: "@theme/BlogListPage",
          blogPostComponent: "@theme/BlogPostPage",
          blogSidebarCount: "ALL",
          blogSidebarTitle: "All Blog Posts",
          blogTagsListComponent: "@theme/BlogTagsListPage",
          blogTagsPostsComponent: "@theme/BlogTagsPostsPage",
          blogTitle: "Blog",
          editLocalizedFiles: false,
          editUrl: undefined,
          exclude: undefined,
          feedOptions: {
            copyright: undefined,
            createFeedItems: undefined,
            description: undefined,
            language: undefined,
            limit: false,
            title: undefined,
            type: "all",
            xslt: undefined,
          },
          include: undefined,
          onInlineAuthors: "throw",
          onInlineTags: "throw",
          onUntruncatedBlogPosts: "throw",
          pageBasePath: "page",
          path: "./blog",
          postsPerPage: "ALL",
          readingTime: undefined,
          recmaPlugins: [],
          rehypePlugins: [],
          remarkPlugins: [],
          routeBasePath: "/",
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
          showReadingTime: true,
          sortPosts: "descending",
          tags: "tags.yml",
          tagsBasePath: "tags",
          truncateMarker: undefined,
        },
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: undefined,
        },
        pages: {},
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  projectName: "Website",
  scripts: [],
  ssrTemplate: undefined,
  staticDirectories: ["static"],
  stylesheets: [],
  tagline: "A DevOps Engineer",
  themes: [],
  themeConfig: {
    algolia: {
      appId: "to-be-filled",
      apiKey: "to-be-filled",
      indexName: "to-be-filled",
      contextualSearch: true,
      searchParameters: {},
    },
    announcementBar: {
      id: undefined,
      content:
        "This website is under construction. Please proceed to other social links.",
      backgroundColor: undefined,
      textColor: undefined,
      isCloseable: true,
    },
    blog: {
      sidebar: {
        groupByYear: true,
      },
    },
    colorMode: {
      defaultMode: "light",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    docs: {
      versionPersistence: "localStorage",
      sidebar: {
        autoCollapseCategories: true,
        hideable: true,
      },
    },
    footer: {
      style: "light",
      links: [
        {
          href: "mailto:siegesailor@gmail.com",
          html: undefined,
          label: "Gmail",
          to: undefined,
        },
        {
          href: "https://www.linkedin.com/in/jin-yu-zhang-812181155/",
          html: undefined,
          label: "LinkedIn",
          to: undefined,
        },
      ],
      logo: undefined,
      copyright: `Copyright © ${new Date().getFullYear()} Jin Yu, Zhang.`,
    },
    image: "img/social-card.png",
    metadata: [],
    navbar: {
      hideOnScroll: false,
      items: [
        {
          docId: "read-me",
          docsPluginId: "default",
          label: "Read Me",
          position: "right",
          type: "doc",
        },
        {
          docsPluginId: "default",
          label: "Notes",
          position: "right",
          sidebarId: "notes",
          type: "docSidebar",
        },
        {
          docsPluginId: "default",
          label: "Projects",
          position: "right",
          sidebarId: "projects",
          type: "docSidebar",
        },
        {
          items: [
            {
              activeBasePath: undefined,
              activeBaseRegex: undefined,
              className: undefined,
              href: "mailto:siegesailor@gmail.com",
              html: undefined,
              label: "Gmail",
              prependBaseUrlToHref: false,
              to: undefined,
              type: undefined,
            },
            {
              activeBasePath: undefined,
              activeBaseRegex: undefined,
              className: undefined,
              href: "https://www.linkedin.com/in/jin-yu-zhang-812181155/",
              html: undefined,
              label: "LinkedIn",
              prependBaseUrlToHref: false,
              to: undefined,
              type: undefined,
            },
          ],
          label: "Contact Me",
          position: "right",
          type: "dropdown",
        },
        {
          type: "html",
          position: "right",
          value: "<button>Give feedback</button>",
        },
      ],
      logo: {
        alt: "Jin Yu, Zhang",
        src: "img/profile.jpg",
        srcDark: "img/profile.jpg",
        href: undefined,
        width: 32,
        height: 32,
        target: undefined,
        className: undefined,
        style: undefined,
      },
      style: undefined,
      title: "Jin Yu, Zhang",
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      defaultLanguage: undefined,
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
      ],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 6,
    },
  } satisfies Preset.ThemeConfig,
  title: "Jin Yu, Zhang",
  titleDelimiter: undefined,
  trailingSlash: undefined,
  url: "https://www.jinyu-zhang.com/",
};

export default config;
