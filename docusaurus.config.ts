import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  baseUrl: "/",
  baseUrlIssueBanner: true,
  clientModules: [],
  deploymentBranch: "main",
  favicon: "images/favicon.ico",
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
  plugins: ["docusaurus-plugin-sass"],
  presets: [
    [
      "classic",
      {
        blog: {
          admonitions: undefined,
          archiveBasePath: "archive",
          authorsBasePath: "authors",
          authorsMapPath: "authors.yml",
          beforeDefaultRehypePlugins: [],
          beforeDefaultRemarkPlugins: [],
          blogArchiveComponent: undefined,
          blogAuthorsListComponent: undefined,
          blogAuthorsPostsComponent: undefined,
          blogDescription: "A DevOps Engineer",
          blogListComponent: undefined,
          blogPostComponent: "@site/source/theme/BlogPostPage",
          blogSidebarCount: "ALL",
          blogSidebarTitle: "All Blog Posts",
          blogTagsListComponent: undefined,
          blogTagsPostsComponent: undefined,
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
          id: undefined,
          include: undefined,
          onInlineAuthors: "throw",
          onInlineTags: "throw",
          onUntruncatedBlogPosts: "throw",
          pageBasePath: "page",
          path: "./blog",
          postsPerPage: "ALL",
          processBlogPosts: undefined,
          readingTime: undefined,
          recmaPlugins: [],
          rehypePlugins: [],
          remarkPlugins: [],
          routeBasePath: "/blog",
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
          showReadingTime: true,
          sortPosts: "descending",
          tags: "tags.yml",
          tagsBasePath: "tags",
          truncateMarker: undefined,
        },
        debug: undefined,
        docs: {
          admonitions: undefined,
          beforeDefaultRehypePlugins: [],
          beforeDefaultRemarkPlugins: [],
          breadcrumbs: true,
          disableVersioning: false,
          docCategoryGeneratedIndexComponent: undefined,
          docItemComponent: "@site/source/theme/DocItem",
          docRootComponent: undefined,
          docsRootComponent: undefined,
          docTagDocListComponent: undefined,
          docTagsListComponent: undefined,
          docVersionRootComponent: undefined,
          editLocalizedFiles: false,
          editUrl: undefined,
          exclude: undefined,
          id: undefined,
          include: undefined,
          includeCurrentVersion: true,
          lastVersion: undefined,
          numberPrefixParser: undefined,
          onInlineTags: "throw",
          onlyIncludeVersions: undefined,
          path: "./articles",
          recmaPlugins: [],
          rehypePlugins: [],
          remarkPlugins: [],
          routeBasePath: "/",
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
          sidebarCollapsed: true,
          sidebarCollapsible: true,
          sidebarItemsGenerator: undefined,
          sidebarPath: "./sidebars.ts",
          tags: "tags.yml",
          tagsBasePath: "tags",
          versions: undefined,
        },
        googleAnalytics: undefined,
        googleTagManager: undefined,
        gtag: undefined,
        pages: {
          admonitions: undefined,
          beforeDefaultRehypePlugins: [],
          beforeDefaultRemarkPlugins: [],
          editLocalizedFiles: false,
          editUrl: undefined,
          exclude: undefined,
          id: undefined,
          include: undefined,
          mdxPageComponent: undefined,
          path: "./source/pages",
          recmaPlugins: [],
          rehypePlugins: [],
          remarkPlugins: [],
          routeBasePath: "/",
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
        },
        sitemap: undefined,
        theme: {
          customCss: [
            "./source/style/theme.scss",
            "./source/style/doc-search.scss",
            "./source/style/overrides.scss",
          ],
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
  themes: ["@docusaurus/theme-mermaid"],
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
        groupByYear: false,
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
    footer: undefined,
    image: "images/social-card.png",
    metadata: [],
    mermaid: {
      options: {
        allFontFamily: undefined,
        architecture: undefined,
        arrowMarkerAbsolute: undefined,
        block: undefined,
        c4: undefined,
        class: undefined,
        darkMode: undefined,
        deterministicIds: undefined,
        deterministicIDSeed: undefined,
        dompurifyConfig: undefined,
        elk: {
          mergeEdges: undefined,
          nodePlacementStrategy: undefined,
          cycleBreakingStrategy: undefined,
        },
        er: undefined,
        flowchart: undefined,
        fontFamily: undefined,
        fontSize: undefined,
        forceLegacyMathML: undefined,
        gantt: undefined,
        gitGraph: undefined,
        handDrawnSeed: undefined,
        htmlLabels: undefined,
        journey: undefined,
        layout: undefined,
        legacyMathML: undefined,
        logLevel: undefined,
        look: "classic",
        markdownAutoWrap: undefined,
        maxEdges: undefined,
        maxTextSize: undefined,
        mindmap: undefined,
        packet: undefined,
        pie: undefined,
        quadrantChart: undefined,
        requirement: undefined,
        sankey: undefined,
        secure: undefined,
        securityLevel: undefined,
        sequence: undefined,
        startOnLoad: undefined,
        state: undefined,
        suppressErrorRendering: undefined,
        themeCSS: undefined,
        themeVariables: {},
        timeline: undefined,
        wrap: undefined,
        xyChart: undefined,
      },
      theme: {
        light: "default",
        dark: "default",
      },
    },
    navbar: {
      hideOnScroll: false,
      items: [
        {
          activeBasePath: undefined,
          activeBaseRegex: undefined,
          className: undefined,
          href: undefined,
          html: undefined,
          label: "Blog",
          position: "right",
          prependBaseUrlToHref: false,
          to: "/blog",
          type: undefined,
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
      ],
      logo: {
        alt: "Jin Yu, Zhang",
        src: "images/profile.jpg",
        srcDark: "images/profile.jpg",
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
