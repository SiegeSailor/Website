const BUILD_TARGET_CONFIG = {
  container: {
    distDir: ".next",
    images: {
      unoptimized: false,
    },
    output: "standalone",
  },
  static: {
    distDir: "export",
    images: {
      unoptimized: true,
    },
    output: "export",
  },
};

export const DEFAULT_BUILD_TARGET = "container";

export const resolveBuildTargetConfig = (
  buildTarget = process.env.NEXT_BUILD_TARGET,
) => {
  if (!buildTarget) {
    return BUILD_TARGET_CONFIG[DEFAULT_BUILD_TARGET];
  }

  const normalizedBuildTarget = buildTarget.trim().toLowerCase();

  if (!(normalizedBuildTarget in BUILD_TARGET_CONFIG)) {
    console.warn(
      `Unknown NEXT_BUILD_TARGET '${buildTarget}', using '${DEFAULT_BUILD_TARGET}'.`,
    );
    return BUILD_TARGET_CONFIG[DEFAULT_BUILD_TARGET];
  }

  return BUILD_TARGET_CONFIG[normalizedBuildTarget];
};
