
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useCreateReceita } from "@/hooks/useReceitas"
import { useCreateDespesa } from "@/hooks/useDespesas"

interface FinanceiroCreateDialogProps {
  tipo: "receita" | "despesa"
}

export const FinanceiroCreateDialog = ({ tipo }: FinanceiroCreateDialogProps) => {
  const [open, setOpen] = useState(false)
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [dataVencimento, setDataVencimento] = useState<Date>()
  const [observacoes, setObservacoes] = useState("")
  const [tipoDespesa, setTipoDespesa] = useState("Variável")

  const createReceita = useCreateReceita()
  const createDespesa = useCreateDespesa()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!descricao || !valor || !dataVencimento) {
      return
    }

    try {
      if (tipo === "receita") {
        await createReceita.mutateAsync({
          descricao,
          valor: parseFloat(valor),
          data_vencimento: format(dataVencimento, "yyyy-MM-dd"),
          observacoes: observacoes || null,
        })
      } else {
        await createDespesa.mutateAsync({
          descricao,
          valor: parseFloat(valor),
          data_vencimento: format(dataVencimento, "yyyy-MM-dd"),
          observacoes: observacoes || null,
          tipo: tipoDespesa as "Fixa" | "Variável",
        })
      }

      // Reset form
      setDescricao("")
      setValor("")
      setDataVencimento(undefined)
      setObservacoes("")
      setTipoDespesa("Variável")
      setOpen(false)
    } catch (error) {
      console.error("Erro ao criar lançamento:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova {tipo === "receita" ? "Receita" : "Despesa"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Nova {tipo === "receita" ? "Receita" : "Despesa"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite a descrição..."
              required
            />
          </div>

          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <Label>Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataVencimento && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataVencimento ? format(dataVencimento, "dd/MM/yyyy") : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dataVencimento}
                  onSelect={setDataVencimento}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {tipo === "despesa" && (
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={tipoDespesa} onValueChange={setTipoDespesa}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixa">Fixa</SelectItem>
                  <SelectItem value="Variável">Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações opcionais..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createReceita.isPending || createDespesa.isPending}
            >
              {createReceita.isPending || createDespesa.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
