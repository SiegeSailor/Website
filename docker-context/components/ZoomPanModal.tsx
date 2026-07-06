"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { PlusIcon, MinusIcon } from "lucide-react";

const ZOOM_MIN = 1 as const;
const ZOOM_MAX = 8 as const;
const ZOOM_STEP = 0.25 as const;

const clamp = (value: number) => Math.min(Math.max(value, ZOOM_MIN), ZOOM_MAX);

// Reusable enlarge modal with wheel/button zoom + pointer-drag pan (no external
// dependency). Shared by ModalImage and Mermaid so both behave identically.
export default function ZoomPanModal({
  isOpen,
  onClose,
  title,
  children,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}>) {
  const [zoom, setZoom] = useState<number>(ZOOM_MIN);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const reset = useCallback(() => {
    setZoom(ZOOM_MIN);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const onWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    setZoom((current) => clamp(current - Math.sign(event.deltaY) * ZOOM_STEP));
  };

  const onPointerDown = (event: React.PointerEvent) => {
    (event.currentTarget as Element).setPointerCapture?.(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!drag.current) return;
    setOffset({
      x: drag.current.ox + (event.clientX - drag.current.x),
      y: drag.current.oy + (event.clientY - drag.current.y),
    });
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" hideCloseButton>
      <ModalContent>
        {(close) => (
          <>
            {title && (
              <ModalHeader className="font-normal text-medium">{title}</ModalHeader>
            )}
            <ModalBody className="p-2">
              <div
                className="relative h-[70vh] w-full overflow-hidden rounded-md bg-default-50 touch-none select-none"
                style={{ cursor: zoom > ZOOM_MIN ? (dragging ? "grabbing" : "grab") : "default" }}
                onWheel={onWheel}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerLeave={endDrag}
                onDoubleClick={reset}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center p-6"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transition: dragging ? "none" : "transform 0.15s ease",
                  }}
                >
                  {children}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="justify-between">
              <div className="flex items-center gap-1">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setZoom((current) => clamp(current - ZOOM_STEP))}
                  aria-label="Zoom out"
                >
                  <MinusIcon size="1rem" />
                </Button>
                <button
                  type="button"
                  onClick={reset}
                  className="font-mono text-tiny text-default-500 hover:text-foreground px-2 tabular-nums"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setZoom((current) => clamp(current + ZOOM_STEP))}
                  aria-label="Zoom in"
                >
                  <PlusIcon size="1rem" />
                </Button>
              </div>
              <Button size="sm" variant="light" onPress={close}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
