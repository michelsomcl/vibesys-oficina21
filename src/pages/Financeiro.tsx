
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  CheckCircle
} from "lucide-react"
import { useReceitas } from "@/hooks/useReceitas"
import { useDespesas } from "@/hooks/useDespesas"
import { FinanceiroCreateDialog } from "@/components/FinanceiroCreateDialog"
import { FinanceiroListItem } from "@/components/FinanceiroListItem"
import { Loader2 } from "lucide-react"

const Financeiro = () => {
  const { data: receitas = [], isLoading: loadingReceitas } = useReceitas()
  const { data: despesas = [], isLoading: loadingDespesas } = useDespesas()

  const receitasRecebidas = receitas.filter(r => r.status === "Recebido")
  const receitasPendentes = receitas.filter(r => r.status === "Pendente")
  const despesasPagas = despesas.filter(d => d.status === "Pago")
  const despesasPendentes = despesas.filter(d => d.status === "Pendente")

  const totalReceitasRecebidas = receitasRecebidas.reduce((sum, r) => sum + Number(r.valor), 0)
  const totalReceitasPendentes = receitasPendentes.reduce((sum, r) => sum + Number(r.valor), 0)
  const totalDespesasPagas = despesasPagas.reduce((sum, d) => sum + Number(d.valor), 0)
  const totalDespesasPendentes = despesasPendentes.reduce((sum, d) => sum + Number(d.valor), 0)

  if (loadingReceitas || loadingDespesas) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
        <p className="text-muted-foreground">Controle suas receitas e despesas</p>
      </div>

      {/* Cards de Resumo */}
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

      {/* Abas do Financeiro */}
      <Tabs defaultValue="receitas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="receitas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Receitas</CardTitle>
                <FinanceiroCreateDialog tipo="receita" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receitas.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma receita encontrada. Crie uma nova receita ou finalize uma ordem de serviço.
                  </div>
                ) : (
                  receitas.map((receita) => (
                    <FinanceiroListItem
                      key={receita.id}
                      item={receita}
                      tipo="receita"
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="despesas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Despesas</CardTitle>
                <FinanceiroCreateDialog tipo="despesa" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {despesas.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma despesa encontrada. Crie uma nova despesa.
                  </div>
                ) : (
                  despesas.map((despesa) => (
                    <FinanceiroListItem
                      key={despesa.id}
                      item={despesa}
                      tipo="despesa"
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Financeiro
