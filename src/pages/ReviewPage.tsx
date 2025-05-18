
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getCampaign } from "@/services/campaignService";
import { submitReview } from "@/services/reviewService";
import { getGoogleMyBusinessLink } from "@/services/googleBusinessApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, 
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const starVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.2 }
};

const ReviewPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [gmbLink, setGmbLink] = useState<string | null>(null);
  
  // Inputs
  const [nome, setNome] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId) {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      try {
        const campaignData = await getCampaign(campaignId);
        const gmbLinkData = await getGoogleMyBusinessLink();

        if (!campaignData) {
          setIsError(true);
        } else {
          setCampaign(campaignData);
          setGmbLink(gmbLinkData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [campaignId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaignId || rating === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitReview(
        campaignId,
        rating,
        comentario,
        nome.length > 0 ? nome : undefined
      );

      if (result) {
        setShowThanks(true);
        
        // Verificar se devemos redirecionar para o Google
        if (gmbLink && rating >= (campaign?.nota_minima_redirecionamento || 4)) {
          // Atraso para mostrar primeiro a mensagem de agradecimento
          setTimeout(() => {
            window.location.href = gmbLink;
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0E927D]"></div>
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
          <p className="text-gray-700 mb-6">Não foi possível encontrar esta campanha de avaliação ou ela não está mais disponível.</p>
          <Button
            className="bg-[#0E927D] hover:bg-[#0c7f6d]"
            onClick={() => window.close()}
          >
            Fechar
          </Button>
        </div>
      </div>
    );
  }

  if (showThanks) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </motion.div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Obrigado pela sua avaliação!</h1>
          
          {gmbLink && rating >= (campaign?.nota_minima_redirecionamento || 4) ? (
            <div>
              <p className="text-gray-700 mb-4">
                Estamos te redirecionando para o Google Meu Negócio para compartilhar sua experiência...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="animate-pulse h-2 w-32 bg-[#0E927D] rounded"></div>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mb-4">
              Sua opinião é muito importante para continuarmos melhorando nossos serviços.
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Avalie sua experiência</h1>
        
        {campaign.descricao && (
          <p className="text-gray-600 mb-6 text-center">{campaign.descricao}</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome (opcional)
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full"
            />
          </motion.div>
          
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sua avaliação
            </label>
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  variants={starVariants}
                  whileHover="hover"
                  initial="idle"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="px-1 focus:outline-none"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hover || rating)
                        ? star === 1
                          ? "fill-red-400 text-red-400"
                          : star === 2
                          ? "fill-orange-400 text-orange-400"
                          : star === 3
                          ? "fill-yellow-400 text-yellow-400"
                          : star === 4
                          ? "fill-lime-400 text-lime-400"
                          : "fill-green-400 text-green-400"
                        : "text-gray-300"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            {rating > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm mt-2"
              >
                <span className={`font-medium ${
                  rating === 1 ? "text-red-500" :
                  rating === 2 ? "text-orange-500" :
                  rating === 3 ? "text-yellow-500" :
                  rating === 4 ? "text-lime-500" :
                  "text-green-500"
                }`}>
                  {rating === 1 ? "Insatisfeito" :
                   rating === 2 ? "Regular" :
                   rating === 3 ? "Bom" :
                   rating === 4 ? "Muito Bom" :
                   "Excelente"}
                </span>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              Comentário (opcional)
            </label>
            <Textarea
              id="comment"
              placeholder="Deixe um comentário sobre sua experiência..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="submit"
              className="w-full bg-[#0E927D] hover:bg-[#0c7f6d] text-white font-medium py-3 rounded-md"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ReviewPage;
