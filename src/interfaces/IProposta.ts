export interface IProposta {
    user_id: string
    imovel_id: string
    proposta: Proposta
    id: string
    timestamp: number
  }
  
  export interface Proposta {
    cliente: Cliente
    financiamento: Financiamento
    imovel: Imovel
    imovelId: string
    statusProposta: string
  }
  
  export interface Cliente {
    cpf: string
    nome: string
    telefone: string
    email: string
    renda: string
  }
  
  export interface Financiamento {
    valor: number
    entrada: string
    prazo: string
  }
  
  export interface Imovel {
    cidade: string
    imovel: string
    endereco: string
    bairro: string
  }
  