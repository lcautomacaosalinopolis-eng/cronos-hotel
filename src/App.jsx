import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'


const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="menu-svg">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  reservas: (
    <svg viewBox="0 0 24 24" className="menu-svg">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  ),
  hospedes: (
    <svg viewBox="0 0 24 24" className="menu-svg">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c.8-4 3-6 5.5-6s4.7 2 5.5 6" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M14.5 19c.5-2.6 1.9-4 3.7-4 1.3 0 2.4.7 3.1 2.1" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" className="menu-svg">
      <path d="M5 12h13" />
      <path d="M14 8l4 4-4 4" />
      <path d="M19 5v14" />
    </svg>
  ),
  quartos: (
    <svg viewBox="0 0 24 24" className="menu-svg">
      <path d="M3 17V8a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v9" />
      <path d="M3 12h18v5" />
      <path d="M21 17v2M3 17v2" />
      <path d="M14 10h5a2 2 0 0 1 2 2" />
    </svg>
  ),
  servicos: (
    <svg viewBox="0 0 24 24" className="menu-svg">
      <path d="M4 11h16" />
      <path d="M6 11a6 6 0 0 1 12 0" />
      <path d="M3 16h18" />
      <path d="M7 16v2M17 16v2" />
    </svg>
  ),
  financeiro: (
    <svg viewBox="0 0 24 24" className="menu-svg">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M15 9.5c-.7-.8-1.7-1.2-3-1.2-1.6 0-2.7.7-2.7 1.8 0 3 5.4 1.4 5.4 4.2 0 1.1-1.1 1.9-2.8 1.9-1.4 0-2.5-.5-3.3-1.4" />
    </svg>
  ),
  relatorios: (
    <svg viewBox="0 0 24 24" className="menu-svg">
      <path d="M5 4h14v16H5z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  ),
  config: (
    <svg viewBox="0 0 24 24" className="menu-svg">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.1 2.1-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.7V21h-3v-.2a1.8 1.8 0 0 0-1.1-1.7 1.8 1.8 0 0 0-2 .4l-.1.1-2.1-2.1.1-.1a1.8 1.8 0 0 0 .4-2A1.8 1.8 0 0 0 5 14.4H4v-3h1a1.8 1.8 0 0 0 1.7-1.1 1.8 1.8 0 0 0-.4-2l-.1-.1 2.1-2.1.1.1a1.8 1.8 0 0 0 2 .4A1.8 1.8 0 0 0 11.4 5V4h3v1a1.8 1.8 0 0 0 1.1 1.7 1.8 1.8 0 0 0 2-.4l.1-.1 2.1 2.1-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.7 1.1h1v3h-1a1.8 1.8 0 0 0-1.5.5z" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" className="top-svg">
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 21 21" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" className="top-svg">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  ),
  hotel: (
    <svg viewBox="0 0 24 24" className="brand-svg">
      <path d="M4 21V5l8-3 8 3v16" />
      <path d="M8 21V9h8v12" />
      <path d="M9.5 6.5h.1M14.5 6.5h.1M9.5 11.5h.1M14.5 11.5h.1M9.5 15.5h.1M14.5 15.5h.1" />
    </svg>
  )
}

function avatarHospede(tipo = 'homem') {
  const valor = String(tipo || '').toLowerCase()

  if (valor.includes('menino')) return '/avatars/menino.svg'
  if (valor.includes('menina')) return '/avatars/menina.svg'
  if (valor.includes('mulher') || valor.includes('feminino') || valor.includes('female')) return '/avatars/mulher.svg'

  return '/avatars/homem.svg'
}


