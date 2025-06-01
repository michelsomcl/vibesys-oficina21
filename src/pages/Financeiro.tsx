
import { useReceitas } from "@/hooks/useReceitas"
import { useDespesas } from "@/hooks/useDespesas"
import { FinanceiroSummaryCards } from "@/components/financeiro/FinanceiroSummaryCards"
import { FinanceiroHeader } from "@/components/financeiro/FinanceiroHeader"
import { FinanceiroTabs } from "@/components/financeiro/FinanceiroTabs"
import { FinanceiroLoading } from "@/components/financeiro/FinanceiroLoading"

const Financeiro = () => {
  const { data: receitas = [], isLoading: loadingReceitas } = useReceitas()
  const { data: despesas = [], isLoading: loadingDespesas } = useDespesas()

  if (loadingReceitas || loadingDespesas) {
    return <FinanceiroLoading />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <FinanceiroHeader 
        title="Financeiro" 
        subtitle="Controle suas receitas e despesas" 
      />

      <FinanceiroSummaryCards receitas={receitas} despesas={despesas} />

      <FinanceiroTabs receitas={receitas} despesas={despesas} />
    </div>
  )
}

export default Financeiro
