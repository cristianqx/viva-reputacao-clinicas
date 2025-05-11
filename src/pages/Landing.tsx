
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  Star, 
  MessageSquare, 
  Users, 
  Calendar, 
  ExternalLink, 
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Check,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Landing: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Interseção Observer para animações de scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-fade-in').forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      document.querySelectorAll('.animate-fade-in').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular envio do formulário
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Recebemos seu cadastro! Em breve entraremos em contato.");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/106f36bd-c717-4c03-8db9-34aedf00bd23.png" 
              alt="Reputação Viva" 
              className="h-10"
            />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-gray-600 hover:text-primary-500 font-medium">Funcionalidades</a>
            <a href="#beneficios" className="text-gray-600 hover:text-primary-500 font-medium">Benefícios</a>
            <a href="#planos" className="text-gray-600 hover:text-primary-500 font-medium">Planos</a>
            <a href="#faq" className="text-gray-600 hover:text-primary-500 font-medium">FAQ</a>
          </div>
          <div>
            <Button 
              variant="outline" 
              className="hidden md:inline-flex mr-3 border-primary-500 text-primary-500 hover:bg-primary-50"
            >
              Login
            </Button>
            <Button 
              className="bg-primary-500 hover:bg-primary-600"
              asChild
            >
              <a href="#cadastro">Começar Grátis</a>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-[#f8f9fa] to-[#e9f5f3]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center mb-6 px-3 py-1 rounded-full bg-primary-100 text-primary-600 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-1" />
              Para clínicas e negócios locais
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-500 mb-6 leading-tight">
              Transforme pacientes satisfeitos em avaliações positivas no Google
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600">
              Automatize pedidos de avaliação para seus pacientes por WhatsApp e aumente sua reputação de forma real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-lg animate-pulse-slow"
                asChild
              >
                <a href="#cadastro">
                  Comece agora gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-lg"
              >
                Ver demonstração
              </Button>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-primary-500 mr-2" />
              <span>Teste grátis por 7 dias, sem cartão de crédito</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl animate-fade-in">
            <img 
              src="/lovable-uploads/7c012a5f-b1ed-4773-b472-7c3e9113e808.png" 
              alt="Reputação Viva Dashboard" 
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent"></div>
          </div>
        </div>
      </section>
      
      {/* Prova Social e Logos */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-8 text-gray-600 animate-fade-in">
            Clínicas que já estão construindo sua reputação com a gente
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12 animate-fade-in">
            {["Odonto Viva", "Sorriso Ideal", "Clínica Saúde Total", "Espaço Bem-Estar", "FisioVida"].map((name, index) => (
              <div key={index} className="glass-card p-4 flex items-center justify-center h-20 hover-lift">
                <p className="font-semibold text-brand-400">{name}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {[
              {
                text: "Em menos de 1 mês tive 14 novas avaliações no Google. E meus agendamentos aumentaram!",
                author: "Dra. Vanessa",
                clinic: "Odonto Viva"
              },
              {
                text: "Nunca foi tão fácil gerenciar nossa reputação online. Os pacientes adoram a experiência.",
                author: "Dr. Ricardo",
                clinic: "Clínica Bem Estar"
              },
              {
                text: "A plataforma é intuitiva e os resultados são impressionantes. Recomendo para todas as clínicas.",
                author: "Dra. Carolina",
                clinic: "Espaço Saúde"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="glass-card overflow-hidden hover-lift">
                <CardContent className="pt-6 px-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-secondary-500 fill-secondary-500" />
                    ))}
                  </div>
                  <p className="mb-6 text-gray-700 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-brand-500">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.clinic}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Como Funciona */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-brand-500 animate-fade-in">
              Como Funciona
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Um processo simples e automatizado para aumentar suas avaliações positivas no Google
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Agende a consulta",
                description: "Manualmente ou via integração com Google Agenda",
                icon: <Calendar className="h-12 w-12 text-primary-500" />
              },
              {
                title: "Enviamos mensagem automática",
                description: "Por WhatsApp, Email ou SMS após o atendimento",
                icon: <MessageSquare className="h-12 w-12 text-primary-500" />
              },
              {
                title: "O paciente avalia",
                description: "E sua clínica ganha destaque no Google",
                icon: <Star className="h-12 w-12 text-primary-500" />
              },
              {
                title: "Monitore sua reputação",
                description: "Acompanhe métricas e resultados em tempo real",
                icon: <TrendingUp className="h-12 w-12 text-primary-500" />
              }
            ].map((step, index) => (
              <div key={index} className="glass-card p-8 text-center hover-lift animate-fade-in">
                <div className="inline-flex justify-center items-center mb-4 p-3 rounded-full bg-primary-50">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-brand-500">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Funcionalidades Chave */}
      <section className="py-24 px-4" id="funcionalidades">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-brand-500 animate-fade-in">
              Funcionalidades-Chave
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tudo o que você precisa para gerenciar e melhorar sua reputação online em um único lugar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Integração com Google Meu Negócio",
                description: "Acesse e responda avaliações diretamente na plataforma",
                icon: <ExternalLink className="h-8 w-8 text-primary-500" />
              },
              {
                title: "Envio automatizado multicanal",
                description: "WhatsApp, Email e SMS para aumentar taxas de resposta",
                icon: <MessageSquare className="h-8 w-8 text-primary-500" />
              },
              {
                title: "Painel de reputação em tempo real",
                description: "Visualize métricas e acompanhe sua evolução online",
                icon: <TrendingUp className="h-8 w-8 text-primary-500" />
              },
              {
                title: "Resposta rápida a avaliações",
                description: "Responda avaliações facilmente e mantenha engajamento",
                icon: <Check className="h-8 w-8 text-primary-500" />
              },
              {
                title: "Captura de feedback interno",
                description: "Filtre experiências negativas antes do Google",
                icon: <ShieldCheck className="h-8 w-8 text-primary-500" />
              },
              {
                title: "Integrações com sistemas de gestão",
                description: "Compatível com os principais sistemas do mercado",
                icon: <Users className="h-8 w-8 text-primary-500" />
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card p-8 hover-lift animate-fade-in">
                <div className="inline-flex items-center justify-center p-3 mb-5 rounded-full bg-primary-50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-brand-500">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefícios */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#f8f9fa] to-[#e9f5f3]" id="beneficios">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-brand-500 animate-fade-in">
              Benefícios
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Veja como a Reputação Viva pode transformar seu negócio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "Mais avaliações = Mais pacientes",
                description: "Clientes confiam em negócios bem avaliados. Cada avaliação positiva aproxima você de novos clientes.",
                icon: <Users className="h-10 w-10 text-primary-500" />
              },
              {
                title: "Melhor ranking no Google",
                description: "Avaliações positivas e frequentes ajudam seu negócio a aparecer melhor nos resultados de busca.",
                icon: <TrendingUp className="h-10 w-10 text-primary-500" />
              },
              {
                title: "Economia de tempo com automação",
                description: "Pare de enviar mensagens manualmente. Automatize pedidos de avaliação e foque no atendimento.",
                icon: <Calendar className="h-10 w-10 text-primary-500" />
              },
              {
                title: "Fidelização e prova social",
                description: "Transforme clientes satisfeitos em defensores da marca e construa uma reputação sólida.",
                icon: <Star className="h-10 w-10 text-primary-500" />
              }
            ].map((benefit, index) => (
              <div key={index} className="glass-card p-8 flex gap-6 items-start hover-lift animate-fade-in">
                <div className="shrink-0 p-3 rounded-full bg-primary-50">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-brand-500">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Planos e Preços */}
      <section className="py-24 px-4" id="planos">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-brand-500 animate-fade-in">
              Planos e Preços
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Você só paga pelo que realmente funciona
            </p>
          </div>
          
          <div className="glass-card max-w-4xl mx-auto p-10 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8 justify-between items-center mb-10">
              <div>
                <div className="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-primary-100 text-primary-600 text-sm font-medium">
                  Recomendado
                </div>
                <h3 className="text-2xl font-bold text-brand-500">Plano Premium</h3>
                <p className="text-gray-500 mt-1">Acesso completo à plataforma</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-4xl font-bold text-brand-500">R$69,90<span className="text-lg text-gray-500">/mês</span></p>
                <p className="text-primary-500 font-medium">+ R$2 por avaliação publicada</p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 py-8 mb-8">
              <p className="text-lg font-medium text-gray-700 mb-6">
                Exemplo de economia:
              </p>
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium">Mensalidade base</p>
                  <p>R$69,90</p>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium">15 avaliações no mês</p>
                  <p>R$30,00</p>
                </div>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex justify-between items-center font-bold">
                  <p>Total mensal</p>
                  <p>R$99,90</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Muito mais barato que campanhas de marketing que custam R$20-50 por clique sem garantia de resultado.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Mensagens ilimitadas", 
                "Integrações com Google", 
                "Dashboard completo",
                "Envio por WhatsApp, Email e SMS",
                "Atendimento prioritário",
                "Relatórios avançados"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button 
                size="lg" 
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-lg animate-pulse-slow px-8 py-6"
                asChild
              >
                <a href="#cadastro" className="flex items-center gap-2">
                  Comece agora com 7 dias grátis
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <p className="text-sm text-gray-500 mt-3">Sem necessidade de cartão de crédito</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-brand-500 animate-fade-in">
              Perguntas Frequentes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tudo o que você precisa saber sobre a Reputação Viva
            </p>
          </div>
          
          <div className="glass-card p-8 animate-fade-in">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "Preciso ter Google Meu Negócio?",
                  answer: "Sim, é necessário ter uma conta do Google Meu Negócio verificada para aproveitar todos os recursos da plataforma. Se você ainda não tem, podemos ajudar no processo de criação e verificação."
                },
                {
                  question: "Como funciona o envio pelo WhatsApp?",
                  answer: "Utilizamos uma API oficial do WhatsApp Business para envio das mensagens, garantindo entrega e conformidade. As mensagens são personalizáveis e enviadas automaticamente após os atendimentos."
                },
                {
                  question: "Tenho controle sobre o que é enviado?",
                  answer: "Absolutamente! Você tem controle total sobre o conteúdo das mensagens, horários de envio e frequência. Oferecemos modelos prontos, mas tudo pode ser personalizado conforme sua necessidade."
                },
                {
                  question: "A plataforma tem plano gratuito?",
                  answer: "Oferecemos um período de teste gratuito de 7 dias com todas as funcionalidades. Após esse período, é necessário assinar um dos nossos planos para continuar utilizando a plataforma."
                },
                {
                  question: "Como filtrar feedback negativo?",
                  answer: "Nossa plataforma possui um sistema de pré-avaliação que coleta o feedback do cliente antes de direcioná-lo para o Google. Caso a experiência tenha sido negativa, você recebe um alerta e pode resolver a situação antes que se torne uma avaliação pública."
                },
                {
                  question: "É possível integrar com meu sistema de gestão?",
                  answer: "Sim, temos integração com os principais sistemas de gestão do mercado, como Simples Dental, Dental Office, Clinicorp e outros. Para sistemas não listados, oferecemos API para integração personalizada."
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-medium py-4 hover:no-underline hover:text-primary-500">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      
      {/* Formulário de conversão */}
      <section className="py-24 px-4 bg-brand-500 text-white" id="cadastro">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Comece agora seu teste gratuito de 7 dias
              </h2>
              <p className="mb-8 text-gray-100">
                Teste todas as funcionalidades sem compromisso e veja como é fácil melhorar sua reputação online.
              </p>
              <div className="flex items-start gap-3 mb-4">
                <div>
                  <CheckCircle className="h-6 w-6 text-secondary-500" />
                </div>
                <p>Sem necessidade de cartão de crédito</p>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <div>
                  <CheckCircle className="h-6 w-6 text-secondary-500" />
                </div>
                <p>Suporte completo durante o período de teste</p>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <CheckCircle className="h-6 w-6 text-secondary-500" />
                </div>
                <p>Cancele quando quiser, sem burocracia</p>
              </div>
            </div>
            
            <div className="glass-card p-8 animate-fade-in">
              <h3 className="text-xl font-semibold mb-6 text-brand-500">
                Preencha para começar
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da clínica
                  </label>
                  <Input 
                    id="clinicName" 
                    placeholder="Ex: Clínica Bem Estar"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do responsável
                  </label>
                  <Input 
                    id="name" 
                    placeholder="Seu nome completo"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <Input 
                    id="whatsapp" 
                    placeholder="(00) 00000-0000"
                    required
                    className="w-full"
                    type="tel"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <Input 
                    id="email" 
                    placeholder="seu@email.com"
                    required
                    className="w-full"
                    type="email"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary-500 hover:bg-primary-600 rounded-xl py-6 text-lg mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>Quero testar gratuitamente</>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Rodapé */}
      <footer className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/lovable-uploads/106f36bd-c717-4c03-8db9-34aedf00bd23.png" 
                  alt="Reputação Viva" 
                  className="h-10"
                />
              </div>
              <p className="text-gray-600 mb-6 max-w-sm">
                Plataforma de gestão de reputação online para clínicas e negócios locais que desejam melhorar sua presença digital.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-500 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-500 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-500 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-brand-500 mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#planos" className="text-gray-600 hover:text-primary-500">Planos e Preços</a></li>
                <li><a href="#faq" className="text-gray-600 hover:text-primary-500">Perguntas Frequentes</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-500">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-500">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-brand-500 mb-4">Legais</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary-500">Termos de Uso</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-500">Política de Privacidade</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-500">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Reputação Viva. Todos os direitos reservados.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <p className="text-gray-500 text-sm flex items-center">
                Feito com 
                <svg className="h-4 w-4 text-red-500 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                </svg>
                no Brasil
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
