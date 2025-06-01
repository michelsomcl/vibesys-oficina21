
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

interface ReceitaOSBadgeProps {
  osNumero?: string
}

export const ReceitaOSBadge = ({ osNumero }: ReceitaOSBadgeProps) => {
  if (!osNumero) return null

  return (
    <Badge variant="outline" className="text-xs">
      <FileText className="w-3 h-3 mr-1" />
      OS: {osNumero}
    </Badge>
  )
}
