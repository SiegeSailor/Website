"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function getHash() {
  return typeof window !== "undefined" ? window.location.hash : "";
}

export function useHash() {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const handleHashChange = () => setHash(() => getHash());

    handleHashChange();

    const { pushState, replaceState } = window.history;

    window.history.pushState = function (...args) {
      pushState.apply(window.history, args);
      setTimeout(() => setHash(() => getHash()));
    };
    window.history.replaceState = function (...args) {
      replaceState.apply(window.history, args);
      setTimeout(() => setHash(() => getHash()));
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.history.pushState = pushState;
      window.history.replaceState = replaceState;
    };
  }, []);

  return hash;
}

export function useRoute() {
  const pathname = usePathname();
  const hash = useHash();

  return { route: pathname + hash, pathname, hash };
}