function App() {
  const [quartos, setQuartos] = useState([])
  const [reservas, setReservas] = useState([])
  const [consumos, setConsumos] = useState([])
  const [pagamentos, setPagamentos] = useState([])
  const [empresaConfig, setEmpresaConfig] = useState(null)
  const [empresaNome, setEmpresaNome] = useState('')
  const [empresaFantasia, setEmpresaFantasia] = useState('')
  const [empresaCnpj, setEmpresaCnpj] = useState('')
  const [empresaTelefone, setEmpresaTelefone] = useState('')
  const [empresaEmail, setEmpresaEmail] = useState('')
  const [empresaEndereco, setEmpresaEndereco] = useState('')
  const [empresaCidade, setEmpresaCidade] = useState('')
  const [empresaEstado, setEmpresaEstado] = useState('')
  const [empresaObservacao, setEmpresaObservacao] = useState('')
  const [categoriasProdutos, setCategoriasProdutos] = useState([])
  const [produtos, setProdutos] = useState([])
  const [movimentacoesEstoque, setMovimentacoesEstoque] = useState([])
  const [caixa, setCaixa] = useState([])
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [buscaGlobal, setBuscaGlobal] = useState('')
  const [mostrarResultadosBusca, setMostrarResultadosBusca] = useState(false)
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false)
  const [dataSistema, setDataSistema] = useState(new Date().toISOString().slice(0, 10))
  const [relatorioDataInicio, setRelatorioDataInicio] = useState(new Date().toISOString().slice(0, 10))
  const [relatorioDataFim, setRelatorioDataFim] = useState(new Date().toISOString().slice(0, 10))
  const [consumoReservaId, setConsumoReservaId] = useState('')
  const [consumoProdutoId, setConsumoProdutoId] = useState('')
  const [consumoQuantidade, setConsumoQuantidade] = useState('1')
  const [consumoObservacao, setConsumoObservacao] = useState('')
  const [telaAtiva, setTelaAtiva] = useState('dashboard')

  const [reservaContaId, setReservaContaId] = useState('')
  const [descricaoConsumo, setDescricaoConsumo] = useState('')
  const [valorConsumo, setValorConsumo] = useState('')
  const [valorPagamento, setValorPagamento] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro')

  const [numero, setNumero] = useState('')
  const [tipo, setTipo] = useState('')
  const [valor, setValor] = useState('')
  const [andar, setAndar] = useState('Térreo')

  const [quartoId, setQuartoId] = useState('')
  const [nomeHospede, setNomeHospede] = useState('')
  const [telefone, setTelefone] = useState('')
  const [entrada, setEntrada] = useState('')
  const [saida, setSaida] = useState('')
  const [qtdHospedes, setQtdHospedes] = useState(1)
  const [tipoHospede, setTipoHospede] = useState('homem')
  const [canalVenda, setCanalVenda] = useState('Direto')
  const [observacao, setObservacao] = useState('')
  const [observacaoCheckout, setObservacaoCheckout] = useState('')

  const [nomeCategoria, setNomeCategoria] = useState('')
  const [produtoNome, setProdutoNome] = useState('')
  const [produtoCategoriaId, setProdutoCategoriaId] = useState('')
  const [produtoTipo, setProdutoTipo] = useState('Produto')
  const [produtoValor, setProdutoValor] = useState('')
  const [produtoEstoque, setProdutoEstoque] = useState('')
  const [produtoEstoqueMinimo, setProdutoEstoqueMinimo] = useState('')
  const [produtoLocalUso, setProdutoLocalUso] = useState('Geral')
  const [produtoFrigobar, setProdutoFrigobar] = useState(false)
  const [produtoMovimentoId, setProdutoMovimentoId] = useState('')
  const [tipoMovimentoEstoque, setTipoMovimentoEstoque] = useState('entrada')
  const [quantidadeMovimento, setQuantidadeMovimento] = useState('')
  const [observacaoMovimento, setObservacaoMovimento] = useState('')
  const [caixaTipo, setCaixaTipo] = useState('entrada')
  const [caixaDescricao, setCaixaDescricao] = useState('')
  const [caixaValor, setCaixaValor] = useState('')
  const [caixaFormaPagamento, setCaixaFormaPagamento] = useState('Dinheiro')

  async function entrarSistema() {
    if (!login || !senha) {
      alert('Informe login e senha')
      return
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('login', login)
      .eq('senha', senha)
      .eq('ativo', true)
      .single()

    if (error || !data) {
      alert('Login ou senha inválidos')
      console.log(error)
      return
    }

    setUsuarioLogado(data)
    localStorage.setItem('cronos_usuario', JSON.stringify(data))

    carregarQuartos()
    carregarReservas()
    carregarConsumos()
    carregarPagamentos()
    carregarCategoriasProdutos()
    carregarProdutos()
    carregarMovimentacoesEstoque()
    carregarCaixa()
    carregarEmpresaConfig()
  }

  function sairSistema() {
    localStorage.removeItem('cronos_usuario')
    setUsuarioLogado(null)
    setLogin('')
    setSenha('')
  }


  function podeAcessarFinanceiro() {
    return (
      usuarioLogado?.perfil === 'Administrador' ||
      usuarioLogado?.perfil === 'Financeiro'
    )
  }

  function podeCadastrarQuarto() {
    return usuarioLogado?.perfil === 'Administrador'
  }

  function podeFazerReserva() {
    return (
      usuarioLogado?.perfil === 'Administrador' ||
      usuarioLogado?.perfil === 'Recepção'
    )
  }


  function podeAcessarEstoque() {
    return (
      usuarioLogado?.perfil === 'Administrador' ||
      usuarioLogado?.perfil === 'Financeiro' ||
      usuarioLogado?.perfil === 'Recepção'
    )
  }

  function podeAcessarCaixa() {
    return (
      usuarioLogado?.perfil === 'Administrador' ||
      usuarioLogado?.perfil === 'Financeiro'
    )
  }

  const [usuarios, setUsuarios] = useState([])
  const [novoNome, setNovoNome] = useState('')
  const [novoLogin, setNovoLogin] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [novoPerfil, setNovoPerfil] = useState('Recepção')
  const [novoTelefone, setNovoTelefone] = useState('')
  const [editandoUsuario, setEditandoUsuario] = useState(null)


  async function carregarUsuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome')

    if (error) {
      console.log(error)
      return
    }

    setUsuarios(data || [])
  }

  async function criarUsuario() {
    if (!novoNome || !novoLogin || !novaSenha) {
      alert('Preencha nome, login e senha')
      return
    }

    const { error } = await supabase
      .from('usuarios')
      .insert({
        nome: novoNome,
        login: novoLogin,
        senha: novaSenha,
        perfil: novoPerfil,
        telefone: novoTelefone,
        ativo: true
      })

    if (error) {
      alert('Erro ao criar usuário')
      console.log(error)
      return
    }

    setNovoNome('')
    setNovoLogin('')
    setNovaSenha('')
    setNovoPerfil('Recepção')
    setNovoTelefone('')

    carregarUsuarios()

    alert('Usuário criado com sucesso')
  }


  async function salvarEdicaoUsuario() {
    if (!editandoUsuario) return

    const { error } = await supabase
      .from('usuarios')
      .update({
        nome: editandoUsuario.nome,
        login: editandoUsuario.login,
        senha: editandoUsuario.senha,
        perfil: editandoUsuario.perfil,
        telefone: editandoUsuario.telefone
      })
      .eq('id', editandoUsuario.id)

    if (error) {
      alert('Erro ao atualizar usuário')
      console.log(error)
      return
    }

    setEditandoUsuario(null)
    carregarUsuarios()

    alert('Usuário atualizado')
  }

  async function alterarStatusUsuario(usuario) {
    const { error } = await supabase
      .from('usuarios')
      .update({
        ativo: !usuario.ativo
      })
      .eq('id', usuario.id)

    if (error) {
      alert('Erro ao alterar status')
      console.log(error)
      return
    }

    carregarUsuarios()
  }


  async function registrarAuditoria(acao, detalhes = '') {
    try {
      await supabase.from('auditoria').insert({
        usuario_id: usuarioLogado?.id || null,
        acao,
        detalhes
      })
    } catch (erro) {
      console.log('Auditoria não registrada', erro)
    }
  }


  async function carregarEmpresaConfig() {
    const { data, error } = await supabase
      .from('empresa_config')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.log(error)
      return
    }

    setEmpresaConfig(data)
    setEmpresaNome(data?.nome_empresa || '')
    setEmpresaFantasia(data?.nome_fantasia || '')
    setEmpresaCnpj(data?.cnpj || '')
    setEmpresaTelefone(data?.telefone || '')
    setEmpresaEmail(data?.email || '')
    setEmpresaEndereco(data?.endereco || '')
    setEmpresaCidade(data?.cidade || '')
    setEmpresaEstado(data?.estado || '')
    setEmpresaObservacao(data?.observacao || '')
  }

  async function salvarEmpresaConfig() {
    const dados = {
      nome_empresa: empresaNome,
      nome_fantasia: empresaFantasia,
      cnpj: empresaCnpj,
      telefone: empresaTelefone,
      email: empresaEmail,
      endereco: empresaEndereco,
      cidade: empresaCidade,
      estado: empresaEstado,
      observacao: empresaObservacao,
      atualizado_em: new Date().toISOString()
    }

    let error = null

    if (empresaConfig?.id) {
      const resposta = await supabase
        .from('empresa_config')
        .update(dados)
        .eq('id', empresaConfig.id)

      error = resposta.error
    } else {
      const resposta = await supabase
        .from('empresa_config')
        .insert(dados)

      error = resposta.error
    }

    if (error) {
      alert('Erro ao salvar dados da empresa')
      console.log(error)
      return
    }

    await registrarAuditoria('Configuração da empresa alterada', empresaNome)

    carregarEmpresaConfig()
    alert('Dados da empresa salvos com sucesso')
  }

  async function carregarCategoriasProdutos() {
    const { data, error } = await supabase
      .from('categorias_produtos')
      .select('*')
      .order('nome')

    if (error) {
      console.log(error)
      return
    }

    setCategoriasProdutos(data || [])
  }

  async function carregarProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select(`
        *,
        categorias_produtos (
          nome
        )
      `)
      .order('nome')

    if (error) {
      console.log(error)
      return
    }

    setProdutos(data || [])
  }

  async function carregarMovimentacoesEstoque() {
    const { data, error } = await supabase
      .from('movimentacoes_estoque')
      .select(`
        *,
        produtos (
          nome
        )
      `)
      .order('criado_em', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setMovimentacoesEstoque(data || [])
  }

  async function carregarCaixa() {
    const { data, error } = await supabase
      .from('caixa')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setCaixa(data || [])
  }

  async function salvarCategoriaProduto() {
    if (!nomeCategoria) {
      alert('Informe o nome da categoria')
      return
    }

    const { error } = await supabase
      .from('categorias_produtos')
      .insert({
        nome: nomeCategoria
      })

    if (error) {
      alert('Erro ao salvar categoria')
      console.log(error)
      return
    }

    await registrarAuditoria('Categoria criada', nomeCategoria)

    setNomeCategoria('')
    carregarCategoriasProdutos()
    alert('Categoria salva com sucesso')
  }

  async function salvarProduto() {
    if (!produtoNome) {
      alert('Informe o nome do produto ou serviço')
      return
    }

    const { error } = await supabase
      .from('produtos')
      .insert({
        nome: produtoNome,
        categoria_id: produtoCategoriaId || null,
        tipo: produtoTipo,
        valor_venda: Number(produtoValor || 0),
        estoque_atual: Number(produtoEstoque || 0),
        estoque_minimo: Number(produtoEstoqueMinimo || 0),
        local_uso: produtoLocalUso,
        usado_em_frigobar: produtoFrigobar,
        ativo: true
      })

    if (error) {
      alert('Erro ao salvar produto')
      console.log(error)
      return
    }

    await registrarAuditoria('Produto criado', produtoNome)

    setProdutoNome('')
    setProdutoCategoriaId('')
    setProdutoTipo('Produto')
    setProdutoValor('')
    setProdutoEstoque('')
    setProdutoEstoqueMinimo('')
    setProdutoLocalUso('Geral')
    setProdutoFrigobar(false)

    carregarProdutos()
    alert('Produto salvo com sucesso')
  }

  async function movimentarEstoque() {
    if (!produtoMovimentoId || !quantidadeMovimento) {
      alert('Selecione o produto e informe a quantidade')
      return
    }

    const produto = produtos.find((item) => item.id === produtoMovimentoId)

    if (!produto) {
      alert('Produto não encontrado')
      return
    }

    const quantidade = Number(quantidadeMovimento || 0)
    const estoqueAtual = Number(produto.estoque_atual || 0)

    const novoEstoque =
      tipoMovimentoEstoque === 'entrada'
        ? estoqueAtual + quantidade
        : estoqueAtual - quantidade

    const { error: erroMovimento } = await supabase
      .from('movimentacoes_estoque')
      .insert({
        produto_id: produtoMovimentoId,
        tipo: tipoMovimentoEstoque,
        quantidade,
        observacao: observacaoMovimento
      })

    if (erroMovimento) {
      alert('Erro ao registrar movimentação')
      console.log(erroMovimento)
      return
    }

    const { error: erroProduto } = await supabase
      .from('produtos')
      .update({
        estoque_atual: novoEstoque
      })
      .eq('id', produtoMovimentoId)

    if (erroProduto) {
      alert('Erro ao atualizar estoque')
      console.log(erroProduto)
      return
    }

    await registrarAuditoria(
      'Movimentação de estoque',
      `${tipoMovimentoEstoque} - ${produto.nome} - ${quantidade}`
    )

    setProdutoMovimentoId('')
    setTipoMovimentoEstoque('entrada')
    setQuantidadeMovimento('')
    setObservacaoMovimento('')

    carregarProdutos()
    carregarMovimentacoesEstoque()
    alert('Estoque atualizado com sucesso')
  }

  async function lancarCaixa() {
    if (!caixaDescricao || !caixaValor) {
      alert('Informe a descrição e o valor')
      return
    }

    const { error } = await supabase
      .from('caixa')
      .insert({
        tipo: caixaTipo,
        descricao: caixaDescricao,
        valor: Number(caixaValor || 0),
        forma_pagamento: caixaFormaPagamento
      })

    if (error) {
      alert('Erro ao lançar caixa')
      console.log(error)
      return
    }

    await registrarAuditoria(
      'Lançamento de caixa',
      `${caixaTipo} - ${caixaDescricao} - ${caixaValor}`
    )

    setCaixaTipo('entrada')
    setCaixaDescricao('')
    setCaixaValor('')
    setCaixaFormaPagamento('Dinheiro')

    carregarCaixa()
    alert('Lançamento registrado')
  }

  function saldoCaixa() {
    return caixa.reduce((total, item) => {
      const valor = Number(item.valor || 0)
      return item.tipo === 'entrada'
        ? total + valor
        : total - valor
    }, 0)
  }

  function totalEstoqueBaixo() {
    return produtos.filter((produto) => {
      return Number(produto.estoque_atual || 0) <= Number(produto.estoque_minimo || 0)
    }).length
  }

  async function carregarQuartos() {
    const { data, error } = await supabase
      .from('quartos')
      .select('*')
      .order('numero')

    if (error) {
      alert('Erro ao carregar quartos')
      console.log(error)
      return
    }

    setQuartos(data || [])
  }

  async function carregarReservas() {
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        quartos (
          numero,
          tipo
        )
      `)
      .order('criado_em', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setReservas(data || [])
  }

  async function carregarConsumos() {
    const { data, error } = await supabase
      .from('consumos')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setConsumos(data || [])
  }

  async function carregarPagamentos() {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .order('data_pagamento', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setPagamentos(data || [])
  }

  async function salvarQuarto() {
    if (!numero || !tipo) {
      alert('Preencha número e tipo do quarto')
      return
    }

    const { error } = await supabase.from('quartos').insert({
      numero,
      tipo,
      valor_diaria: Number(valor || 0),
      andar,
      status: 'livre'
    })

    if (error) {
      alert('Erro ao salvar quarto')
      console.log(error)
      return
    }

    setNumero('')
    setTipo('')
    setValor('')
    setAndar('Térreo')
    carregarQuartos()
  }

  async function alterarStatus(id, status) {
    const { error } = await supabase
      .from('quartos')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert('Erro ao alterar status')
      console.log(error)
      return
    }

    carregarQuartos()
  }

  function calcularDiarias() {
    if (!entrada || !saida) return 0

    const dataEntrada = new Date(entrada)
    const dataSaida = new Date(saida)
    const diferenca = dataSaida - dataEntrada
    const diarias = diferenca / (1000 * 60 * 60 * 24)

    return diarias > 0 ? diarias : 0
  }

  async function criarReserva() {
    if (!quartoId || !nomeHospede || !entrada || !saida) {
      alert('Preencha quarto, hóspede, entrada e saída')
      return
    }

    const quartoSelecionado = quartos.find((q) => q.id === quartoId)

    if (!quartoSelecionado) {
      alert('Quarto não encontrado')
      return
    }

    const diarias = calcularDiarias()

    if (diarias <= 0) {
      alert('A data de saída precisa ser maior que a data de entrada')
      return
    }

    const valorDiaria = Number(quartoSelecionado.valor_diaria || 0)
    const valorTotal = diarias * valorDiaria

    const { error } = await supabase.from('reservas').insert({
      quarto_id: quartoId,
      nome_hospede: nomeHospede,
      telefone,
      data_entrada: entrada,
      data_saida: saida,
      qtd_hospedes: Number(qtdHospedes || 1),
      tipo_hospede: tipoHospede,
      valor_diaria: valorDiaria,
      valor_total: valorTotal,
      canal_venda: canalVenda,
      observacao,
      status: 'reservada'
    })

    if (error) {
      alert('Erro ao criar reserva')
      console.log(error)
      return
    }

    await supabase
      .from('quartos')
      .update({ status: 'reservado' })
      .eq('id', quartoId)

    setQuartoId('')
    setNomeHospede('')
    setTelefone('')
    setEntrada('')
    setSaida('')
    setQtdHospedes(1)
    setTipoHospede('homem')
    setCanalVenda('Direto')
    setObservacao('')

    carregarQuartos()
    carregarReservas()
    alert('Reserva criada com sucesso')
  }

  async function fazerCheckin(reserva) {
    const { error } = await supabase
      .from('reservas')
      .update({
        checkin: true,
        status: 'em hospedagem'
      })
      .eq('id', reserva.id)

    if (error) {
      alert('Erro ao fazer check-in')
      console.log(error)
      return
    }

    await supabase
      .from('quartos')
      .update({ status: 'ocupado' })
      .eq('id', reserva.quarto_id)

    carregarQuartos()
    carregarReservas()
    alert('Check-in realizado com sucesso')
  }

  async function fazerCheckout(reserva) {
    const { error } = await supabase
      .from('reservas')
      .update({
        checkout: true,
        status: 'finalizada',
        observacao_checkout: observacaoCheckout
      })
      .eq('id', reserva.id)

    if (error) {
      alert('Erro ao fazer check-out')
      console.log(error)
      return
    }

    await supabase
      .from('quartos')
      .update({ status: 'livre' })
      .eq('id', reserva.quarto_id)

    setObservacaoCheckout('')

    carregarQuartos()
    carregarReservas()

    window.print()

    alert('Check-out realizado com sucesso')
  }

  async function lancarConsumo() {
    if (!reservaContaId || !descricaoConsumo || !valorConsumo) {
      alert('Selecione a reserva, informe a descrição e o valor do consumo')
      return
    }

    const { error } = await supabase.from('consumos').insert({
      reserva_id: reservaContaId,
      descricao: descricaoConsumo,
      valor: Number(valorConsumo || 0)
    })

    if (error) {
      alert('Erro ao lançar consumo')
      console.log(error)
      return
    }

    setDescricaoConsumo('')
    setValorConsumo('')
    carregarConsumos()
    alert('Consumo lançado com sucesso')
  }

  async function registrarPagamento() {
    if (!reservaContaId || !valorPagamento || !formaPagamento) {
      alert('Selecione a reserva, informe o valor e a forma de pagamento')
      return
    }

    const { error } = await supabase.from('pagamentos').insert({
      reserva_id: reservaContaId,
      valor: Number(valorPagamento || 0),
      forma_pagamento: formaPagamento
    })

    if (error) {
      alert('Erro ao registrar pagamento')
      console.log(error)
      return
    }

    await supabase.from('caixa').insert({
      tipo: 'entrada',
      descricao: 'Pagamento de reserva',
      valor: Number(valorPagamento || 0),
      forma_pagamento: formaPagamento,
      reserva_id: reservaContaId
    })

    await registrarAuditoria(
      'Pagamento registrado',
      `${formaPagamento} - ${valorPagamento}`
    )

    setValorPagamento('')
    setFormaPagamento('Dinheiro')
    carregarPagamentos()
    carregarCaixa()
    alert('Pagamento registrado com sucesso')
  }

  function totalConsumosReserva(reservaId) {
    return consumos
      .filter((consumo) => consumo.reserva_id === reservaId)
      .reduce((total, consumo) => total + Number(consumo.valor || 0), 0)
  }

  function totalPagamentosReserva(reservaId) {
    return pagamentos
      .filter((pagamento) => pagamento.reserva_id === reservaId)
      .reduce((total, pagamento) => total + Number(pagamento.valor || 0), 0)
  }

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }


  function totalQuartosStatus(status) {
    return quartos.filter((q) => q.status === status).length
  }

  function reservasHoje() {
    const hoje = new Date().toISOString().split('T')[0]

    return reservas.filter(
      (r) =>
        r.data_entrada === hoje ||
        r.data_saida === hoje
    ).length
  }

  function faturamentoTotal() {
    return pagamentos.reduce(
      (total, pagamento) =>
        total + Number(pagamento.valor || 0),
      0
    )
  }

  function ocupacaoPercentual() {
    if (quartos.length === 0) return 0

    const ocupados =
      totalQuartosStatus('ocupado') +
      totalQuartosStatus('reservado')

    return Math.round(
      (ocupados / quartos.length) * 100
    )
  }

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('cronos_usuario')

    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo))
      carregarQuartos()
      carregarReservas()
      carregarConsumos()
      carregarPagamentos()
      carregarCategoriasProdutos()
      carregarProdutos()
      carregarMovimentacoesEstoque()
      carregarCaixa()
      carregarEmpresaConfig()
      carregarUsuarios()
    }
  }, [])

  function corStatus(status) {
    if (status === 'livre') return '#16a34a'
    if (status === 'ocupado') return '#dc2626'
    if (status === 'reservado') return '#eab308'
    if (status === 'limpeza') return '#2563eb'
    return '#64748b'
  }

  function gerarDatasMapa() {
    const datas = []

    for (let i = 0; i < 7; i++) {
      const data = new Date()
      data.setDate(data.getDate() + i)

      datas.push(
        data.toISOString().split('T')[0]
      )
    }

    return datas
  }

  const datasMapa = gerarDatasMapa()


  if (!usuarioLogado) {
    return (
      <div className="login-page">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="login-logo-box">
              <div className="brand-building">{icons.hotel}</div>
              <div>
                <h1>CRONOS</h1>
                <p>Sistema Hotel</p>
              </div>
            </div>

            <h2>Gestão completa para hotelaria</h2>
            <p>
              Controle reservas, quartos, hóspedes, financeiro, estoque e relatórios em uma única plataforma.
            </p>

            <div className="login-benefits">
              <span>Reservas</span>
              <span>Check-in</span>
              <span>Financeiro</span>
              <span>Estoque</span>
            </div>
          </div>

          <div className="login-card">
            <div className="brand-login">
              <div>
                <h1>Entrar no sistema</h1>
                <p>Acesse sua conta para continuar</p>
              </div>
            </div>

            <label>Usuário</label>
            <input
              placeholder="Digite seu login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />

            <label>Senha</label>
            <input
              placeholder="Digite sua senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <button onClick={entrarSistema}>
              Entrar
            </button>

            <small>
              DEVELOPED BY DINHO OLIVEIRA
            </small>
          </div>
        </div>
      </div>
    )
  }

  const proximasReservas = reservas.slice(0, 5)
  const totalQuartos = quartos.length || 1
  const ocupados = totalQuartosStatus('ocupado')
  const disponiveis = totalQuartosStatus('livre')
  const percentualOcupacao = ocupacaoPercentual()

  function tituloTela() {
    if (telaAtiva === 'dashboard') return 'Dashboard'
    if (telaAtiva === 'reservas') return 'Reservas'
    if (telaAtiva === 'recepcao') return 'Check-in / Check-out'
    if (telaAtiva === 'financeiro') return 'Financeiro'
    if (telaAtiva === 'hospedes') return 'Hóspedes'
    if (telaAtiva === 'quartos') return 'Quartos'
    if (telaAtiva === 'restaurante') return 'Serviços'
    if (telaAtiva === 'estoque') return 'Estoque'
    if (telaAtiva === 'relatorios') return 'Relatórios'
    if (telaAtiva === 'usuarios') return 'Usuários'
    if (telaAtiva === 'configuracoes') return 'Configurações'
    return 'Dashboard'
  }

  function subtituloTela() {
    if (telaAtiva === 'dashboard') return 'Visão geral do hotel'
    if (telaAtiva === 'reservas') return 'Gerenciamento de reservas'
    if (telaAtiva === 'recepcao') return 'Entrada, saída e quartos'
    if (telaAtiva === 'financeiro') return 'Recebimentos e contas'
    if (telaAtiva === 'hospedes') return 'Cadastro e histórico dos hóspedes'
    if (telaAtiva === 'quartos') return 'Controle de quartos e disponibilidade'
    if (telaAtiva === 'restaurante') return 'Serviços, consumos e lançamentos'
    if (telaAtiva === 'estoque') return 'Controle de produtos e inventário'
    if (telaAtiva === 'relatorios') return 'Indicadores, relatórios e exportações'
    if (telaAtiva === 'usuarios') return 'Usuários e permissões'
    if (telaAtiva === 'configuracoes') return 'Parâmetros gerais do sistema'
    return 'Visão geral do hotel'
  }


  function dataBrasil(data) {
    if (!data) return ''

    const partes = String(data).split('-')

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`
    }

    return data
  }

  function resultadosBuscaGlobal() {
    const termo = buscaGlobal.trim().toLowerCase()

    if (!termo) return []

    const resultados = []

    ;(Array.isArray(reservas) ? reservas : []).forEach((reserva) => {
      const nome = String(reserva.nome_hospede || '').toLowerCase()
      const telefoneReserva = String(reserva.telefone || '').toLowerCase()
      const quarto = String(reserva.quartos?.numero || '').toLowerCase()

      if (
        nome.includes(termo) ||
        telefoneReserva.includes(termo) ||
        quarto.includes(termo)
      ) {
        resultados.push({
          tipo: 'Reserva',
          titulo: reserva.nome_hospede || 'Reserva',
          detalhe: `Quarto ${reserva.quartos?.numero || '-'} | ${reserva.data_entrada || '-'} até ${reserva.data_saida || '-'}`,
          tela: 'reservas'
        })
      }
    })

    ;(Array.isArray(quartos) ? quartos : []).forEach((quarto) => {
      const numero = String(quarto.numero || '').toLowerCase()
      const tipo = String(quarto.tipo || '').toLowerCase()
      const andar = String(quarto.andar || '').toLowerCase()
      const status = String(quarto.status || '').toLowerCase()

      if (
        numero.includes(termo) ||
        tipo.includes(termo) ||
        andar.includes(termo) ||
        status.includes(termo)
      ) {
        resultados.push({
          tipo: 'Quarto',
          titulo: `Quarto ${quarto.numero || '-'}`,
          detalhe: `${quarto.andar || 'Sem andar'} | ${quarto.tipo || 'A definir'} | ${quarto.status || 'livre'}`,
          tela: 'quartos'
        })
      }
    })

    ;(Array.isArray(produtos) ? produtos : []).forEach((produto) => {
      const nome = String(produto.nome || '').toLowerCase()
      const local = String(produto.local_uso || '').toLowerCase()

      if (nome.includes(termo) || local.includes(termo)) {
        resultados.push({
          tipo: 'Produto',
          titulo: produto.nome || 'Produto',
          detalhe: `${produto.local_uso || 'Geral'} | Estoque: ${produto.estoque_atual || 0}`,
          tela: 'estoque'
        })
      }
    })

    return resultados.slice(0, 8)
  }

  function notificacoesSistema() {
    const lista = []

    const quartosLimpeza = (Array.isArray(quartos) ? quartos : []).filter((quarto) => quarto.status === 'limpeza')
    const quartosOcupados = (Array.isArray(quartos) ? quartos : []).filter((quarto) => quarto.status === 'ocupado')
    const reservasDoDia = (Array.isArray(reservas) ? reservas : []).filter((reserva) => reserva.data_entrada === dataSistema)
    const estoqueBaixo = (Array.isArray(produtos) ? produtos : []).filter((produto) => {
      return Number(produto.estoque_atual || 0) <= Number(produto.estoque_minimo || 0)
    })

    if (reservasDoDia.length > 0) {
      lista.push({
        titulo: `${reservasDoDia.length} reserva${reservasDoDia.length === 1 ? '' : 's'} para hoje`,
        detalhe: 'Entradas previstas para a data selecionada.',
        tela: 'reservas'
      })
    }

    if (quartosLimpeza.length > 0) {
      lista.push({
        titulo: `${quartosLimpeza.length} quarto${quartosLimpeza.length === 1 ? '' : 's'} em limpeza`,
        detalhe: 'Acompanhe a liberação dos quartos.',
        tela: 'quartos'
      })
    }

    if (quartosOcupados.length > 0) {
      lista.push({
        titulo: `${quartosOcupados.length} quarto${quartosOcupados.length === 1 ? '' : 's'} ocupado${quartosOcupados.length === 1 ? '' : 's'}`,
        detalhe: 'Confira hóspedes e contas em aberto.',
        tela: 'checkin'
      })
    }

    if (estoqueBaixo.length > 0) {
      lista.push({
        titulo: `${estoqueBaixo.length} produto${estoqueBaixo.length === 1 ? '' : 's'} com estoque baixo`,
        detalhe: 'Reponha itens de frigobar, restaurante ou bar.',
        tela: 'estoque'
      })
    }

    if (lista.length === 0) {
      lista.push({
        titulo: 'Nenhuma pendência no momento',
        detalhe: 'Sistema sem alertas importantes.',
        tela: 'dashboard'
      })
    }

    return lista
  }

  function quantidadeNotificacoes() {
    return notificacoesSistema().filter((item) => item.titulo !== 'Nenhuma pendência no momento').length
  }


  function reservasPorPeriodo() {
    return (Array.isArray(reservas) ? reservas : []).filter((reserva) => {
      const entradaReserva = reserva.data_entrada || ''
      const saidaReserva = reserva.data_saida || ''

      return (
        (entradaReserva >= relatorioDataInicio && entradaReserva <= relatorioDataFim) ||
        (saidaReserva >= relatorioDataInicio && saidaReserva <= relatorioDataFim)
      )
    })
  }

  function pagamentosPorPeriodo() {
    return (Array.isArray(pagamentos) ? pagamentos : []).filter((pagamento) => {
      const dataPagamento = String(pagamento.criado_em || '').slice(0, 10)
      return dataPagamento >= relatorioDataInicio && dataPagamento <= relatorioDataFim
    })
  }

  function consumosPorPeriodo() {
    return (Array.isArray(consumos) ? consumos : []).filter((consumo) => {
      const dataConsumo = String(consumo.criado_em || '').slice(0, 10)
      return dataConsumo >= relatorioDataInicio && dataConsumo <= relatorioDataFim
    })
  }

  function totalReservasPeriodo() {
    return reservasPorPeriodo().reduce((total, reserva) => {
      return total + Number(reserva.valor_total || 0)
    }, 0)
  }

  function totalPagamentosPeriodo() {
    return pagamentosPorPeriodo().reduce((total, pagamento) => {
      return total + Number(pagamento.valor || 0)
    }, 0)
  }

  function totalConsumosPeriodo() {
    return consumosPorPeriodo().reduce((total, consumo) => {
      return total + Number(consumo.valor || 0)
    }, 0)
  }

  async function lancarConsumoQuarto() {
    if (!consumoReservaId || !consumoProdutoId || !consumoQuantidade) {
      alert('Selecione a reserva, o produto e informe a quantidade')
      return
    }

    const reserva = (Array.isArray(reservas) ? reservas : []).find((item) => item.id === consumoReservaId)
    const produto = (Array.isArray(produtos) ? produtos : []).find((item) => item.id === consumoProdutoId)

    if (!reserva || !produto) {
      alert('Reserva ou produto não encontrado')
      return
    }

    const quantidade = Number(consumoQuantidade || 0)
    const valorUnitario = Number(produto.valor_venda || 0)
    const valorTotal = quantidade * valorUnitario
    const estoqueAtual = Number(produto.estoque_atual || 0)
    const novoEstoque = estoqueAtual - quantidade

    if (produto.tipo === 'Produto' && novoEstoque < 0) {
      const confirma = confirm('O estoque deste produto ficará negativo. Deseja continuar?')
      if (!confirma) return
    }

    const { error: erroConsumo } = await supabase
      .from('consumos')
      .insert({
        reserva_id: consumoReservaId,
        descricao: `${produto.nome} x${quantidade}${consumoObservacao ? ' - ' + consumoObservacao : ''}`,
        valor: valorTotal
      })

    if (erroConsumo) {
      alert('Erro ao lançar consumo')
      console.log(erroConsumo)
      return
    }

    if (produto.tipo === 'Produto') {
      const { error: erroProduto } = await supabase
        .from('produtos')
        .update({
          estoque_atual: novoEstoque
        })
        .eq('id', consumoProdutoId)

      if (erroProduto) {
        alert('Consumo lançado, mas houve erro ao baixar estoque')
        console.log(erroProduto)
      }

      await supabase
        .from('movimentacoes_estoque')
        .insert({
          produto_id: consumoProdutoId,
          tipo: 'saida',
          quantidade,
          observacao: `Consumo lançado no quarto ${reserva.quartos?.numero || '-'}`
        })
    }

    await registrarAuditoria(
      'Consumo lançado no quarto',
      `${produto.nome} x${quantidade} - Reserva ${reserva.nome_hospede || ''}`
    )

    setConsumoReservaId('')
    setConsumoProdutoId('')
    setConsumoQuantidade('1')
    setConsumoObservacao('')

    carregarConsumos()
    carregarProdutos()
    carregarMovimentacoesEstoque()

    alert('Consumo lançado na conta do quarto com sucesso')
  }

  function menuClasse(tela) {
    return `menu-link ${telaAtiva === tela ? 'active' : ''}`
  }

  function renderizarQuartosPorAndar(andar) {
    const quartosDoAndar = quartos.filter((quarto) => quarto.andar === andar)

    return (
      <div className="andar-bloco" key={andar}>
        <div className="andar-cabecalho">
          <h2>{andar}</h2>

          <span>
            {quartosDoAndar.length} quarto{quartosDoAndar.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="quartos-grid">
          {quartosDoAndar.map((quarto) => (
            <div
              key={quarto.id}
              className={`quarto-card ${quarto.status}`}
            >
              <div>
                <h3>Quarto {quarto.numero}</h3>
                <p>{quarto.tipo}</p>
                <small>{formatarMoeda(quarto.valor_diaria)}</small>
              </div>

              <span className={`status-quarto ${quarto.status}`}>
                {quarto.status}
              </span>

              <div className="button-row">
                <button onClick={() => alterarStatus(quarto.id, 'livre')}>Livre</button>
                <button onClick={() => alterarStatus(quarto.id, 'ocupado')}>Ocupado</button>
                <button onClick={() => alterarStatus(quarto.id, 'reservado')}>Reservado</button>
                <button onClick={() => alterarStatus(quarto.id, 'limpeza')}>Limpeza</button>
              </div>
            </div>
          ))}

          {quartosDoAndar.length === 0 && (
            <p className="sem-quartos">
              Nenhum quarto cadastrado neste andar.
            </p>
          )}
        </div>
      </div>
    )
  }


  return (
    <div className="hotel-layout">
      <aside className="hotel-sidebar">
        <div className="hotel-brand">
          <div className="hotel-logo-icon">{icons.hotel}</div>
          <div>
            <h1>{empresaConfig?.nome_fantasia || 'CRONOS'}</h1>
            <p>{empresaConfig?.nome_empresa || 'Sistema Hotel'}</p>
          </div>
        </div>

        <nav className="hotel-menu">
          <button className={menuClasse('dashboard')} onClick={() => setTelaAtiva('dashboard')}>
            <span className="menu-icon">{icons.dashboard}</span> Dashboard
          </button>

          <button className={menuClasse('reservas')} onClick={() => setTelaAtiva('reservas')}>
            <span className="menu-icon">{icons.reservas}</span> Reservas
          </button>

          <button className={menuClasse('hospedes')} onClick={() => setTelaAtiva('hospedes')}>
            <span className="menu-icon">{icons.hospedes}</span> Hóspedes
          </button>

          <button className={menuClasse('recepcao')} onClick={() => setTelaAtiva('recepcao')}>
            <span className="menu-icon">{icons.check}</span> Check-in / Check-out
          </button>

          <button className={menuClasse('quartos')} onClick={() => setTelaAtiva('quartos')}>
            <span className="menu-icon">{icons.quartos}</span> Quartos
          </button>

          <button className={menuClasse('restaurante')} onClick={() => setTelaAtiva('restaurante')}>
            <span className="menu-icon">{icons.servicos}</span> Serviços
          </button>

          <button className={menuClasse('financeiro')} onClick={() => setTelaAtiva('financeiro')}>
            <span className="menu-icon">{icons.financeiro}</span> Financeiro
          </button>

          <button className={menuClasse('relatorios')} onClick={() => setTelaAtiva('relatorios')}>
            <span className="menu-icon">{icons.relatorios}</span> Relatórios
          </button>

          <button className={menuClasse('configuracoes')} onClick={() => setTelaAtiva('configuracoes')}>
            <span className="menu-icon">{icons.config}</span> Configurações
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {usuarioLogado.nome?.slice(0, 1)}
          </div>

          <div>
            <strong>{usuarioLogado.nome}</strong>
            <small>{usuarioLogado.perfil}</small>
          </div>
        </div>

        <button className="logout-button" onClick={sairSistema}>
          ↪ Sair
        </button>
      </aside>

      <main className="hotel-main">
        <header className="hotel-topbar">
          <div className="topbar-title">
            <button className="hamburger">☰</button>

            <div>
              <h2>{tituloTela()}</h2>
              <p>{subtituloTela()}</p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-search-wrap">
              <div className="search-field">
                <input
                  placeholder="Buscar hóspede, quarto ou produto..."
                  value={buscaGlobal}
                  onChange={(e) => {
                    setBuscaGlobal(e.target.value)
                    setMostrarResultadosBusca(true)
                    setMostrarNotificacoes(false)
                  }}
                  onFocus={() => {
                    setMostrarResultadosBusca(true)
                    setMostrarNotificacoes(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && resultadosBuscaGlobal()[0]) {
                      setTelaAtiva(resultadosBuscaGlobal()[0].tela)
                      setMostrarResultadosBusca(false)
                    }
                  }}
                />

                <button
                  type="button"
                  className="search-action"
                  onClick={() => {
                    setMostrarResultadosBusca(!mostrarResultadosBusca)
                    setMostrarNotificacoes(false)
                  }}
                >
                  {icons.search}
                </button>
              </div>

              {mostrarResultadosBusca && buscaGlobal.trim() && (
                <div className="topbar-dropdown search-results-box">
                  {resultadosBuscaGlobal().length === 0 && (
                    <div className="dropdown-empty">
                      Nenhum resultado encontrado
                    </div>
                  )}

                  {resultadosBuscaGlobal().map((resultado, index) => (
                    <button
                      key={`${resultado.tipo}-${index}`}
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setTelaAtiva(resultado.tela)
                        setMostrarResultadosBusca(false)
                      }}
                    >
                      <strong>{resultado.tipo}: {resultado.titulo}</strong>
                      <span>{resultado.detalhe}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="notification-wrap">
              <button
                type="button"
                className="bell-button"
                onClick={() => {
                  setMostrarNotificacoes(!mostrarNotificacoes)
                  setMostrarResultadosBusca(false)
                }}
              >
                {icons.bell}
                <small>{quantidadeNotificacoes()}</small>
              </button>

              {mostrarNotificacoes && (
                <div className="topbar-dropdown notifications-box">
                  <h4>Notificações</h4>

                  {notificacoesSistema().map((notificacao, index) => (
                    <button
                      key={`${notificacao.titulo}-${index}`}
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setTelaAtiva(notificacao.tela)
                        setMostrarNotificacoes(false)
                      }}
                    >
                      <strong>{notificacao.titulo}</strong>
                      <span>{notificacao.detalhe}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <label className="date-picker date-picker-functional">
              <input
                type="date"
                value={dataSistema}
                onChange={(e) => {
                  setDataSistema(e.target.value)
                  setMostrarResultadosBusca(false)
                  setMostrarNotificacoes(false)
                }}
              />
              <span>{dataBrasil(dataSistema)}</span>
            </label>
          </div>
        </header>

        {telaAtiva === 'dashboard' && (
          <>
            <section className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">▤</div>
                <div className="stat-info">
                  <span>Quartos ocupados</span>
                  <strong>{ocupados}</strong>
                  <small>de {totalQuartos} quartos</small>
                  <div className="progress">
                    <div style={{ width: `${percentualOcupacao}%` }} />
                  </div>
                </div>
              </div>

              <div className="stat-card green">
                <div className="stat-icon">♙</div>
                <div className="stat-info">
                  <span>Hóspedes</span>
                  <strong>
                    {reservas.reduce((total, reserva) => total + Number(reserva.qtd_hospedes || 0), 0)}
                  </strong>
                  <small>hóspedes no total</small>
                  <div className="progress">
                    <div style={{ width: '48%' }} />
                  </div>
                </div>
              </div>

              <div className="stat-card orange">
                <div className="stat-icon">▣</div>
                <div className="stat-info">
                  <span>Check-ins hoje</span>
                  <strong>{reservasHoje()}</strong>
                  <small>reservas</small>
                  <div className="progress">
                    <div style={{ width: '45%' }} />
                  </div>
                </div>
              </div>

              <div className="stat-card purple">
                <div className="stat-icon">▢</div>
                <div className="stat-info">
                  <span>Check-outs hoje</span>
                  <strong>
                    {reservas.filter((reserva) => reserva.checkout).length}
                  </strong>
                  <small>reservas</small>
                  <div className="progress">
                    <div style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="white-panel reservations-panel">
                <div className="panel-header">
                  <h3>Reservas dos próximos 7 dias</h3>
                  <button onClick={() => setTelaAtiva('reservas')}>Ver todas</button>
                </div>

                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Hóspede</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Quarto</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {proximasReservas.length === 0 && (
                      <tr>
                        <td colSpan="5">Nenhuma reserva cadastrada</td>
                      </tr>
                    )}

                    {proximasReservas.map((reserva) => (
                      <tr key={reserva.id}>
                        <td>
                          <div className="guest-cell">
                            <img
                              className="guest-avatar-img"
                              src={avatarHospede(reserva.tipo_hospede)}
                              alt={reserva.tipo_hospede || 'hóspede'}
                            />
                            {reserva.nome_hospede}
                          </div>
                        </td>
                        <td>{reserva.data_entrada}</td>
                        <td>{reserva.data_saida}</td>
                        <td>{reserva.quartos?.numero}</td>
                        <td>
                          <span className={reserva.status === 'reservada' ? 'status confirmed' : 'status pending'}>
                            {reserva.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="white-panel occupancy-panel">
                <h3>Ocupação de quartos</h3>

                <div className="donut-wrap">
                  <div
                    className="donut"
                    style={{
                      background: `conic-gradient(#3b82f6 ${percentualOcupacao * 3.6}deg, #eef0f5 0deg)`
                    }}
                  >
                    <div>
                      <strong>{percentualOcupacao}%</strong>
                      <span>Ocupação atual</span>
                    </div>
                  </div>

                  <div className="legend">
                    <p><b className="dot blue-dot" /> Ocupados {ocupados}</p>
                    <p><b className="dot gray-dot" /> Disponíveis {disponiveis}</p>
                  </div>
                </div>
              </div>

              <div className="white-panel actions-panel">
                <h3>Ações rápidas</h3>

                <div className="quick-actions">
                  <button onClick={() => setTelaAtiva('reservas')}>
                    <span className="qa blue">+</span>
                    Nova reserva
                  </button>

                  <button onClick={() => setTelaAtiva('recepcao')}>
                    <span className="qa green">↪</span>
                    Check-in
                  </button>

                  <button onClick={() => setTelaAtiva('recepcao')}>
                    <span className="qa orange">↩</span>
                    Check-out
                  </button>

                  <button onClick={() => setTelaAtiva('reservas')}>
                    <span className="qa purple">♙</span>
                    Novo hóspede
                  </button>

                  <button onClick={() => setTelaAtiva('restaurante')}>
                    <span className="qa blue">◒</span>
                    Serviços
                  </button>
                </div>
              </div>

              <div className="white-panel revenue-panel">
                <h3>Receita do dia</h3>

                <div className="revenue-value">
                  {formatarMoeda(faturamentoTotal())}
                  <small>↑ 12%</small>
                </div>

                <p>em relação a ontem</p>

                <div className="fake-chart">
                  <svg viewBox="0 0 400 160" preserveAspectRatio="none">
                    <path
                      d="M0,130 C35,60 65,120 95,80 C130,35 170,70 200,90 C230,110 250,40 285,72 C320,100 345,120 400,40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                    />
                    <path
                      d="M0,130 C35,60 65,120 95,80 C130,35 170,70 200,90 C230,110 250,40 285,72 C320,100 345,120 400,40 L400,160 L0,160 Z"
                      fill="rgba(59,130,246,0.10)"
                    />
                  </svg>

                  <div className="chart-hours">
                    <span>00h</span>
                    <span>06h</span>
                    <span>12h</span>
                    <span>18h</span>
                    <span>23h</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
        {telaAtiva === 'reservas' && (
          <div className="reservas-page">
            {podeFazerReserva() && (
              <div className="white-panel">
                <div className="panel-header">
                  <h2>Criar Reserva</h2>
                </div>

                <div className="form-grid">
                  <select value={quartoId} onChange={(e) => setQuartoId(e.target.value)}>
                    <option value="">Selecione o quarto</option>

                    {(Array.isArray(quartos) ? quartos : []).map((q) => (
                      <option key={q.id} value={q.id}>
                        Quarto {q.numero || '-'} - {q.andar || 'Sem andar'} - {q.tipo || 'A definir'} - R$ {q.valor_diaria || 0} - {q.status || 'livre'}
                      </option>
                    ))}
                  </select>

                  <input
                    placeholder="Nome do hóspede"
                    value={nomeHospede}
                    onChange={(e) => setNomeHospede(e.target.value)}
                  />

                  <input
                    placeholder="Telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />

                  <input
                    type="date"
                    value={entrada}
                    onChange={(e) => setEntrada(e.target.value)}
                  />

                  <input
                    type="date"
                    value={saida}
                    onChange={(e) => setSaida(e.target.value)}
                  />

                  <input
                    type="number"
                    placeholder="Qtd hóspedes"
                    value={qtdHospedes}
                    onChange={(e) => setQtdHospedes(e.target.value)}
                  />

                  <select value={tipoHospede} onChange={(e) => setTipoHospede(e.target.value)}>
                    <option value="homem">Homem</option>
                    <option value="mulher">Mulher</option>
                    <option value="menino">Menino</option>
                    <option value="menina">Menina</option>
                  </select>

                  <select value={canalVenda} onChange={(e) => setCanalVenda(e.target.value)}>
                    <option>Direto</option>
                    <option>WhatsApp</option>
                    <option>Booking</option>
                    <option>Recepção</option>
                    <option>Telefone</option>
                  </select>

                  <input
                    placeholder="Observação"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />

                  <button className="primary-button" onClick={criarReserva}>
                    Criar reserva
                  </button>
                </div>
              </div>
            )}

            <div className="white-panel">
              <div className="panel-header">
                <h2>Mapa de Reservas</h2>
              </div>

              <div className="table-scroll reservas-table-scroll">
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Quarto</th>
                      {(Array.isArray(datasMapa) ? datasMapa : []).map((data) => (
                        <th key={data}>{data}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {(Array.isArray(quartos) ? quartos : []).length === 0 && (
                      <tr>
                        <td colSpan={(Array.isArray(datasMapa) ? datasMapa.length : 0) + 1}>
                          Nenhum quarto cadastrado
                        </td>
                      </tr>
                    )}

                    {(Array.isArray(quartos) ? quartos : []).map((quarto) => (
                      <tr key={quarto.id}>
                        <td>
                          <strong>{quarto.numero || '-'}</strong>
                        </td>

                        {(Array.isArray(datasMapa) ? datasMapa : []).map((data) => {
                          const reservaEncontrada = (Array.isArray(reservas) ? reservas : []).find((item) => {
                            const entradaReserva = item?.data_entrada || ''
                            const saidaReserva = item?.data_saida || ''

                            return (
                              item?.quarto_id === quarto.id &&
                              data >= entradaReserva &&
                              data <= saidaReserva
                            )
                          })

                          return (
                            <td key={`${quarto.id}-${data}`}>
                              <span className={reservaEncontrada ? 'map-busy' : 'map-free'}>
                                {reservaEncontrada ? reservaEncontrada.nome_hospede : 'Livre'}
                              </span>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="white-panel">
              <div className="panel-header">
                <h2>Reservas</h2>
              </div>

              <div className="reservation-cards">
                {(Array.isArray(reservas) ? reservas : []).length === 0 && (
                  <div className="empty-state">
                    Nenhuma reserva cadastrada
                  </div>
                )}

                {(Array.isArray(reservas) ? reservas : []).map((reserva) => {
                  const valorReserva = Number(reserva?.valor_total || 0)
                  const consumoReserva = totalConsumosReserva(reserva.id)
                  const pagamentoReserva = totalPagamentosReserva(reserva.id)
                  const saldoReserva = valorReserva + consumoReserva - pagamentoReserva

                  return (
                    <div key={reserva.id} className="reservation-card">
                      <div className="guest-cell">
                        <img
                          className="guest-avatar-img"
                          src={avatarHospede(reserva.tipo_hospede)}
                          alt={reserva.tipo_hospede || 'hóspede'}
                        />

                        <div>
                          <h3>{reserva.nome_hospede || 'Hóspede'}</h3>
                          <small>{reserva.tipo_hospede || 'homem'}</small>
                        </div>
                      </div>

                      <p>Quarto: {reserva.quartos?.numero || '-'} - {reserva.quartos?.tipo || 'A definir'}</p>
                      <p>Entrada: {reserva.data_entrada || '-'}</p>
                      <p>Saída: {reserva.data_saida || '-'}</p>
                      <p>Hóspedes: {reserva.qtd_hospedes || 1}</p>
                      <p>Canal: {reserva.canal_venda || '-'}</p>
                      <p>Diárias: {formatarMoeda(valorReserva)}</p>
                      <p>Consumos: {formatarMoeda(consumoReserva)}</p>
                      <p>Pago: {formatarMoeda(pagamentoReserva)}</p>
                      <p>Saldo: {formatarMoeda(saldoReserva)}</p>
                      <p>Status: <strong>{reserva.status || 'reservado'}</strong></p>

                      <div className="button-row">
                        {!reserva.checkin && !reserva.checkout && (
                          <button onClick={() => fazerCheckin(reserva)}>
                            Check-in
                          </button>
                        )}

                        {reserva.checkin && !reserva.checkout && (
                          <>
                            <input
                              placeholder="Observação do checkout"
                              value={observacaoCheckout}
                              onChange={(e) => setObservacaoCheckout(e.target.value)}
                            />

                            <button onClick={() => fazerCheckout(reserva)}>
                              Check-out
                            </button>

                            <button onClick={() => window.print()}>
                              Imprimir
                            </button>
                          </>
                        )}

                        {reserva.checkout && (
                          <strong className="finished">
                            Reserva finalizada
                          </strong>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}


        {telaAtiva === 'recepcao' && (
          <>
            {podeCadastrarQuarto() && (
              <div className="white-panel">
                <h2>Cadastrar Quarto</h2>

                <div className="form-grid">
                  <input placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
                  <select value={andar} onChange={(e) => setAndar(e.target.value)}>
                    <option>Térreo</option>
                    <option>Andar 01</option>
                    <option>Andar 02</option>
                    <option>Andar 03</option>
                    <option>Andar 04</option>
                  </select>
                  <input placeholder="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} />
                  <input placeholder="Valor diária" value={valor} onChange={(e) => setValor(e.target.value)} />
                  <button onClick={salvarQuarto}>Salvar quarto</button>
                </div>
              </div>
            )}

            <div className="white-panel">
              <h2>Painel de Quartos</h2>

              <div className="quartos-andares">
                {['Térreo', 'Andar 01', 'Andar 02', 'Andar 03', 'Andar 04'].map((andar) =>
                  renderizarQuartosPorAndar(andar)
                )}
              </div>
            </div>
          </>
        )}

        {telaAtiva === 'financeiro' && podeAcessarFinanceiro() && (
          <>
            <div className="white-panel">
              <h2>Conta da Reserva</h2>

              <div className="form-grid">
                <select
                  value={reservaContaId}
                  onChange={(e) => setReservaContaId(e.target.value)}
                >
                  <option value="">Selecione uma reserva</option>
                  {reservas.map((reserva) => (
                    <option key={reserva.id} value={reserva.id}>
                      {reserva.nome_hospede} - Quarto {reserva.quartos?.numero} - {reserva.status}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Descrição do consumo"
                  value={descricaoConsumo}
                  onChange={(e) => setDescricaoConsumo(e.target.value)}
                />

                <input
                  placeholder="Valor do consumo"
                  type="number"
                  value={valorConsumo}
                  onChange={(e) => setValorConsumo(e.target.value)}
                />

                <button onClick={lancarConsumo}>
                  Lançar consumo
                </button>

                <input
                  placeholder="Valor do pagamento"
                  type="number"
                  value={valorPagamento}
                  onChange={(e) => setValorPagamento(e.target.value)}
                />

                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                >
                  <option>Dinheiro</option>
                  <option>PIX</option>
                  <option>Cartão de crédito</option>
                  <option>Cartão de débito</option>
                  <option>Transferência</option>
                </select>

                <button onClick={registrarPagamento}>
                  Registrar pagamento
                </button>
              </div>

              {reservaContaId && (
                <div className="finance-detail">
                  {reservas
                    .filter((reserva) => reserva.id === reservaContaId)
                    .map((reserva) => {
                      const totalReserva = Number(reserva.valor_total || 0)
                      const totalConsumos = totalConsumosReserva(reserva.id)
                      const totalPagamentos = totalPagamentosReserva(reserva.id)
                      const saldo = totalReserva + totalConsumos - totalPagamentos

                      return (
                        <div key={reserva.id}>
                          <h3>Conta de {reserva.nome_hospede}</h3>
                          <p>Quarto: {reserva.quartos?.numero} - {reserva.quartos?.tipo}</p>
                          <p>Diárias: {formatarMoeda(totalReserva)}</p>
                          <p>Consumos: {formatarMoeda(totalConsumos)}</p>
                          <p>Pagamentos: {formatarMoeda(totalPagamentos)}</p>
                          <h3>Saldo: {formatarMoeda(saldo)}</h3>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>

            {podeAcessarCaixa() && (
              <div className="white-panel">
                <div className="panel-header">
                  <h2>Caixa</h2>
                  <strong>Saldo: {formatarMoeda(saldoCaixa())}</strong>
                </div>

                <div className="form-grid">
                  <select
                    value={caixaTipo}
                    onChange={(e) => setCaixaTipo(e.target.value)}
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>

                  <input
                    placeholder="Descrição"
                    value={caixaDescricao}
                    onChange={(e) => setCaixaDescricao(e.target.value)}
                  />

                  <input
                    placeholder="Valor"
                    type="number"
                    value={caixaValor}
                    onChange={(e) => setCaixaValor(e.target.value)}
                  />

                  <select
                    value={caixaFormaPagamento}
                    onChange={(e) => setCaixaFormaPagamento(e.target.value)}
                  >
                    <option>Dinheiro</option>
                    <option>PIX</option>
                    <option>Cartão de crédito</option>
                    <option>Cartão de débito</option>
                    <option>Transferência</option>
                  </select>

                  <button onClick={lancarCaixa}>
                    Lançar caixa
                  </button>
                </div>

                <table className="clean-table tabela-caixa">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Forma</th>
                    </tr>
                  </thead>

                  <tbody>
                    {caixa.length === 0 && (
                      <tr>
                        <td colSpan="4">Nenhum lançamento no caixa</td>
                      </tr>
                    )}

                    {caixa.slice(0, 8).map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span className={item.tipo === 'entrada' ? 'status confirmed' : 'status pending'}>
                            {item.tipo}
                          </span>
                        </td>
                        <td>{item.descricao}</td>
                        <td>{formatarMoeda(item.valor)}</td>
                        <td>{item.forma_pagamento || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-info">
                  <span>Total de Diárias</span>
                  <strong>
                    {formatarMoeda(reservas.reduce((total, reserva) => total + Number(reserva.valor_total || 0), 0))}
                  </strong>
                </div>
              </div>

              <div className="stat-card green">
                <div className="stat-info">
                  <span>Total de Consumos</span>
                  <strong>
                    {formatarMoeda(consumos.reduce((total, consumo) => total + Number(consumo.valor || 0), 0))}
                  </strong>
                </div>
              </div>

              <div className="stat-card orange">
                <div className="stat-info">
                  <span>Total Recebido</span>
                  <strong>
                    {formatarMoeda(pagamentos.reduce((total, pagamento) => total + Number(pagamento.valor || 0), 0))}
                  </strong>
                </div>
              </div>
            </div>
          </>
        )}
        {telaAtiva === 'restaurante' && (
          <div className="white-panel">
            <div className="panel-header">
              <h2>Serviços e Consumo do Quarto</h2>
              <button onClick={() => setTelaAtiva('estoque')}>Cadastrar produtos</button>
            </div>

            <p className="config-info">
              Use esta tela quando o hóspede consumir Coca-Cola, água, cerveja, camisinha ou qualquer item do frigobar/freezer do quarto.
              O sistema lança o valor na conta da reserva e baixa automaticamente do estoque.
            </p>

            <div className="form-grid">
              <select
                value={consumoReservaId}
                onChange={(e) => setConsumoReservaId(e.target.value)}
              >
                <option value="">Selecione a reserva/quarto</option>
                {(Array.isArray(reservas) ? reservas : [])
                  .filter((reserva) => !reserva.checkout)
                  .map((reserva) => (
                    <option key={reserva.id} value={reserva.id}>
                      Quarto {reserva.quartos?.numero || '-'} - {reserva.nome_hospede || 'Hóspede'}
                    </option>
                  ))}
              </select>

              <select
                value={consumoProdutoId}
                onChange={(e) => setConsumoProdutoId(e.target.value)}
              >
                <option value="">Selecione o produto/serviço</option>
                {(Array.isArray(produtos) ? produtos : [])
                  .filter((produto) => produto.ativo !== false)
                  .map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} - {formatarMoeda(produto.valor_venda || 0)} - Estoque: {produto.estoque_atual || 0}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                placeholder="Quantidade"
                value={consumoQuantidade}
                onChange={(e) => setConsumoQuantidade(e.target.value)}
              />

              <input
                placeholder="Observação"
                value={consumoObservacao}
                onChange={(e) => setConsumoObservacao(e.target.value)}
              />

              <button onClick={lancarConsumoQuarto}>
                Lançar consumo
              </button>
            </div>

            <div className="module-grid">
              <div className="module-card">
                <h3>Consumos registrados</h3>
                <strong>{consumos.length}</strong>
                <p>Total de itens lançados nas contas.</p>
              </div>

              <div className="module-card">
                <h3>Produtos do frigobar</h3>
                <strong>{produtos.filter((produto) => produto.usado_em_frigobar).length}</strong>
                <p>Itens marcados para uso em quarto.</p>
              </div>

              <div className="module-card">
                <h3>Estoque baixo</h3>
                <strong>{totalEstoqueBaixo()}</strong>
                <p>Produtos que precisam de reposição.</p>
              </div>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Reserva</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>
                {consumos.length === 0 && (
                  <tr>
                    <td colSpan="4">Nenhum consumo lançado</td>
                  </tr>
                )}

                {consumos.slice(0, 20).map((consumo) => (
                  <tr key={consumo.id}>
                    <td>{consumo.descricao}</td>
                    <td>{formatarMoeda(consumo.valor)}</td>
                    <td>{consumo.reserva_id}</td>
                    <td>{String(consumo.criado_em || '').slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


        {telaAtiva === 'hospedes' && (
          <div className="white-panel">
            <div className="panel-header">
              <h2>Hóspedes</h2>
              <button onClick={() => setTelaAtiva('reservas')}>Nova reserva</button>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th>Hóspede</th>
                  <th>Telefone</th>
                  <th>Quarto</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {reservas.length === 0 && (
                  <tr>
                    <td colSpan="6">Nenhum hóspede encontrado</td>
                  </tr>
                )}

                {reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>
                      <div className="guest-cell">
                        <img
                              className="guest-avatar-img"
                              src={avatarHospede(reserva.tipo_hospede)}
                              alt={reserva.tipo_hospede || 'hóspede'}
                            />
                        {reserva.nome_hospede}
                      </div>
                    </td>
                    <td>{reserva.telefone || 'Não informado'}</td>
                    <td>{reserva.quartos?.numero || '-'}</td>
                    <td>{reserva.data_entrada}</td>
                    <td>{reserva.data_saida}</td>
                    <td>
                      <span className="status confirmed">
                        {reserva.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {telaAtiva === 'quartos' && (
          <div className="white-panel">
            <div className="panel-header">
              <h2>Quartos</h2>
              <button onClick={() => setTelaAtiva('recepcao')}>Painel operacional</button>
            </div>

            {podeCadastrarQuarto() && (
              <div className="form-grid">
                <input placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
                <input placeholder="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} />
                <input placeholder="Valor diária" value={valor} onChange={(e) => setValor(e.target.value)} />
                <button onClick={salvarQuarto}>Salvar quarto</button>
              </div>
            )}

            <div className="quartos-andares">
                {['Térreo', 'Andar 01', 'Andar 02', 'Andar 03', 'Andar 04'].map((andar) =>
                  renderizarQuartosPorAndar(andar)
                )}
              </div>
          </div>
        )}
        {telaAtiva === 'estoque' && podeAcessarEstoque() && (
          <>
            <section className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-info">
                  <span>Produtos ativos</span>
                  <strong>{produtos.filter((produto) => produto.ativo).length}</strong>
                  <small>Produtos e serviços cadastrados</small>
                </div>
              </div>

              <div className="stat-card green">
                <div className="stat-info">
                  <span>Categorias</span>
                  <strong>{categoriasProdutos.length}</strong>
                  <small>Categorias cadastradas</small>
                </div>
              </div>

              <div className="stat-card orange">
                <div className="stat-info">
                  <span>Baixo estoque</span>
                  <strong>{totalEstoqueBaixo()}</strong>
                  <small>Itens em alerta</small>
                </div>
              </div>

              <div className="stat-card purple">
                <div className="stat-info">
                  <span>Movimentações</span>
                  <strong>{movimentacoesEstoque.length}</strong>
                  <small>Entradas e saídas</small>
                </div>
              </div>
            </section>

            <div className="white-panel">
              <div className="panel-header">
                <h2>Cadastro de Categorias e Produtos</h2>
              </div>

              <div className="form-grid">
                <input
                  placeholder="Nova categoria"
                  value={nomeCategoria}
                  onChange={(e) => setNomeCategoria(e.target.value)}
                />

                <button onClick={salvarCategoriaProduto}>
                  Salvar categoria
                </button>
              </div>

              <div className="form-grid">
                <input
                  placeholder="Nome do produto/serviço"
                  value={produtoNome}
                  onChange={(e) => setProdutoNome(e.target.value)}
                />

                <select
                  value={produtoCategoriaId}
                  onChange={(e) => setProdutoCategoriaId(e.target.value)}
                >
                  <option value="">Categoria</option>
                  {categoriasProdutos.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>

                <select
                  value={produtoTipo}
                  onChange={(e) => setProdutoTipo(e.target.value)}
                >
                  <option>Produto</option>
                  <option>Serviço</option>
                </select>

                <input
                  placeholder="Valor de venda"
                  type="number"
                  value={produtoValor}
                  onChange={(e) => setProdutoValor(e.target.value)}
                />

                <input
                  placeholder="Estoque atual"
                  type="number"
                  value={produtoEstoque}
                  onChange={(e) => setProdutoEstoque(e.target.value)}
                />

                <input
                  placeholder="Estoque mínimo"
                  type="number"
                  value={produtoEstoqueMinimo}
                  onChange={(e) => setProdutoEstoqueMinimo(e.target.value)}
                />

                <select
                  value={produtoLocalUso}
                  onChange={(e) => setProdutoLocalUso(e.target.value)}
                >
                  <option>Geral</option>
                  <option>Frigobar do quarto</option>
                  <option>Restaurante</option>
                  <option>Bar</option>
                  <option>Limpeza</option>
                </select>

                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    checked={produtoFrigobar}
                    onChange={(e) => setProdutoFrigobar(e.target.checked)}
                  />
                  Produto usado no frigobar/freezer dos quartos
                </label>

                <button onClick={salvarProduto}>
                  Salvar produto
                </button>
              </div>
            </div>

            <div className="white-panel">
              <div className="panel-header">
                <h2>Movimentação de Estoque</h2>
              </div>

              <div className="form-grid">
                <select
                  value={produtoMovimentoId}
                  onChange={(e) => setProdutoMovimentoId(e.target.value)}
                >
                  <option value="">Selecione o produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} - Estoque: {produto.estoque_atual}
                    </option>
                  ))}
                </select>

                <select
                  value={tipoMovimentoEstoque}
                  onChange={(e) => setTipoMovimentoEstoque(e.target.value)}
                >
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </select>

                <input
                  placeholder="Quantidade"
                  type="number"
                  value={quantidadeMovimento}
                  onChange={(e) => setQuantidadeMovimento(e.target.value)}
                />

                <input
                  placeholder="Observação"
                  value={observacaoMovimento}
                  onChange={(e) => setObservacaoMovimento(e.target.value)}
                />

                <button onClick={movimentarEstoque}>
                  Atualizar estoque
                </button>
              </div>
            </div>

            <div className="white-panel">
              <div className="panel-header">
                <h2>Produtos e Serviços</h2>
              </div>

              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Estoque</th>
                    <th>Local</th>
                    <th>Frigobar</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {produtos.length === 0 && (
                    <tr>
                      <td colSpan="8">Nenhum produto cadastrado</td>
                    </tr>
                  )}

                  {produtos.map((produto) => (
                    <tr key={produto.id}>
                      <td>{produto.nome}</td>
                      <td>{produto.categorias_produtos?.nome || '-'}</td>
                      <td>{produto.tipo}</td>
                      <td>{formatarMoeda(produto.valor_venda)}</td>
                      <td>{produto.estoque_atual}</td>
                      <td>{produto.local_uso || 'Geral'}</td>
                      <td>{produto.usado_em_frigobar ? 'Sim' : 'Não'}</td>
                      <td>
                        <span className={
                          Number(produto.estoque_atual || 0) <= Number(produto.estoque_minimo || 0)
                            ? 'status pending'
                            : 'status confirmed'
                        }>
                          {Number(produto.estoque_atual || 0) <= Number(produto.estoque_minimo || 0)
                            ? 'Baixo estoque'
                            : 'OK'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {telaAtiva === 'relatorios' && (
          <>
            <div className="white-panel print-report-panel">
              <div className="print-company-header">
                <h1>{empresaConfig?.nome_fantasia || 'CRONOS'}</h1>
                <p>{empresaConfig?.nome_empresa || 'Sistema Hotel'}</p>
                <p>
                  {empresaConfig?.cnpj && `CNPJ: ${empresaConfig.cnpj} | `}
                  {empresaConfig?.telefone && `Telefone: ${empresaConfig.telefone} | `}
                  {empresaConfig?.email && `E-mail: ${empresaConfig.email}`}
                </p>
                <p>
                  {empresaConfig?.endereco}
                  {empresaConfig?.cidade && ` - ${empresaConfig.cidade}`}
                  {empresaConfig?.estado && `/${empresaConfig.estado}`}
                </p>
              </div>

              <div className="panel-header">
                <h2>Relatórios por Período</h2>
                <button onClick={() => window.print()}>Imprimir</button>
              </div>

              <div className="report-filter no-print">
                <div>
                  <label>Data inicial</label>
                  <input
                    type="date"
                    value={relatorioDataInicio}
                    onChange={(e) => setRelatorioDataInicio(e.target.value)}
                  />
                </div>

                <div>
                  <label>Data final</label>
                  <input
                    type="date"
                    value={relatorioDataFim}
                    onChange={(e) => setRelatorioDataFim(e.target.value)}
                  />
                </div>

                <button onClick={() => window.print()}>
                  Imprimir relatório
                </button>
              </div>

              <div className="period-title">
                <strong>Período:</strong> {dataBrasil(relatorioDataInicio)} até {dataBrasil(relatorioDataFim)}
              </div>

              <section className="stats-grid report-stats">
                <div className="stat-card blue">
                  <div className="stat-info">
                    <span>Reservas no período</span>
                    <strong>{reservasPorPeriodo().length}</strong>
                    <small>{formatarMoeda(totalReservasPeriodo())}</small>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-info">
                    <span>Pagamentos recebidos</span>
                    <strong>{formatarMoeda(totalPagamentosPeriodo())}</strong>
                    <small>Total recebido no período</small>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-info">
                    <span>Consumos</span>
                    <strong>{formatarMoeda(totalConsumosPeriodo())}</strong>
                    <small>Frigobar, restaurante e serviços</small>
                  </div>
                </div>

                <div className="stat-card purple">
                  <div className="stat-info">
                    <span>Saldo estimado</span>
                    <strong>{formatarMoeda(totalReservasPeriodo() + totalConsumosPeriodo() - totalPagamentosPeriodo())}</strong>
                    <small>Reservas + consumos - pagamentos</small>
                  </div>
                </div>
              </section>

              <div className="report-section">
                <h3>Reservas do período</h3>

                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Hóspede</th>
                      <th>Quarto</th>
                      <th>Entrada</th>
                      <th>Saída</th>
                      <th>Status</th>
                      <th>Valor</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reservasPorPeriodo().length === 0 && (
                      <tr>
                        <td colSpan="6">Nenhuma reserva no período selecionado</td>
                      </tr>
                    )}

                    {reservasPorPeriodo().map((reserva) => (
                      <tr key={reserva.id}>
                        <td>{reserva.nome_hospede || '-'}</td>
                        <td>{reserva.quartos?.numero || '-'}</td>
                        <td>{reserva.data_entrada || '-'}</td>
                        <td>{reserva.data_saida || '-'}</td>
                        <td>{reserva.status || '-'}</td>
                        <td>{formatarMoeda(reserva.valor_total || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="report-section">
                <h3>Consumos do período</h3>

                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Reserva</th>
                      <th>Data</th>
                      <th>Valor</th>
                    </tr>
                  </thead>

                  <tbody>
                    {consumosPorPeriodo().length === 0 && (
                      <tr>
                        <td colSpan="4">Nenhum consumo no período selecionado</td>
                      </tr>
                    )}

                    {consumosPorPeriodo().map((consumo) => (
                      <tr key={consumo.id}>
                        <td>{consumo.descricao || '-'}</td>
                        <td>{consumo.reserva_id || '-'}</td>
                        <td>{String(consumo.criado_em || '').slice(0, 10)}</td>
                        <td>{formatarMoeda(consumo.valor || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="report-section">
                <h3>Pagamentos do período</h3>

                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Forma</th>
                      <th>Reserva</th>
                      <th>Data</th>
                      <th>Valor</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pagamentosPorPeriodo().length === 0 && (
                      <tr>
                        <td colSpan="4">Nenhum pagamento no período selecionado</td>
                      </tr>
                    )}

                    {pagamentosPorPeriodo().map((pagamento) => (
                      <tr key={pagamento.id}>
                        <td>{pagamento.forma_pagamento || '-'}</td>
                        <td>{pagamento.reserva_id || '-'}</td>
                        <td>{String(pagamento.criado_em || '').slice(0, 10)}</td>
                        <td>{formatarMoeda(pagamento.valor || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}


        {telaAtiva === 'configuracoes' && (
          <>
            <div className="white-panel">
              <div className="panel-header">
                <h2>Dados da Empresa</h2>
                <button onClick={salvarEmpresaConfig}>Salvar empresa</button>
              </div>

              <p className="config-info">
                Essas informações aparecem no topo do sistema e nos relatórios impressos.
              </p>

              <div className="form-grid">
                <input
                  placeholder="Nome fantasia que aparece no topo"
                  value={empresaFantasia}
                  onChange={(e) => setEmpresaFantasia(e.target.value)}
                />

                <input
                  placeholder="Razão social / Nome da empresa"
                  value={empresaNome}
                  onChange={(e) => setEmpresaNome(e.target.value)}
                />

                <input
                  placeholder="CNPJ"
                  value={empresaCnpj}
                  onChange={(e) => setEmpresaCnpj(e.target.value)}
                />

                <input
                  placeholder="Telefone"
                  value={empresaTelefone}
                  onChange={(e) => setEmpresaTelefone(e.target.value)}
                />

                <input
                  placeholder="E-mail"
                  value={empresaEmail}
                  onChange={(e) => setEmpresaEmail(e.target.value)}
                />

                <input
                  placeholder="Endereço"
                  value={empresaEndereco}
                  onChange={(e) => setEmpresaEndereco(e.target.value)}
                />

                <input
                  placeholder="Cidade"
                  value={empresaCidade}
                  onChange={(e) => setEmpresaCidade(e.target.value)}
                />

                <input
                  placeholder="Estado"
                  value={empresaEstado}
                  onChange={(e) => setEmpresaEstado(e.target.value)}
                />

                <input
                  placeholder="Observação para relatórios"
                  value={empresaObservacao}
                  onChange={(e) => setEmpresaObservacao(e.target.value)}
                />
              </div>
            </div>

            <div className="white-panel">
              <h2>Configurações prontas</h2>

              <div className="module-grid">
                <div className="module-card">
                  <h3>Empresa</h3>
                  <p>Dados do hotel usados no topo do sistema e nos relatórios.</p>
                  <span className="status confirmed">Ativo</span>
                </div>

                <div className="module-card">
                  <h3>Usuários</h3>
                  <p>Gerenciamento de usuários e permissões.</p>
                  <button onClick={() => setTelaAtiva('usuarios')}>Abrir usuários</button>
                </div>

                <div className="module-card">
                  <h3>Produtos do Frigobar</h3>
                  <p>Cadastre coca-cola, água, cerveja, camisinha e outros itens para consumo nos quartos.</p>
                  <button onClick={() => setTelaAtiva('estoque')}>Abrir estoque</button>
                </div>

                <div className="module-card">
                  <h3>Financeiro</h3>
                  <p>Formas de pagamento, caixa e regras de cobrança.</p>
                  <button onClick={() => setTelaAtiva('financeiro')}>Abrir financeiro</button>
                </div>

                <div className="module-card">
                  <h3>Relatórios</h3>
                  <p>Relatórios impressos com dados da empresa.</p>
                  <button onClick={() => setTelaAtiva('relatorios')}>Abrir relatórios</button>
                </div>

                <div className="module-card">
                  <h3>Sistema</h3>
                  <p>Parâmetros gerais, auditoria, backup e segurança.</p>
                  <span className="status pending">Preparado</span>
                </div>
              </div>
            </div>
          </>
        )}


        {telaAtiva === 'usuarios' && usuarioLogado?.perfil === 'Administrador' && (
          <>
            <div className="white-panel">
              <h2>Usuários do Sistema</h2>

              <div className="form-grid">
                <input placeholder="Nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
                <input placeholder="Telefone" value={novoTelefone} onChange={(e) => setNovoTelefone(e.target.value)} />
                <input placeholder="Login" value={novoLogin} onChange={(e) => setNovoLogin(e.target.value)} />
                <input placeholder="Senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />

                <select value={novoPerfil} onChange={(e) => setNovoPerfil(e.target.value)}>
                  <option>Administrador</option>
                  <option>Recepção</option>
                  <option>Financeiro</option>
                  <option>Limpeza</option>
                </select>

                <button onClick={criarUsuario}>
                  Criar usuário
                </button>
              </div>

              <div className="user-list">
                {usuarios.map((usuario) => (
                  <div key={usuario.id} className="user-card">
                    <strong>{usuario.nome}</strong>
                    <p>Login: {usuario.login}</p>
                    <p>Perfil: {usuario.perfil}</p>
                    <p>Telefone: {usuario.telefone || 'Não informado'}</p>
                    <p>Status: {usuario.ativo ? 'Ativo' : 'Inativo'}</p>

                    <div className="button-row">
                      <button onClick={() => setEditandoUsuario(usuario)}>
                        Editar
                      </button>

                      <button onClick={() => alterarStatusUsuario(usuario)}>
                        {usuario.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {editandoUsuario && (
              <div className="white-panel">
                <h2>Editar Usuário</h2>

                <div className="form-grid">
                  <input
                    placeholder="Nome"
                    value={editandoUsuario.nome}
                    onChange={(e) => setEditandoUsuario({ ...editandoUsuario, nome: e.target.value })}
                  />

                  <input
                    placeholder="Telefone"
                    value={editandoUsuario.telefone || ''}
                    onChange={(e) => setEditandoUsuario({ ...editandoUsuario, telefone: e.target.value })}
                  />

                  <input
                    placeholder="Login"
                    value={editandoUsuario.login}
                    onChange={(e) => setEditandoUsuario({ ...editandoUsuario, login: e.target.value })}
                  />

                  <input
                    placeholder="Senha"
                    value={editandoUsuario.senha}
                    onChange={(e) => setEditandoUsuario({ ...editandoUsuario, senha: e.target.value })}
                  />

                  <select
                    value={editandoUsuario.perfil}
                    onChange={(e) => setEditandoUsuario({ ...editandoUsuario, perfil: e.target.value })}
                  >
                    <option>Administrador</option>
                    <option>Recepção</option>
                    <option>Financeiro</option>
                    <option>Limpeza</option>
                  </select>
                </div>

                <div className="button-row">
                  <button onClick={salvarEdicaoUsuario}>
                    Salvar alterações
                  </button>

                  <button onClick={() => setEditandoUsuario(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="footer">
          DEVELOPED BY DINHO OLIVEIRA
        </div>
      </main>
    </div>
  )
}

export default App
