import { Alert, Button } from "@heroui/react";

import { TITLE_TO_ROUTE, ROUTE_TO_TITLE } from "@/settings/constant";
import DivisionCenter from "@/components/DivisionCenter";
import Link from "@/components/Link";
import TextRoute from "@/components/TextRoute";

export default function () {
  return (
    <DivisionCenter>
      <Alert
        color="warning"
        classNames={{ title: "font-medium" }}
        description={`This article couldn’t be found. Double-check the address or go back to the blog page.`}
        title={
          <>
            Not Found: <TextRoute />
          </>
        }
        variant="faded"
      >
        <div className="flex gap-2 mt-2">
          <Link href={TITLE_TO_ROUTE["Blog"]} underline="none">
            <Button color="warning" size="md" variant="solid">
              {ROUTE_TO_TITLE["/blog"]}
            </Button>
          </Link>
        </div>
      </Alert>
    </DivisionCenter>
  );
}
