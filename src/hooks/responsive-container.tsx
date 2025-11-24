import { useEffect, useRef, useState, ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

type Props = {
  children: ReactElement; // must be a valid Recharts chart element
  height?: number;        // fixed height for the chart
  debounce?: number;      // debounce delay in ms
};

export const DebouncedResponsiveContainer = ({
  children,
  height = 250,
  debounce = 150,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height,
  });

  useEffect(() => {
    if (!ref.current) return;

    let timeout: NodeJS.Timeout;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSize({ width, height });
      }, debounce);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [debounce]);

  return (
    <div ref={ref} style={{ width: "100%", height }}>
      {size.width > 0 ? (
        <ResponsiveContainer width={size.width} height={size.height}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
};
