
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, TrendingDown } from "lucide-react"
import { Tables } from "@/integrations/supabase/types"

type Receita = Tables<"receitas">
type Despesa = Tables<"despesas">

interface FinanceiroSummaryCardsProps {
  receitas: Receita[]
  despesas: Despesa[]
}

export const FinanceiroSummaryCards = ({ receitas, despesas }: FinanceiroSummaryCardsProps) => {
  const receitasRecebidas = receitas.filter(r => r.status === "Recebido")
  const receitasPendentes = receitas.filter(r => r.status === "Pendente")
  const despesasPagas = despesas.filter(d => d.status === "Pago")
  const despesasPendentes = despesas.filter(d => d.status === "Pendente")

  const totalReceitasRecebidas = receitasRecebidas.reduce((sum, r) => sum + Number(r.valor), 0)
  const totalReceitasPendentes = receitasPendentes.reduce((sum, r) => sum + Number(r.valor), 0)
  const totalDespesasPagas = despesasPagas.reduce((sum, d) => sum + Number(d.valor), 0)
  const totalDespesasPendentes = despesasPendentes.reduce((sum, d) => sum + Number(d.valor), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">A Receber</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            R$ {totalReceitasPendentes.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            {receitasPendentes.length} receitas pendentes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recebido</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            R$ {totalReceitasRecebidas.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            {receitasRecebidas.length} receitas recebidas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">A Pagar</CardTitle>
          <Clock className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            R$ {totalDespesasPendentes.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            {despesasPendentes.length} despesas pendentes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pago</CardTitle>
          <TrendingDown className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            R$ {totalDespesasPagas.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            {despesasPagas.length} despesas pagas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
