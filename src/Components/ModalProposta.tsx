import { useState } from "react";
import { post } from "../Services/ApiUtils";


interface AllData {
    id: string;
    areaTotal: {
        min: number;
        max: number;
    };
    atividadeEconomica: string;
    bairro: string;
    cidade: string;
    clima: string;
    distanciaAoCentro: number;
    edificio: string;
    endereco: string;
    estrutura: {
        escolas: number;
        hospitais: number;
        shoppings: number;
        parques: number;
    };
    fuso: string;
    iptuMedia: number;
    latitude: number;
    longitude: number;
    mediaValorPorUnidade: {
        min: number;
        max: number;
    };
    populacaoCidade: number;
    rendaSalarialMedia: {
        min: number;
        max: number;
    };
    temperaturaMediana: number;
    unidadesDisponiveis: number;
    valorMedioPorMetro: number;
    valorizacaoMedia: number;

}

export default function ModalProposta({ locationData }: { locationData: any }) {
    const [showModal, setShowModal] = useState(false);
    const [alertaVisivel, setAlertaVisivel] = useState(false);
    const [mensagemAlerta, setMensagemAlerta] = useState('');
    const [enviandoFormulario, setEnviandoFormulario] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        renda: '',
        entrada: '',
        prazo: '',
    });

    const allData: AllData = locationData.allData;

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
        console.log(allData);
    };

    const mostrarAlerta = (mensagem: string) => {
        setMensagemAlerta(mensagem);
        setAlertaVisivel(true);
    };

    const fecharAlerta = () => {
        setAlertaVisivel(false);
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;


        value = value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 0) {
            value = value.replace(/^(\d{3})(\d)/g, '$1.$2');
            value = value.replace(/^(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3');
            value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3-$4');
        }

        setFormData({ ...formData, cpf: value });
    };

    // Função para formatar valores monetários
    const formatCurrency = (value: string): string => {
        let numericValue = value.replace(/\D/g, '');

        if (numericValue) {
            const valueInCents = parseInt(numericValue, 10);
            return (valueInCents / 100).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }

        return '';
    };

    // Função para lidar com campos de valor monetário
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const formattedValue = formatCurrency(value);
        setFormData({ ...formData, [id]: formattedValue });
    };

    // Função para telefone
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Remove caracteres não numéricos
        value = value.replace(/\D/g, '');

        // Aplica a máscara de telefone
        if (value.length > 0) {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        }

        setFormData({ ...formData, telefone: value });
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // Validação dos campos do formulário
        if (!formData.nome) {
            mostrarAlerta("Por favor, preencha o nome do cliente.");
            return;
        }
        
        if (!formData.cpf || formData.cpf.length < 14) {
            mostrarAlerta("Por favor, preencha o CPF corretamente.");
            return;
        }
        
        if (!formData.email || !formData.email.includes('@')) {
            mostrarAlerta("Por favor, preencha um email válido.");
            return;
        }
        
        if (!formData.telefone || formData.telefone.length < 14) {
            mostrarAlerta("Por favor, preencha o telefone corretamente.");
            return;
        }
        
        if (!formData.renda) {
            mostrarAlerta("Por favor, preencha a renda do cliente.");
            return;
        }
        
        if (!formData.entrada) {
            mostrarAlerta("Por favor, preencha o valor de entrada.");
            return;
        }
        
        if (!formData.prazo) {
            mostrarAlerta("Por favor, selecione o prazo de financiamento.");
            return;
        }

        // Ativar o estado de envio para bloquear o botão
        setEnviandoFormulario(true);

        const proposta = {
            imovelId: allData.id,
            cliente: {
                nome: formData.nome,
                cpf: formData.cpf,
                email: formData.email,
                telefone: formData.telefone,
                renda: formData.renda,
            },
            imovel: {
                endereco: allData.endereco,
                imovel: allData.edificio,
                bairro: allData.bairro,
                cidade: allData.cidade,
            },
            financiamento: {
                valor: allData.mediaValorPorUnidade.max,
                entrada: formData.entrada,
                prazo: formData.prazo,
            }
        }

        console.log("Proposta: ", proposta);

        try {
            const response = await post("createProposta", { proposta });
            console.log("Resposta: ", response);
            if (response.status === 200) {
                mostrarAlerta("Proposta enviada com sucesso! Acompanhe o status na aba de propostas.");
                setShowModal(false);
                setFormData({
                    nome: '',
                    cpf: '',
                    email: '',
                    telefone: '',
                    renda: '',
                    entrada: '',
                    prazo: '',
                });
            } else {
                mostrarAlerta("Erro ao enviar proposta. Por favor, tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao enviar proposta:", error);
            mostrarAlerta("Erro ao enviar proposta. Por favor, tente novamente.");
        } finally {
            // Desativar o estado de envio independentemente do resultado
            setEnviandoFormulario(false);
        }
    }

    return (
        <div>
            <button
                onClick={handleOpenModal}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Solicitar Financiamento
            </button>

            {
                showModal && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm" style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}>
                        <div className="bg-white p-8 rounded-lg shadow-lg min-w-[700px] max-lg:min-w-[90%]">

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Proposta de Financiamento</h2>
                                <button
                                    className="text-gray-600 hover:text-red-600 transition-colors duration-200 ease-in-out focus:outline-none"
                                    onClick={handleCloseModal}
                                    aria-label="Fechar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Seção da proposta de financiamento */}
                            <section>
                                <div className="grid grid-cols-1 gap-4">
                                    <h3 className="text-lg font-bold text-gray-800">Dados do Imóvel</h3>
                                    <div className="bg-gray-100 p-4 rounded-lg grid grid-cols-3 gap-4">
                                        <p className="text-sm text-gray-600">
                                            <strong>Endereço:</strong> {allData.endereco}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Imovel:</strong> {allData.edificio}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Bairro:</strong> {allData.bairro}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Cidade:</strong> {allData.cidade}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Valor do Imovel:</strong> R${formatCurrency((allData.mediaValorPorUnidade.max * 100).toString())}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Unidades disponíveis:</strong> {allData.unidadesDisponiveis}
                                        </p>

                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800">Dados do solicitante</h3>

                                    <form className="bg-gray-100 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                                                <input
                                                    type="text"
                                                    id="nome"
                                                    value={formData.nome}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="Digite seu nome completo"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                                                <input
                                                    type="text"
                                                    id="cpf"
                                                    value={formData.cpf}
                                                    onChange={handleCpfChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="000.000.000-00"
                                                    required
                                                    maxLength={14}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="seu@email.com"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                                <input
                                                    type="tel"
                                                    id="telefone"
                                                    value={formData.telefone}
                                                    onChange={handlePhoneChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="(00) 00000-0000"
                                                    required
                                                    maxLength={15}
                                                />
                                            </div>
                                        </div>

                                        <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2">Dados financeiros</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label htmlFor="renda" className="block text-sm font-medium text-gray-700 mb-1">Renda mensal (R$)</label>
                                                <input
                                                    type="text"
                                                    id="renda"
                                                    value={formData.renda}
                                                    onChange={handleCurrencyChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="0,00"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="entrada" className="block text-sm font-medium text-gray-700 mb-1">Valor da entrada (R$)</label>
                                                <input
                                                    type="text"
                                                    id="entrada"
                                                    value={formData.entrada}
                                                    onChange={handleCurrencyChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="0,00"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="prazo" className="block text-sm font-medium text-gray-700 mb-1">Prazo (anos)</label>
                                                <select
                                                    id="prazo"
                                                    value={formData.prazo}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    required
                                                >
                                                    <option value="">Selecione</option>
                                                    <option value="5">5</option>
                                                    <option value="10">10</option>
                                                    <option value="15">15</option>
                                                    <option value="20">20</option>
                                                    <option value="25">25</option>
                                                    <option value="30">30</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="submit"
                                                className={`px-6 py-2 rounded transition-colors ${
                                                    enviandoFormulario 
                                                    ? "bg-gray-400 cursor-not-allowed" 
                                                    : "bg-green-600 hover:bg-green-700 text-white"
                                                }`}
                                                onClick={handleSubmit}
                                                disabled={enviandoFormulario}
                                            >
                                                {enviandoFormulario ? (
                                                    <div className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Enviando...
                                                    </div>
                                                ) : "Solicitar"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        </div>


                    </div>
                )
            }

            {alertaVisivel && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={fecharAlerta}></div>
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 z-10 relative">
                        <div className="flex items-start mb-4">
                            <div className="flex-shrink-0 mr-3">
                                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900">Atenção</h3>
                                <p className="mt-2 text-sm text-gray-500">{mensagemAlerta}</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                                onClick={fecharAlerta}
                            >
                                Entendi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
