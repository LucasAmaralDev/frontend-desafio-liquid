interface Proposta {
    cliente: {
        nome: string,
        cpf: string,
        email: string,
        telefone: string,
        renda: string,
    },
    imovel: {
        endereco: string,
        imovel: string,
        bairro: string,
        cidade: string,
    },
    financiamento: {
        valor: string,
        entrada: string,
        prazo: string,
    },
    statusProposta?: string,
}

export const PropostaItem = ({ proposta, updateProposta }: {
    proposta: any,
    updateProposta: (id: string, status: string) => void,
}) => {
    const dataProposta: Proposta = proposta.proposta;


    // Determina a cor do status
    const getStatusColor = (status: string = 'Em análise') => {
        switch (status.toLowerCase()) {
            case 'aprovado':
                return 'bg-green-100 text-green-800';
            case 'reprovado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm mb-4 bg-white hover:shadow-md transition-shadow">
            <div className="flex flex-col space-y-4">
                {/* Cabeçalho com nome do cliente e status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-900">{dataProposta.cliente.nome}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dataProposta?.statusProposta)}`}>
                        {dataProposta?.statusProposta || 'Em análise'}
                    </span>
                </div>

                {/* Informações em grid responsivo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Bloco do Imóvel */}
                    <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="font-semibold text-gray-900 mb-2 border-b pb-1">Imóvel</h4>
                        <p className="text-sm"><span className="font-bold"></span> {dataProposta.imovel.imovel}</p>
                        <p className="text-sm"><span className="font-medium">Endereço:</span> {dataProposta.imovel.endereco}</p>
                        <p className="text-sm"><span className="font-medium">Bairro:</span> {dataProposta.imovel.bairro}</p>
                        <p className="text-sm"><span className="font-medium">Cidade:</span> {dataProposta.imovel.cidade}</p>
                    </div>

                    {/* Bloco do Cliente */}
                    <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="font-semibold text-gray-900 mb-2 border-b pb-1">Cliente</h4>
                        <p className="text-sm"><span className="font-medium">CPF:</span> {dataProposta.cliente.cpf}</p>
                        <p className="text-sm"><span className="font-medium">Email:</span> {dataProposta.cliente.email}</p>
                        <p className="text-sm"><span className="font-medium">Telefone:</span> {dataProposta.cliente.telefone}</p>
                        <p className="text-sm"><span className="font-medium">Renda:</span> {dataProposta.cliente.renda}</p>
                    </div>

                    {/* Bloco do Financiamento */}
                    <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="font-semibold text-gray-900 mb-2 border-b pb-1">Financiamento</h4>
                        <p className="text-sm"><span className="font-medium">Valor:</span> {dataProposta.financiamento.valor}</p>
                        <p className="text-sm"><span className="font-medium">Entrada:</span> {dataProposta.financiamento.entrada}</p>
                        <p className="text-sm"><span className="font-medium">Prazo:</span> {dataProposta.financiamento.prazo} anos</p>
                    </div>
                </div>

                {/* Botões de ação */}
                {
                    (dataProposta.statusProposta === 'Em análise' || dataProposta.statusProposta === 'Pendente' || !dataProposta.statusProposta) && (
                        <div className="flex flex-wrap gap-2 mt-2 justify-end">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                                aria-label="Aprovar proposta"
                                onClick={() => updateProposta(proposta.id, 'Aprovado')}
                            >

                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Aprovar
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                                aria-label="Reprovar proposta"
                                onClick={() => updateProposta(proposta.id, 'Reprovado')}
                            >

                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Reprovar
                            </button>
                        </div>)}
            </div>
        </div>
    );
};