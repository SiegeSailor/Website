"use client";

import { Alert, Button } from "@heroui/react";

import { ROUTE_HOME } from "@/settings/constant";
import DivisionCenter from "@/components/DivisionCenter";
import Link from "@/components/Link";

export default function ({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <DivisionCenter>
      <Alert
        color="danger"
        classNames={{ title: "font-medium" }}
        description={error.message}
        title={`${error.name}: ${error.digest}`}
        variant="faded"
      >
        <div className="flex gap-2 mt-2">
          <Button color="danger" size="md" variant="solid" onPress={reset}>
            Retry
          </Button>
          <Link href={ROUTE_HOME} underline="none">
            <Button color="danger" size="md" variant="flat" onPress={reset}>
              {"Home"}
            </Button>
          </Link>
        </div>
      </Alert>
    </DivisionCenter>
  );
}
