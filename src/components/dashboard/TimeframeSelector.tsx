
import { Button } from "@/components/ui/button";

interface TimeframeSelectorProps {
  selected: string;
  onSelect: (timeframe: string) => void;
}

export const TimeframeSelector = ({ selected, onSelect }: TimeframeSelectorProps) => {
  const timeframes = [
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1Y" },
    { label: "5Y", value: "5Y" },
    { label: "All", value: "ALL" },
  ];

  return (
    <div className="flex p-1 bg-slate-100 rounded-lg">
      {timeframes.map((timeframe) => (
        <Button
          key={timeframe.value}
          variant={selected === timeframe.value ? "default" : "ghost"}
          size="sm"
          className={selected === timeframe.value ? "bg-white shadow-sm" : "hover:bg-slate-200"}
          onClick={() => onSelect(timeframe.value)}
        >
          {timeframe.label}
        </Button>
      ))}
    </div>
  );
};
