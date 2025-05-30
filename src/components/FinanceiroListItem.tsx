
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Edit, Trash2 } from "lucide-react"
import { Tables } from "@/integrations/supabase/types"
import { useUpdateReceita, useDeleteReceita } from "@/hooks/useReceitas"
import { useUpdateDespesa, useDeleteDespesa } from "@/hooks/useDespesas"

type Receita = Tables<"receitas">
type Despesa = Tables<"despesas">

interface FinanceiroListItemProps {
  item: Receita | Despesa
  tipo: "receita" | "despesa"
}

export const FinanceiroListItem = ({ item, tipo }: FinanceiroListItemProps) => {
  const updateReceita = useUpdateReceita()
  const deleteReceita = useDeleteReceita()
  const updateDespesa = useUpdateDespesa()
  const deleteDespesa = useDeleteDespesa()

  const handleStatusToggle = async () => {
    try {
      if (tipo === "receita") {
        const receita = item as Receita
        const novoStatus = receita.status === "Pendente" ? "Recebido" : "Pendente"
        await updateReceita.mutateAsync({
          id: receita.id,
          status: novoStatus,
          data_recebimento: novoStatus === "Recebido" ? format(new Date(), "yyyy-MM-dd") : null,
        })
      } else {
        const despesa = item as Despesa
        const novoStatus = despesa.status === "Pendente" ? "Pago" : "Pendente"
        await updateDespesa.mutateAsync({
          id: despesa.id,
          status: novoStatus,
          data_pagamento: novoStatus === "Pago" ? format(new Date(), "yyyy-MM-dd") : null,
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este lançamento?")) {
      try {
        if (tipo === "receita") {
          await deleteReceita.mutateAsync(item.id)
        } else {
          await deleteDespesa.mutateAsync(item.id)
        }
      } catch (error) {
        console.error("Erro ao excluir:", error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recebido":
      case "Pago":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    return status === "Pendente" ? (
      <Clock className="w-4 h-4" />
    ) : (
      <CheckCircle className="w-4 h-4" />
    )
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-3">
          <span className="font-medium text-sm text-muted-foreground">{item.numero}</span>
          <Badge className={getStatusColor(item.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(item.status)}
              {item.status}
            </div>
          </Badge>
        </div>
        
        <div className="font-medium">{item.descricao}</div>
        
        <div className="text-sm text-muted-foreground">
          Vencimento: {format(new Date(item.data_vencimento), "dd/MM/yyyy")}
          {item.status !== "Pendente" && (
            <span className="ml-4">
              {tipo === "receita" ? "Recebido" : "Pago"} em:{" "}
              {format(
                new Date(
                  tipo === "receita" 
                    ? (item as Receita).data_recebimento! 
                    : (item as Despesa).data_pagamento!
                ), 
                "dd/MM/yyyy"
              )}
            </span>
          )}
        </div>

        {item.observacoes && (
          <div className="text-sm text-muted-foreground italic">
            {item.observacoes}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className={`text-lg font-bold ${tipo === "receita" ? "text-green-600" : "text-red-600"}`}>
          {tipo === "receita" ? "+" : "-"}R$ {item.valor.toFixed(2).replace(".", ",")}
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStatusToggle}
            className="h-8 w-8 p-0"
            disabled={updateReceita.isPending || updateDespesa.isPending}
          >
            {item.status === "Pendente" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Clock className="h-4 w-4 text-yellow-600" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            disabled={deleteReceita.isPending || deleteDespesa.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
