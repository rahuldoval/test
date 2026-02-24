"use client";

import type { scaleLinear, scaleTime } from "@visx/scale";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import type { LineConfig, Margin, TooltipData } from "./chart-context";

type ScaleTime = ReturnType<typeof scaleTime<number>>;
type ScaleLinear = ReturnType<typeof scaleLinear<number>>;

export interface ChartSelection {
  active: boolean;
  startX: number;
  endX: number;
  startIndex: number;
  endIndex: number;
}

interface UseChartInteractionProps {
  xScale: ScaleTime;
  yScale: ScaleLinear;
  data: Record<string, unknown>[];
  lines: LineConfig[];
  margin: Margin;
  xAccessor: (d: Record<string, unknown>) => Date;
  bisectDate: (data: Record<string, unknown>[], date: Date) => number;
  canInteract: boolean;
}

interface UseChartInteractionReturn {
  tooltipData: TooltipData | null;
  setTooltipData: Dispatch<SetStateAction<TooltipData | null>>;
  selection: ChartSelection | null;
  clearSelection: () => void;
  interactionHandlers: {
    onPointerMove: (e: React.PointerEvent<SVGGElement>) => void;
    onPointerLeave: () => void;
    onPointerDown: (e: React.PointerEvent<SVGGElement>) => void;
    onPointerUp: () => void;
  };
  interactionStyle: React.CSSProperties;
}

export function useChartInteraction({
  xScale,
  yScale,
  data,
  lines,
  margin,
  xAccessor,
  bisectDate,
  canInteract,
}: UseChartInteractionProps): UseChartInteractionReturn {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [selection, setSelection] = useState<ChartSelection | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);

  const findNearestPoint = useCallback(
    (pointerX: number) => {
      const x0 = xScale.invert(pointerX);
      const index = bisectDate(data, x0);
      const d0 = data[index - 1];
      const d1 = data[index];

      if (!d0 && !d1) return null;

      let nearest: Record<string, unknown>;
      let nearestIndex: number;

      if (!d0) {
        nearest = d1!;
        nearestIndex = index;
      } else if (!d1) {
        nearest = d0;
        nearestIndex = index - 1;
      } else {
        const diff0 = Math.abs(xAccessor(d0).getTime() - x0.getTime());
        const diff1 = Math.abs(xAccessor(d1).getTime() - x0.getTime());
        nearest = diff0 < diff1 ? d0 : d1;
        nearestIndex = diff0 < diff1 ? index - 1 : index;
      }

      const xPos = xScale(xAccessor(nearest)) ?? 0;
      const yPositions: Record<string, number> = {};
      for (const line of lines) {
        const val = nearest[line.dataKey];
        if (typeof val === "number") {
          yPositions[line.dataKey] = yScale(val) ?? 0;
        }
      }

      return { point: nearest, index: nearestIndex, x: xPos, yPositions };
    },
    [xScale, yScale, data, lines, xAccessor, bisectDate]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGGElement>) => {
      if (!canInteract) return;

      const svg = e.currentTarget.ownerSVGElement;
      if (!svg) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      const pointerX = svgP.x - margin.left;

      const nearest = findNearestPoint(pointerX);
      if (nearest) {
        setTooltipData(nearest);
      }

      if (isDragging.current) {
        const startX = dragStartX.current;
        const endX = pointerX;
        const endIndex = nearest?.index ?? 0;
        setSelection({
          active: true,
          startX: Math.min(startX, endX),
          endX: Math.max(startX, endX),
          startIndex: Math.min(dragStartIndex.current, endIndex),
          endIndex: Math.max(dragStartIndex.current, endIndex),
        });
      }
    },
    [canInteract, margin.left, findNearestPoint]
  );

  const onPointerLeave = useCallback(() => {
    setTooltipData(null);
    if (isDragging.current) {
      isDragging.current = false;
    }
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGGElement>) => {
      if (!canInteract) return;

      const svg = e.currentTarget.ownerSVGElement;
      if (!svg) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      const pointerX = svgP.x - margin.left;

      isDragging.current = true;
      dragStartX.current = pointerX;

      const nearest = findNearestPoint(pointerX);
      dragStartIndex.current = nearest?.index ?? 0;
    },
    [canInteract, margin.left, findNearestPoint]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  const interactionHandlers = useMemo(
    () => ({
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
    }),
    [onPointerMove, onPointerLeave, onPointerDown, onPointerUp]
  );

  const interactionStyle: React.CSSProperties = useMemo(
    () => ({
      cursor: canInteract ? "crosshair" : "default",
    }),
    [canInteract]
  );

  return {
    tooltipData,
    setTooltipData,
    selection,
    clearSelection,
    interactionHandlers,
    interactionStyle,
  };
}
