
import { useState } from "react";
import { Filter, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface FiltrosAvaliacaoProps {
  onFilterChange: (filters: any) => void;
}

export function FiltrosAvaliacao({ onFilterChange }: FiltrosAvaliacaoProps) {
  const [open, setOpen] = useState(false);
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();
  const [plataforma, setPlataforma] = useState<string>("todas");
  const [nota, setNota] = useState<string>("todas");
  const [respondida, setRespondida] = useState<string>("todas");

  const aplicarFiltros = () => {
    onFilterChange({
      dataInicio,
      dataFim,
      plataforma,
      nota: nota === "todas" ? null : parseInt(nota),
      respondida: respondida === "todas" ? null : respondida === "sim"
    });
    setOpen(false);
  };

  const limparFiltros = () => {
    setDataInicio(undefined);
    setDataFim(undefined);
    setPlataforma("todas");
    setNota("todas");
    setRespondida("todas");
    onFilterChange({});
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setOpen(true)}
        className="relative"
      >
        <Filter className="h-4 w-4" />
        {(dataInicio || plataforma !== "todas" || nota !== "todas" || respondida !== "todas") && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary"></span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Filtrar avaliações</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Período</Label>
              <div className="flex flex-wrap gap-2">
                <div className="w-full sm:w-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Data inicial"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dataInicio}
                        onSelect={setDataInicio}
                        initialFocus
                        locale={ptBR}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="w-full sm:w-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dataFim ? format(dataFim, "dd/MM/yyyy") : "Data final"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dataFim}
                        onSelect={setDataFim}
                        initialFocus
                        locale={ptBR}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Plataforma</Label>
              <Select value={plataforma} onValueChange={setPlataforma}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as plataformas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as plataformas</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="doctoralia">Doctoralia</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Nota</Label>
              <Select value={nota} onValueChange={setNota}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as notas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as notas</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5 estrelas)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ (4 estrelas)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ (3 estrelas)</SelectItem>
                  <SelectItem value="2">⭐⭐ (2 estrelas)</SelectItem>
                  <SelectItem value="1">⭐ (1 estrela)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={respondida} onValueChange={setRespondida}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as avaliações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as avaliações</SelectItem>
                  <SelectItem value="sim">Respondidas</SelectItem>
                  <SelectItem value="nao">Não respondidas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={limparFiltros} className="w-full sm:w-auto">
              <X className="h-4 w-4 mr-2" />
              Limpar filtros
            </Button>
            <Button onClick={aplicarFiltros} className="w-full sm:w-auto">Aplicar filtros</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
