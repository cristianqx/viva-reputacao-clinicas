
import { useState } from "react";
import { Star, MessageSquare, Search, Filter, Eye } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Tipo para as avaliações
type Avaliacao = {
  id: string;
  cliente: string;
  plataforma: "google" | "doctoralia" | "facebook";
  data: string;
  nota: number;
  texto: string;
  resposta?: string;
  status: "respondida" | "pendente" | "marcada";
};

// Dados de exemplo
const avaliacoesExemplo: Avaliacao[] = [
  {
    id: "1",
    cliente: "Maria Silva",
    plataforma: "google",
    data: "2023-04-15",
    nota: 5,
    texto: "Excelente atendimento! O Dr. João foi muito atencioso e explicou todo o procedimento detalhadamente. A clínica é muito limpa e organizada.",
    status: "respondida",
    resposta: "Olá Maria, agradecemos por compartilhar sua experiência! Ficamos muito felizes em saber que você gostou do atendimento. Estamos sempre buscando oferecer o melhor para nossos pacientes. Volte sempre!"
  },
  {
    id: "2",
    cliente: "Carlos Oliveira",
    plataforma: "doctoralia",
    data: "2023-04-10",
    nota: 4,
    texto: "Bom atendimento, porém tive que esperar um pouco além do horário marcado. A Dra. Ana foi muito competente e resolveu meu problema.",
    status: "pendente"
  },
  {
    id: "3",
    cliente: "Paulo Mendes",
    plataforma: "google",
    data: "2023-04-05",
    nota: 2,
    texto: "Fiquei mais de 30 minutos esperando após o horário marcado. Apesar do bom atendimento do dentista, a recepção poderia ser mais organizada.",
    status: "pendente"
  },
  {
    id: "4",
    cliente: "Juliana Costa",
    plataforma: "facebook",
    data: "2023-04-01",
    nota: 5,
    texto: "Melhor clínica odontológica da região! Fiz um tratamento de canal e não senti absolutamente nada. Super recomendo!",
    status: "marcada"
  },
  {
    id: "5",
    cliente: "Roberto Almeida",
    plataforma: "google",
    data: "2023-03-25",
    nota: 5,
    texto: "Atendimento excepcional! Ambiente agradável e equipe muito bem preparada. Destaque para a recepcionista que foi super atenciosa.",
    status: "respondida",
    resposta: "Obrigado pelo feedback, Roberto! Sua opinião é muito importante para nós. Ficamos felizes em saber que sua experiência foi positiva. Esperamos vê-lo novamente em breve!"
  }
];

// Componente para renderizar as estrelas
const AvaliacaoEstrelas = ({ nota }: { nota: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={16} 
          className={i < nota ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
        />
      ))}
    </div>
  );
};

// Componente para o badge da plataforma
const PlataformaBadge = ({ plataforma }: { plataforma: Avaliacao["plataforma"] }) => {
  const configs = {
    google: { bg: "bg-blue-100 text-blue-800", label: "Google" },
    doctoralia: { bg: "bg-green-100 text-green-800", label: "Doctoralia" },
    facebook: { bg: "bg-indigo-100 text-indigo-800", label: "Facebook" }
  };
  
  const config = configs[plataforma];
  
  return (
    <Badge variant="outline" className={`${config.bg}`}>
      {config.label}
    </Badge>
  );
};

