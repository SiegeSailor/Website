import { Dispatch, SetStateAction, useEffect } from "react";
import { Card, Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { getArticles } from "@/helper/server/article";
import { getEntries } from "@/helper/utility";
import { getProfile } from "@/helper/server/document";
import { NavbarMenu } from "@heroui/react";
import { ROUTE_ICON } from "@/setting/icon";
import { TITLE_ROUTE } from "@/setting/site";
import { useRoute } from "@/helper/client/history";
import Search from "@/component/Search";

export default function ({
  articles,
  profile,
  setIsOpen,
}: Readonly<{
  articles: Awaited<ReturnType<typeof getArticles>>;
  profile: Awaited<ReturnType<typeof getProfile>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}>) {
  const { route, pathname } = useRoute();

  useEffect(() => {
    setIsOpen(() => false);
  }, [route]);

  return (
    <NavbarMenu>
      <div className={clsx("max-w-compact w-full mx-auto")}>
        <div className="sm:hidden mb-4">
          <Search />
        </div>

        <div
          className={clsx(
            "gap-2 grid grid-cols-1 sm:grid-cols-12 gird-rows-1",
            "w-full"
          )}
        >
          <div className={clsx("sm:col-span-6", "flex flex-col gap-4", "p-1")}>
            <Card shadow="sm">
              <Listbox
                aria-label="Pages"
                color="default"
                className="p-4"
                disabledKeys={[pathname]}
                hideSelectedIcon
                variant="flat"
              >
                <ListboxSection title="Pages">
                  {getEntries(TITLE_ROUTE).map(([title, route]) => {
                    const Icon = ROUTE_ICON[route];

                    return (
                      <ListboxItem
                        classNames={{ title: "font-light" }}
                        endContent={<Icon size="1rem" strokeWidth="0.1rem" />}
                        href={route}
                        key={route}
                        title={title}
                      />
                    );
                  })}
                </ListboxSection>
              </Listbox>
            </Card>
            <Card shadow="sm">
              <Listbox
                aria-label="Profile"
                color="default"
                className="p-4"
                disabledKeys={[route]}
                hideSelectedIcon
                variant="flat"
              >
                <ListboxSection title="Profile">
                  {profile.metadata.anchors
                    .filter((anchor) => anchor.level === 2)
                    .map((item) => {
                      return (
                        <ListboxItem
                          classNames={{ title: "font-light truncate" }}
                          href={item.route}
                          key={item.route}
                          title={item.title}
                        />
                      );
                    })}
                </ListboxSection>
              </Listbox>
            </Card>
          </div>

          <div className={clsx("sm:col-span-6", "p-1")}>
            <Card shadow="sm">
              <Listbox
                aria-label="Blog"
                color="default"
                className="p-4"
                disabledKeys={[pathname]}
                hideSelectedIcon
                variant="flat"
              >
                <ListboxSection title="Blog">
                  {articles.map((item) => {
                    return (
                      <ListboxItem
                        classNames={{ title: "font-light truncate" }}
                        description={item.metadata.title}
                        href={item.metadata.route}
                        key={item.metadata.route}
                        title={item.metadata.date}
                      />
                    );
                  })}
                </ListboxSection>
              </Listbox>
            </Card>
          </div>
        </div>
      </div>
    </NavbarMenu>
  );
}
