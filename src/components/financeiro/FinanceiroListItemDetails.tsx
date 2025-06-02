
import { format } from "date-fns"
import { Tables } from "@/integrations/supabase/types"

type Receita = Tables<"receitas">
type Despesa = Tables<"despesas">

interface FinanceiroListItemDetailsProps {
  item: Receita | Despesa
  tipo: "receita" | "despesa"
  statusReal: string
  isReceitaOS: boolean
  valorPago: number
  valorAPagar: number
}

export const FinanceiroListItemDetails = ({
  item,
  tipo,
  statusReal,
  isReceitaOS,
  valorPago,
  valorAPagar
}: FinanceiroListItemDetailsProps) => {
  return (
    <div className="space-y-1">
      <div className="font-medium">{item.descricao}</div>
      
      <div className="text-sm text-muted-foreground">
        Vencimento: {format(new Date(item.data_vencimento), "dd/MM/yyyy")}
        {statusReal !== "Pendente" && (
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

      {/* Mostrar informações de pagamento parcial para receitas de OS */}
      {isReceitaOS && valorPago > 0 && (
        <div className="text-sm space-y-1">
          <div className="text-green-600">
            Valor Recebido: R$ {valorPago.toFixed(2).replace(".", ",")}
          </div>
          {valorAPagar > 0 && (
            <div className="text-orange-600">
              Valor a Receber: R$ {valorAPagar.toFixed(2).replace(".", ",")}
            </div>
          )}
        </div>
      )}

      {item.observacoes && (
        <div className="text-sm text-muted-foreground italic">
          {item.observacoes}
        </div>
      )}
    </div>
  )
}