// Componente de card de avaliação
const AvaliacaoCard = ({ 
  avaliacao, 
  onResponder 
}: { 
  avaliacao: Avaliacao, 
  onResponder: (id: string) => void 
}) => {
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{avaliacao.cliente}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <AvaliacaoEstrelas nota={avaliacao.nota} />
              <span className="ml-2 text-sm text-gray-500">
                {formatarData(avaliacao.data)}
              </span>
            </CardDescription>
          </div>
          <PlataformaBadge plataforma={avaliacao.plataforma} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{avaliacao.texto}</p>
        
        {avaliacao.resposta && (
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <p className="text-sm font-medium text-gray-700">Sua resposta:</p>
            <p className="text-sm text-gray-600 mt-1">{avaliacao.resposta}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div>
          {avaliacao.status === "respondida" && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Respondida
            </Badge>
          )}
          {avaliacao.status === "pendente" && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Pendente
            </Badge>
          )}
          {avaliacao.status === "marcada" && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800">
              Marcada como respondida
            </Badge>
          )}
        </div>
        
        {avaliacao.status !== "respondida" && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => onResponder(avaliacao.id)}
          >
            Responder
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Componente de resposta a avaliação
const ResponderAvaliacao = ({ 
  avaliacao, 
  onSalvar, 
  onCancelar 
}: { 
  avaliacao: Avaliacao, 
  onSalvar: (id: string, resposta: string) => void, 
  onCancelar: () => void 
}) => {
  const [resposta, setResposta] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvar(avaliacao.id, resposta);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Responder avaliação de {avaliacao.cliente}</CardTitle>
        <CardDescription>
          <div className="flex items-center space-x-2">
            <AvaliacaoEstrelas nota={avaliacao.nota} />
            <PlataformaBadge plataforma={avaliacao.plataforma} />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-3 bg-gray-50 rounded-md mb-4">
          <p className="text-gray-700">{avaliacao.texto}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="resposta" className="block text-sm font-medium text-gray-700 mb-1">
                Sua resposta
              </label>
              <Textarea
                id="resposta"
                placeholder="Escreva sua resposta..."
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                rows={4}
                className="w-full"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 justify-end">
              <Button type="button" variant="outline" onClick={onCancelar}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!resposta.trim()}>
                Salvar resposta
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(avaliacoesExemplo);
  const [filtro, setFiltro] = useState<string>("todas");
  const [plataforma, setPlataforma] = useState<string>("todas");
  const [busca, setBusca] = useState<string>("");
  const [respondendoId, setRespondendoId] = useState<string | null>(null);

  // Filtrar avaliações conforme os critérios selecionados
  const avaliacoesFiltradas = avaliacoes.filter(av => {
    // Filtro de status
    if (filtro !== "todas" && av.status !== filtro) return false;
    
    // Filtro de plataforma
    if (plataforma !== "todas" && av.plataforma !== plataforma) return false;
    
    // Busca por texto ou nome do cliente
    if (busca && !av.texto.toLowerCase().includes(busca.toLowerCase()) && 
        !av.cliente.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Avaliacão sendo respondida
  const avaliacaoRespondendo = respondendoId 
    ? avaliacoes.find(av => av.id === respondendoId)
    : null;

  // Função para iniciar o processo de resposta
  const handleResponder = (id: string) => {
    setRespondendoId(id);
  };

  // Função para salvar a resposta
  const handleSalvarResposta = (id: string, resposta: string) => {
    setAvaliacoes(avaliacoes.map(av => 
      av.id === id 
        ? { ...av, resposta, status: "respondida" } 
        : av
    ));
    setRespondendoId(null);
  };

  // Função para cancelar a resposta
  const handleCancelarResposta = () => {
    setRespondendoId(null);
  };

  return (
    <>
      <PageHeader 
        title="Avaliações" 
        description="Visualize e responda às avaliações da sua clínica."
      >
        <Button className="ml-auto">
          <Eye className="mr-2 h-4 w-4" />
          Ver todas avaliações
        </Button>
      </PageHeader>
      
      <div className="p-6">
        {avaliacaoRespondendo && (
          <ResponderAvaliacao 
            avaliacao={avaliacaoRespondendo} 
            onSalvar={handleSalvarResposta} 
            onCancelar={handleCancelarResposta} 
          />
        )}
        
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar avaliações..." 
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[140px]">
                  <Select value={plataforma} onValueChange={setPlataforma}>
                    <SelectTrigger>
                      <SelectValue placeholder="Plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="doctoralia">Doctoralia</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[140px]">
                  <Select value={filtro} onValueChange={setFiltro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="respondida">Respondidas</SelectItem>
                      <SelectItem value="marcada">Marcadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="todas" className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="doctoralia">Doctoralia</TabsTrigger>
                <TabsTrigger value="facebook">Facebook</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="todas" className="p-4">
              {avaliacoesFiltradas.length > 0 ? (
                avaliacoesFiltradas.map(avaliacao => (
                  <AvaliacaoCard 
                    key={avaliacao.id} 
                    avaliacao={avaliacao} 
                    onResponder={handleResponder} 
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma avaliação encontrada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Não encontramos avaliações com os filtros selecionados.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="google" className="p-4">
              {avaliacoesFiltradas.filter(av => av.plataforma === "google").length > 0 ? (
                avaliacoesFiltradas
                  .filter(av => av.plataforma === "google")
                  .map(avaliacao => (
                    <AvaliacaoCard 
                      key={avaliacao.id} 
                      avaliacao={avaliacao} 
                      onResponder={handleResponder} 
                    />
                  ))
              ) : (
                <div className="text-center py-10">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma avaliação encontrada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Não encontramos avaliações do Google com os filtros selecionados.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="doctoralia" className="p-4">
              {avaliacoesFiltradas.filter(av => av.plataforma === "doctoralia").length > 0 ? (
                avaliacoesFiltradas
                  .filter(av => av.plataforma === "doctoralia")
                  .map(avaliacao => (
                    <AvaliacaoCard 
                      key={avaliacao.id} 
                      avaliacao={avaliacao} 
                      onResponder={handleResponder} 
                    />
                  ))
              ) : (
                <div className="text-center py-10">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma avaliação encontrada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Não encontramos avaliações da Doctoralia com os filtros selecionados.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="facebook" className="p-4">
              {avaliacoesFiltradas.filter(av => av.plataforma === "facebook").length > 0 ? (
                avaliacoesFiltradas
                  .filter(av => av.plataforma === "facebook")
                  .map(avaliacao => (
                    <AvaliacaoCard 
                      key={avaliacao.id} 
                      avaliacao={avaliacao} 
                      onResponder={handleResponder} 
                    />
                  ))
              ) : (
                <div className="text-center py-10">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma avaliação encontrada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Não encontramos avaliações do Facebook com os filtros selecionados.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
