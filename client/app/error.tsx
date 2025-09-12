"use client";

import { Alert, Button } from "@heroui/react";

import { ROUTE_TITLE, TITLE_ROUTE } from "@/setting/site";
import DivisionCenter from "@/component/DivisionCenter";
import Link from "@/component/Link";

export default function ({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <DivisionCenter>
      <Alert
        color="danger"
        classNames={{ title: "font-medium!" }}
        description={error.message}
        title={`${error.name}: ${error.digest}`}
        variant="faded"
      >
        <div className="flex gap-2 mt-3">
          <Button color="danger" size="md" variant="solid" onPress={reset}>
            Retry
          </Button>
          <Link href={TITLE_ROUTE["Home"]} underline="none">
            <Button color="danger" size="md" variant="flat" onPress={reset}>
              {ROUTE_TITLE["/"]}
            </Button>
          </Link>
        </div>
      </Alert>
    </DivisionCenter>
  );
}
