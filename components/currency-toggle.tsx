import { Button } from "./ui/button";

export function CurrencyToggle({
  currency,
  onToggle,
}: {
  currency: string;
  onToggle: (currency: string) => void;
}) {
  return (
    <div className="flex items-center space-x-2 bg-secondary rounded-full p-1">
      <Button
        variant={currency === "USD" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          currency === "USD" ? "bg-primary text-primary-foreground" : ""
        }`}
        onClick={() => onToggle("USD")}
      >
        USD
      </Button>
      <Button
        variant={currency === "INR" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          currency === "INR" ? "bg-primary text-primary-foreground" : ""
        }`}
        onClick={() => onToggle("INR")}
      >
        INR
      </Button>
    </div>
  );
}
