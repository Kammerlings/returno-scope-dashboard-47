
import { Button } from "@/components/ui/button";

interface TimeframeSelectorProps {
  selected: string;
  onSelect: (timeframe: string) => void;
  className?: string;
}

export const TimeframeSelector = ({ selected, onSelect, className }: TimeframeSelectorProps) => {
  const timeframes = [
    { label: "1M", value: "1M", tooltip: "1 Month" },
    { label: "3M", value: "3M", tooltip: "3 Months" },
    { label: "6M", value: "6M", tooltip: "6 Months" },
    { label: "1Y", value: "1Y", tooltip: "1 Year" },
    { label: "5Y", value: "5Y", tooltip: "5 Years" },
    { label: "All", value: "ALL", tooltip: "All Time" },
  ];

  return (
    <div className={`flex p-1 bg-slate-100 rounded-lg ${className || ''}`}>
      {timeframes.map((timeframe) => (
        <Button
          key={timeframe.value}
          variant={selected === timeframe.value ? "default" : "ghost"}
          size="sm"
          className={selected === timeframe.value ? "bg-white shadow-sm" : "hover:bg-slate-200"}
          onClick={() => onSelect(timeframe.value)}
          title={timeframe.tooltip}
        >
          {timeframe.label}
        </Button>
      ))}
    </div>
  );
};
