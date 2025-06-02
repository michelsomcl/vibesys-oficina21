
import { useState } from "react"
import { useReceitas } from "@/hooks/useReceitas"
import { useDespesas } from "@/hooks/useDespesas"
import { FinanceiroSummaryCards } from "@/components/financeiro/FinanceiroSummaryCards"
import { FinanceiroHeader } from "@/components/financeiro/FinanceiroHeader"
import { FinanceiroTabs } from "@/components/financeiro/FinanceiroTabs"
import { FinanceiroLoading } from "@/components/financeiro/FinanceiroLoading"
import { FinanceiroDateFilter } from "@/components/financeiro/FinanceiroDateFilter"
import { CategoriasDialog } from "@/components/financeiro/CategoriasDialog"
import { isWithinInterval, startOfDay, endOfDay } from "date-fns"

const Financeiro = () => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const { data: receitas = [], isLoading: loadingReceitas } = useReceitas()
  const { data: despesas = [], isLoading: loadingDespesas } = useDespesas()

  // Filtrar receitas e despesas por data
  const filteredReceitas = receitas.filter(receita => {
    if (!startDate && !endDate) return true
    
    const dataVencimento = new Date(receita.data_vencimento)
    
    if (startDate && endDate) {
      return isWithinInterval(dataVencimento, {
        start: startOfDay(startDate),
        end: endOfDay(endDate)
      })
    }
    
    if (startDate) {
      return dataVencimento >= startOfDay(startDate)
    }
    
    if (endDate) {
      return dataVencimento <= endOfDay(endDate)
    }
    
    return true
  })

  const filteredDespesas = despesas.filter(despesa => {
    if (!startDate && !endDate) return true
    
    const dataVencimento = new Date(despesa.data_vencimento)
    
    if (startDate && endDate) {
      return isWithinInterval(dataVencimento, {
        start: startOfDay(startDate),
        end: endOfDay(endDate)
      })
    }
    
    if (startDate) {
      return dataVencimento >= startOfDay(startDate)
    }
    
    if (endDate) {
      return dataVencimento <= endOfDay(endDate)
    }
    
    return true
  })

  const handleClearFilter = () => {
    setStartDate(null)
    setEndDate(null)
  }

  if (loadingReceitas || loadingDespesas) {
    return <FinanceiroLoading />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <FinanceiroHeader 
          title="Financeiro" 
          subtitle="Controle suas receitas e despesas" 
        />
        <CategoriasDialog />
      </div>

      <FinanceiroDateFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClearFilter={handleClearFilter}
      />

      <FinanceiroSummaryCards receitas={filteredReceitas} despesas={filteredDespesas} />

      <FinanceiroTabs receitas={filteredReceitas} despesas={filteredDespesas} />
    </div>
  )
}

export default Financeiro
