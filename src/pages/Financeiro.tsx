
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useReceitas } from "@/hooks/useReceitas"
import { useDespesas } from "@/hooks/useDespesas"
import { Loader2 } from "lucide-react"
import { FinanceiroSummaryCards } from "@/components/financeiro/FinanceiroSummaryCards"
import { ReceitasList } from "@/components/financeiro/ReceitasList"
import { DespesasList } from "@/components/financeiro/DespesasList"

const Financeiro = () => {
  const { data: receitas = [], isLoading: loadingReceitas } = useReceitas()
  const { data: despesas = [], isLoading: loadingDespesas } = useDespesas()

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

      <FinanceiroSummaryCards receitas={receitas} despesas={despesas} />

      <Tabs defaultValue="receitas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="receitas">
          <ReceitasList receitas={receitas} />
        </TabsContent>
        
        <TabsContent value="despesas">
          <DespesasList despesas={despesas} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Financeiro
