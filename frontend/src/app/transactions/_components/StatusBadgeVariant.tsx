import { FiCheckCircle, FiAlertCircle, FiClock } from "react-icons/fi";

export function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "PENDING":
      return "outline";
    case "SUCCESSFUL":
      return "success";
    case "FAILED":
      return "destructive";
    default:
      return "secondary";
  }
}

export function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "PENDING":
      return <FiClock className="h-5 w-5 text-yellow-500" />;
    case "SUCCESSFUL":
      return <FiCheckCircle className="h-5 w-5 text-green-500" />;
    case "FAILED":
      return <FiAlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
