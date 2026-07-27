import { Alert, Button } from "@heroui/react";
import type { Viewport } from "next";

import { globalViewport } from "@/settings/heads";
import { createPageTitle } from "@/helpers/utility";
import { getSite } from "@/helpers/server/content";
import { ROUTE_HOME } from "@/settings/constant";
import DivisionCenter from "@/components/DivisionCenter";
import Link from "@/components/Link";
import TextRoute from "@/components/TextRoute";

export const viewport: Viewport = globalViewport;

// TODO: Export `metadata` once https://github.com/vercel/next.js/issues/45620 is
//       resolved. It does not work here and is not inherited, so the title is
//       rendered as a `<title />` below, from content like every other route's.
export default async function () {
  const { site } = await getSite();

  return (
    <DivisionCenter>
      <title>{createPageTitle(site.title, "Not Found")}</title>

      <Alert
        color="warning"
        classNames={{ title: "font-medium" }}
        description={`This article couldn’t be found. Double-check the address or go back home.`}
        title={
          <>
            Not Found: <TextRoute />
          </>
        }
        variant="faded"
      >
        <div className="flex gap-2 mt-2">
          <Link href={ROUTE_HOME} underline="none">
            <Button color="warning" size="md" variant="solid">
              {"Home"}
            </Button>
          </Link>
        </div>
      </Alert>
    </DivisionCenter>
  );
}
