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
  const [centralReservaId, setCentralReservaId] = useState('')
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
  const [valorReservaManual, setValorReservaManual] = useState('')
  const [despesaReservaDescricao, setDespesaReservaDescricao] = useState('')
  const [despesaReservaQuantidade, setDespesaReservaQuantidade] = useState('1')
  const [despesaReservaValor, setDespesaReservaValor] = useState('')
  const [despesasReserva, setDespesasReserva] = useState([])
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
  const [avisoSistema, setAvisoSistema] = useState(null)
  const [empresaLogo, setEmpresaLogo] = useState(() => localStorage.getItem('cronos_logo_hotel') || '')

  function mostrarAviso(mensagem, tipo = 'info') {
    setAvisoSistema({ mensagem, tipo })
    window.setTimeout(() => {
      setAvisoSistema(null)
    }, 3200)
  }


  function carregarLogoHotel(arquivo) {
    if (!arquivo) return

    const leitor = new FileReader()
    leitor.onload = () => {
      const resultado = String(leitor.result || '')
      setEmpresaLogo(resultado)
      localStorage.setItem('cronos_logo_hotel', resultado)
      mostrarAviso('Logo do hotel atualizada.', 'sucesso')
    }
    leitor.readAsDataURL(arquivo)
  }

  function removerLogoHotel() {
    setEmpresaLogo('')
    localStorage.removeItem('cronos_logo_hotel')
    mostrarAviso('Logo removida.', 'sucesso')
  }


  function adicionarDespesaReserva() {
    const descricao = despesaReservaDescricao.trim()
    const quantidade = Number(despesaReservaQuantidade || 1)
    const valorUnitario = converterValorDigitado(despesaReservaValor)

    if (!descricao || quantidade <= 0 || valorUnitario <= 0) {
      mostrarAviso('Informe descrição, quantidade e valor da despesa.', 'erro')
      return
    }

    setDespesasReserva((lista) => [
      ...lista,
      {
        id: `despesa-${Date.now()}`,
        descricao,
        quantidade,
        valor_unitario: valorUnitario,
        valor_total: quantidade * valorUnitario
      }
    ])

    setDespesaReservaDescricao('')
    setDespesaReservaQuantidade('1')
    setDespesaReservaValor('')
  }

  function removerDespesaReserva(id) {
    setDespesasReserva((lista) => lista.filter((item) => item.id !== id))
  }

  function totalDespesasReservaTemporarias() {
    return despesasReserva.reduce((total, item) => total + Number(item.valor_total || 0), 0)
  }

  function valorDiariaReservaDigitado() {
    return converterValorDigitado(valorReservaManual)
  }

  function totalHospedagemReservaTemporaria() {
    return valorDiariaReservaDigitado() * calcularDiarias()
  }

  function totalReservaTemporariarelatório() {
    return totalHospedagemReservaTemporaria() + totalDespesasReservaTemporarias()
  }

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
      mostrarAviso('Informe a descrição e o valor do lançamento.', 'erro')
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
      mostrarAviso('Erro ao lançar caixa. Tente novamente.', 'erro')
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
    mostrarAviso('Lançamento registrado no caixa.', 'sucesso')
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

    if (status === 'livre') {
      const reservasAbertas = (Array.isArray(reservas) ? reservas : []).filter((reserva) => {
        return String(reserva.quarto_id) === String(id) &&
          !reserva.checkout &&
          reserva.status !== 'finalizada' &&
          reserva.status !== 'cancelada'
      })

      if (reservasAbertas.length > 0) {
        const idsReservasAbertas = reservasAbertas.map((reserva) => reserva.id)

        const { error: erroReservas } = await supabase
          .from('reservas')
          .update({
            checkout: true,
            status: 'finalizada',
            observacao_checkout: 'Quarto liberado manualmente. Conta encerrada automaticamente.'
          })
          .in('id', idsReservasAbertas)

        if (erroReservas) {
          alert('Quarto liberado, mas houve erro ao encerrar a conta da reserva')
          console.log(erroReservas)
        }
      }
    }

    carregarQuartos()
    carregarReservas()
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

    const valorDiariaDigitado = converterValorDigitado(valorReservaManual)

    if (valorDiariaDigitado <= 0) {
      mostrarAviso('Informe o valor da diária da hospedagem.', 'erro')
      return
    }

    const valorDiaria = valorDiariaDigitado
    const valorHospedagem = valorDiaria * diarias
    const valorDespesasExtras = totalDespesasReservaTemporarias()
    const valorTotal = valorHospedagem + valorDespesasExtras

    const { data: reservaCriada, error } = await supabase.from('reservas').insert({
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
      .select('*')
      .single()

    if (error) {
      alert('Erro ao criar reserva')
      console.log(error)
      return
    }

    await supabase
      .from('quartos')
      .update({ status: 'reservado' })
      .eq('id', quartoId)

    const despesasExtrasPDF = despesasReserva.map((item) => ({ ...item }))

    if (reservaCriada && despesasExtrasPDF.length > 0) {
      const { error: erroDespesas } = await supabase.from('consumos').insert(
        despesasExtrasPDF.map((item) => ({
          reserva_id: reservaCriada.id,
          descricao: `${item.descricao} x${item.quantidade}`,
          valor: Number(item.valor_total || 0)
        }))
      )

      if (erroDespesas) {
        mostrarAviso('Reserva criada, mas houve erro ao salvar as despesas extras.', 'erro')
        console.log(erroDespesas)
      }
    }

    const reservaParaEnvio = reservaCriada
      ? {
          ...reservaCriada,
          quartos: {
            numero: quartoSelecionado.numero,
            tipo: quartoSelecionado.tipo
          },
          despesas_extras_pdf: despesasExtrasPDF
        }
      : null

    if (reservaParaEnvio) {
      gerarRelatorioReservaPDF(reservaParaEnvio)
      abrirWhatsAppReserva(reservaParaEnvio)
    }

    setQuartoId('')
    setNomeHospede('')
    setTelefone('')
    setEntrada('')
    setSaida('')
    setQtdHospedes(1)
    setValorReservaManual('')
    setDespesasReserva([])
    setDespesaReservaDescricao('')
    setDespesaReservaQuantidade('1')
    setDespesaReservaValor('')
    setTipoHospede('homem')
    setCanalVenda('Direto')
    setObservacao('')

    carregarQuartos()
    carregarReservas()
    mostrarAviso('Reserva criada. Resumo gerado e WhatsApp aberto para envio ao hóspede.', 'sucesso')
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
      mostrarAviso('Selecione uma reserva e informe descrição e valor do consumo.', 'erro')
      return
    }

    const { error } = await supabase.from('consumos').insert({
      reserva_id: reservaContaId,
      descricao: descricaoConsumo,
      valor: Number(valorConsumo || 0)
    })

    if (error) {
      mostrarAviso('Erro ao lançar consumo. Tente novamente.', 'erro')
      console.log(error)
      return
    }

    setDescricaoConsumo('')
    setValorConsumo('')
    carregarConsumos()
    mostrarAviso('Consumo lançado na conta da reserva.', 'sucesso')
  }

  async function registrarPagamento() {
    if (!reservaContaId || !valorPagamento || !formaPagamento) {
      mostrarAviso('Selecione a reserva, informe o valor e a forma de pagamento.', 'erro')
      return
    }

    const { error } = await supabase.from('pagamentos').insert({
      reserva_id: reservaContaId,
      valor: Number(valorPagamento || 0),
      forma_pagamento: formaPagamento
    })

    if (error) {
      mostrarAviso('Erro ao registrar pagamento. Tente novamente.', 'erro')
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
    mostrarAviso('Pagamento registrado com sucesso.', 'sucesso')
  }


  function isReservaTeste(reserva) {
    const nome = String(reserva?.nome_hospede || '').trim().toLowerCase()
    const telefoneReserva = String(reserva?.telefone || '').replace(/\D/g, '')
    const observacaoReserva = String(reserva?.observacao || '').toLowerCase()

    return (
      nome === 'teste' ||
      nome.includes('teste') ||
      observacaoReserva.includes('teste') ||
      telefoneReserva === '00000000000' ||
      telefoneReserva === '0000000000'
    )
  }

  async function limparDadosTesteSistema() {
    if (usuarioLogado?.perfil !== 'Administrador') {
      mostrarAviso('Apenas administrador pode limpar dados de teste.', 'erro')
      return
    }

    const reservasTeste = (Array.isArray(reservas) ? reservas : []).filter(isReservaTeste)

    if (reservasTeste.length === 0) {
      mostrarAviso('Nenhuma reserva de teste encontrada.', 'info')
      return
    }

    const confirmar = confirm(
      `Foram encontradas ${reservasTeste.length} reserva(s) de teste. Deseja apagar reservas, consumos, pagamentos e lançamentos de caixa vinculados a elas?`
    )

    if (!confirmar) return

    const idsReservas = reservasTeste.map((reserva) => reserva.id)
    const idsQuartos = [...new Set(reservasTeste.map((reserva) => reserva.quarto_id).filter(Boolean))]

    try {
      await supabase.from('consumos').delete().in('reserva_id', idsReservas)
      await supabase.from('pagamentos').delete().in('reserva_id', idsReservas)
      await supabase.from('caixa').delete().in('reserva_id', idsReservas)
      await supabase.from('reservas').delete().in('id', idsReservas)

      if (idsQuartos.length > 0) {
        await supabase.from('quartos').update({ status: 'livre' }).in('id', idsQuartos)
      }

      await registrarAuditoria('Limpeza de dados de teste', `${reservasTeste.length} reserva(s) removida(s)`)

      carregarQuartos()
      carregarReservas()
      carregarConsumos()
      carregarPagamentos()
      carregarCaixa()

      mostrarAviso('Dados de teste removidos com sucesso.', 'sucesso')
    } catch (erro) {
      console.log(erro)
      mostrarAviso('Erro ao limpar dados de teste.', 'erro')
    }
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

  function reservaEncerrada(reserva) {
    return Boolean(reserva?.checkout) ||
      reserva?.status === 'finalizada' ||
      reserva?.status === 'cancelada'
  }

  function calcularSaldoReserva(reserva) {
    if (!reserva || reservaEncerrada(reserva)) return 0

    const totalReserva = Number(reserva.valor_total || 0)
    const totalConsumos = totalConsumosReserva(reserva.id)
    const totalPagamentos = totalPagamentosReserva(reserva.id)

    return Math.max(0, totalReserva + totalConsumos - totalPagamentos)
  }

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  function converterValorDigitado(valorDigitado) {
    const texto = String(valorDigitado || '').trim()

    if (!texto) return 0

    const normalizado = texto
      .replace(/R\$/gi, '')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.')

    const numero = Number(normalizado)

    return Number.isFinite(numero) ? numero : 0
  }

  function telefoneWhatsApp(telefoneInformado) {
    const numeros = String(telefoneInformado || '').replace(/\D/g, '')

    if (!numeros) return ''
    if (numeros.startsWith('55')) return numeros

    return `55${numeros}`
  }

  function abrirWhatsAppReserva(reserva) {
    if (!reserva?.telefone) {
      mostrarAviso('Reserva criada. Informe o telefone do hóspede para abrir o WhatsApp.', 'info')
      return
    }

    const numeroWhatsApp = telefoneWhatsApp(reserva.telefone)
    const mensagem = [
      `Olá, ${reserva.nome_hospede || 'hóspede'}!`,
      '',
      `Segue o resumo da sua reserva no ${empresaFantasia || empresaConfig?.nome_fantasia || 'hotel'}:`,
      `Quarto: ${reserva.quartos?.numero || '-'}`,
      `Entrada: ${dataBrasil(reserva.data_entrada)}`,
      `Saída: ${dataBrasil(reserva.data_saida)}`,
      `Noites: ${calcularNoitesReserva(reserva)}`,
      `Hospedagem: ${formatarMoeda(Number(reserva.valor_diaria || 0) * calcularNoitesReserva(reserva))}`,
      `Outras despesas: ${formatarMoeda((Array.isArray(reserva.despesas_extras_pdf) ? reserva.despesas_extras_pdf : []).reduce((total, item) => total + Number(item.valor_total || 0), 0))}`,
      `Valor total: ${formatarMoeda(reserva.valor_total)}`,
      '',
      'Também gerei o resumo da reserva para envio.'
    ].join('\n')

    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank')
  }


  function gerarRelatorioReservaPDF(reserva) {
    if (!reserva) return

    const linhas = gerarLinhasContaReserva(reserva)
    const totalDiarias = Number(reserva.valor_diaria || 0) * calcularNoitesReserva(reserva)
    const totalDespesasExtrasPDF = (Array.isArray(reserva.despesas_extras_pdf) ? reserva.despesas_extras_pdf : [])
      .reduce((total, item) => total + Number(item.valor_total || 0), 0)
    const totalConsumos = totalConsumosReserva(reserva.id) + totalDespesasExtrasPDF
    const totalRecebido = totalPagamentosReserva(reserva.id)
    const saldo = calcularSaldoReserva(reserva)
    const logoHtml = empresaLogo
      ? `<img src="${empresaLogo}" style="max-height:72px;max-width:180px;object-fit:contain" />`
      : `<div style="font-size:28px;font-weight:900;color:#1e40af">${empresaFantasia || empresaConfig?.nome_fantasia || 'CRONOS HOTEL'}</div>`

    const janela = window.open('', '_blank', 'width=900,height=700')
    if (!janela) {
      mostrarAviso('Não foi possível abrir o relatório. Libere pop-ups do navegador.', 'erro')
      return
    }

    janela.document.write(`
      <html>
        <head>
          <title>Relatório da reserva</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 28px; color: #111827; }
            .topo { display:flex; justify-content:space-between; gap:20px; align-items:flex-start; border-bottom:3px solid #1d4ed8; padding-bottom:16px; margin-bottom:18px; }
            .empresa h1 { margin:0; font-size:22px; }
            .empresa p { margin:4px 0; color:#475569; }
            .titulo { background:#eff6ff; border:1px solid #bfdbfe; padding:14px; border-radius:10px; margin-bottom:18px; }
            .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:18px; }
            .box { border:1px solid #e5e7eb; border-radius:10px; padding:10px; }
            .box span { display:block; font-size:11px; color:#64748b; text-transform:uppercase; font-weight:700; }
            .box strong { font-size:16px; }
            table { width:100%; border-collapse:collapse; margin-top:14px; }
            th { background:#1e3a8a; color:white; text-align:left; padding:9px; font-size:12px; }
            td { border-bottom:1px solid #e5e7eb; padding:9px; font-size:12px; }
            .totais { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:18px; }
            .total { border-radius:10px; padding:12px; background:#f8fafc; border:1px solid #e2e8f0; }
            .saldo { background:${saldo > 0 ? '#fef2f2' : '#f0fdf4'}; }
            @media print { button { display:none } body { margin:18px } }
          </style>
        </head>
        <body>
          <div class="topo">
            <div>${logoHtml}</div>
            <div class="empresa">
              <h1>${empresaFantasia || empresaConfig?.nome_fantasia || 'Hotel'}</h1>
              <p>${empresaNome || empresaConfig?.nome_empresa || ''}</p>
              <p>${empresaCnpj ? 'CNPJ: ' + empresaCnpj : ''} ${empresaTelefone ? ' | Tel: ' + empresaTelefone : ''}</p>
              <p>${empresaEndereco || ''} ${empresaCidade ? ' - ' + empresaCidade : ''} ${empresaEstado ? '/' + empresaEstado : ''}</p>
            </div>
          </div>

          <div class="titulo">
            <h2 style="margin:0">Resumo da Reserva</h2>
            <p style="margin:6px 0 0">Reserva de ${reserva.nome_hospede || 'Hóspede'} - Quarto ${reserva.quartos?.numero || '-'}</p>
          </div>

          <div class="grid">
            <div class="box"><span>Entrada</span><strong>${dataBrasil(reserva.data_entrada)}</strong></div>
            <div class="box"><span>Saída</span><strong>${dataBrasil(reserva.data_saida)}</strong></div>
            <div class="box"><span>Noites</span><strong>${calcularNoitesReserva(reserva)}</strong></div>
            <div class="box"><span>Canal</span><strong>${reserva.canal_venda || 'Direto'}</strong></div>
            <div class="box"><span>Hóspede</span><strong>${reserva.nome_hospede || '-'}</strong></div>
            <div class="box"><span>Telefone</span><strong>${reserva.telefone || '-'}</strong></div>
            <div class="box"><span>Quarto</span><strong>${reserva.quartos?.numero || '-'}</strong></div>
            <div class="box"><span>Status</span><strong>${reserva.status || 'reservada'}</strong></div>
          </div>

          <table>
            <thead><tr><th>Tipo</th><th>Data</th><th>Descrição</th><th>Qtd.</th><th>Valor</th></tr></thead>
            <tbody>
              ${linhas.map((linha) => `<tr><td>${linha.tipo === 'pagamento' ? 'Pagamento' : 'Despesa'}</td><td>${formatarDataCurta(linha.data)}</td><td>${linha.produto}</td><td>${linha.quantidade}</td><td>${formatarMoeda(linha.valor)}</td></tr>`).join('')}
            </tbody>
          </table>

          <div class="totais">
            <div class="total"><span>Diárias</span><h3>${formatarMoeda(totalDiarias)}</h3></div>
            <div class="total"><span>Consumos</span><h3>${formatarMoeda(totalConsumos)}</h3></div>
            <div class="total"><span>Recebido</span><h3>${formatarMoeda(totalRecebido)}</h3></div>
            <div class="total saldo"><span>Saldo</span><h3>${formatarMoeda(saldo)}</h3></div>
          </div>

          <p style="margin-top:22px;color:#64748b">${empresaObservacao || empresaConfig?.observacao || ''}</p>
          <button onclick="window.print()" style="margin-top:20px;padding:12px 18px;border:0;border-radius:8px;background:#1d4ed8;color:white;font-weight:700">Imprimir / Salvar relatório</button>
          <script>setTimeout(() => window.print(), 500)</script>
        </body>
      </html>
    `)
    janela.document.close()
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

  function obterDataLocalISO(data = new Date()) {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')

    return `${ano}-${mes}-${dia}`
  }

  function obterDataPagamento(pagamento) {
    return String(
      pagamento?.data_pagamento ||
      pagamento?.criado_em ||
      pagamento?.created_at ||
      ''
    ).slice(0, 10)
  }

  function dataRelativaISO(dias) {
    const data = new Date()
    data.setDate(data.getDate() + dias)
    return obterDataLocalISO(data)
  }

  function faturamentoTotal() {
    return pagamentos.reduce(
      (total, pagamento) =>
        total + Number(pagamento.valor || 0),
      0
    )
  }

  function faturamentoPorData(dataReferencia) {
    return (Array.isArray(pagamentos) ? pagamentos : [])
      .filter((pagamento) => obterDataPagamento(pagamento) === dataReferencia)
      .reduce((total, pagamento) => total + Number(pagamento.valor || 0), 0)
  }

  function percentualReceitaDia(valorHoje, valorOntem) {
    const hoje = Number(valorHoje || 0)
    const ontem = Number(valorOntem || 0)

    if (hoje <= 0 && ontem <= 0) return 0
    if (hoje > 0 && ontem <= 0) return 100

    return Math.round(((hoje - ontem) / ontem) * 100)
  }

  function percentualSeguro(valor, total) {
    const numeroValor = Number(valor || 0)
    const numeroTotal = Number(total || 0)

    if (numeroTotal <= 0) return 0

    const percentual = Math.round((numeroValor / numeroTotal) * 100)

    return Math.min(100, Math.max(0, percentual))
  }

  function ocupacaoPercentual() {
    return percentualSeguro(totalQuartosStatus('ocupado'), quartos.length)
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

  const proximasReservas = (Array.isArray(reservas) ? reservas : [])
    .filter((reserva) => {
      const status = String(reserva.status || '').toLowerCase()
      return !reserva.checkout && status !== 'finalizada' && status !== 'cancelada'
    })
    .sort((a, b) => String(a.data_entrada || '').localeCompare(String(b.data_entrada || '')))
    .slice(0, 5)
  const totalQuartosReal = quartos.length
  const totalQuartos = totalQuartosReal || 1
  const ocupados = totalQuartosStatus('ocupado')
  const reservados = totalQuartosStatus('reservado')
  const disponiveis = totalQuartosStatus('livre')
  const percentualOcupacao = ocupacaoPercentual()
  const percentualHospedes = percentualSeguro(
    reservas.reduce((total, reserva) => total + Number(reserva.qtd_hospedes || 0), 0),
    Math.max(totalQuartosReal * 4, 1)
  )
  const percentualReservasHoje = percentualSeguro(reservasHoje(), Math.max(reservas.length, 1))
  const percentualCheckouts = percentualSeguro(
    reservas.filter((reserva) => reserva.checkout).length,
    Math.max(reservas.length, 1)
  )
  const receitaHoje = faturamentoPorData(obterDataLocalISO())
  const receitaOntem = faturamentoPorData(dataRelativaISO(-1))
  const percentualReceitaHoje = percentualReceitaDia(receitaHoje, receitaOntem)
  const receitaSubiu = percentualReceitaHoje >= 0
  const reservaContaSelecionada = reservas.find((reserva) => String(reserva.id) === String(reservaContaId))
  const totalDiariasConta = Number(reservaContaSelecionada?.valor_total || 0)
  const totalConsumosConta = reservaContaSelecionada ? totalConsumosReserva(reservaContaSelecionada.id) : 0
  const totalPagamentosConta = reservaContaSelecionada ? totalPagamentosReserva(reservaContaSelecionada.id) : 0
  const saldoContaSelecionada = reservaContaSelecionada ? calcularSaldoReserva(reservaContaSelecionada) : 0
  const reservaCentralSelecionada = (Array.isArray(reservas) ? reservas : []).find((reserva) => String(reserva.id) === String(centralReservaId))
  const totalDiariasCentral = Number(reservaCentralSelecionada?.valor_total || 0)
  const totalConsumosCentral = reservaCentralSelecionada ? totalConsumosReserva(reservaCentralSelecionada.id) : 0
  const totalPagamentosCentral = reservaCentralSelecionada ? totalPagamentosReserva(reservaCentralSelecionada.id) : 0
  const saldoCentralSelecionada = reservaCentralSelecionada ? calcularSaldoReserva(reservaCentralSelecionada) : 0


  function calcularNoitesReserva(reserva) {
    if (!reserva?.data_entrada || !reserva?.data_saida) return 1

    const entrada = new Date(`${reserva.data_entrada}T12:00:00`)
    const saida = new Date(`${reserva.data_saida}T12:00:00`)
    const dias = Math.round((saida - entrada) / (1000 * 60 * 60 * 24))

    return Math.max(1, dias || 1)
  }

  function formatarDataCurta(dataISO) {
    if (!dataISO) return '-'
    const partes = String(dataISO).slice(0, 10).split('-')
    if (partes.length !== 3) return dataISO
    return `${partes[2]}/${partes[1]}/${partes[0].slice(2)}`
  }

  function gerarLinhasContaReserva(reserva) {
    if (!reserva) return []

    const noites = calcularNoitesReserva(reserva)
    const valorDiaria = Number(reserva.valor_total || 0) / noites
    const linhasDiarias = []

    if (reserva.data_entrada) {
      const dataBase = new Date(`${reserva.data_entrada}T12:00:00`)
      for (let indice = 0; indice < noites; indice++) {
        const dataLinha = new Date(dataBase)
        dataLinha.setDate(dataBase.getDate() + indice)
        linhasDiarias.push({
          tipo: 'despesa',
          data: obterDataLocalISO(dataLinha),
          produto: `${indice + 1} - Diária`,
          quantidade: 1,
          valor: valorDiaria
        })
      }
    } else if (Number(reserva.valor_total || 0) > 0) {
      linhasDiarias.push({
        tipo: 'despesa',
        data: '',
        produto: '1 - Diária',
        quantidade: 1,
        valor: Number(reserva.valor_total || 0)
      })
    }

    const linhasConsumo = consumos
      .filter((consumo) => consumo.reserva_id === reserva.id)
      .map((consumo, indice) => ({
        tipo: 'despesa',
        data: String(consumo.criado_em || consumo.created_at || '').slice(0, 10),
        produto: `${100 + indice} - ${consumo.descricao || 'Consumo'}`,
        quantidade: 1,
        valor: Number(consumo.valor || 0)
      }))

    const linhasPagamento = pagamentos
      .filter((pagamento) => pagamento.reserva_id === reserva.id)
      .map((pagamento, indice) => ({
        tipo: 'pagamento',
        data: obterDataPagamento(pagamento),
        produto: `${300 + indice} - ${pagamento.forma_pagamento || 'Pagamento'} recebido`,
        quantidade: 1,
        valor: -Math.abs(Number(pagamento.valor || 0))
      }))

    const linhasDespesasExtrasPDF = (Array.isArray(reserva.despesas_extras_pdf) ? reserva.despesas_extras_pdf : [])
      .map((item, indice) => ({
        tipo: 'despesa',
        data: obterDataLocalISO(),
        produto: `${200 + indice} - ${item.descricao || 'Despesa extra'}`,
        quantidade: Number(item.quantidade || 1),
        valor: Number(item.valor_total || 0)
      }))

    return [...linhasDiarias, ...linhasConsumo, ...linhasDespesasExtrasPDF, ...linhasPagamento]
  }


  function abrirCentralReserva(reserva) {
    if (!reserva) return
    setCentralReservaId(reserva.id)
    setReservaContaId(reserva.id)
    setTelaAtiva('operacao')
  }

  function abrirCentralQuarto(quarto) {
    const reserva = reservaAbertaDoQuarto(quarto.id)
    if (reserva) {
      abrirCentralReserva(reserva)
      return
    }

    setQuartoId(quarto.id)
    setTelaAtiva('operacao')
  }

  function statusOperacionalReserva(reserva) {
    if (!reserva) return 'Livre'
    if (reserva.checkout) return 'Check-out finalizado'
    if (reserva.checkin) return calcularSaldoReserva(reserva) > 0 ? 'Hospedado com saldo' : 'Hospedado pago'
    return 'Reservado aguardando check-in'
  }

  function alertasOperacionais() {
    const hoje = obterDataLocalISO()
    const lista = []

    ;(Array.isArray(reservas) ? reservas : []).forEach((reserva) => {
      const saldo = calcularSaldoReserva(reserva)

      if (!reserva.checkout && reserva.data_saida === hoje) {
        lista.push({ tipo: 'checkout', titulo: 'Check-out hoje', detalhe: `${reserva.nome_hospede || 'Hóspede'} - Quarto ${reserva.quartos?.numero || '-'}`, reserva })
      }

      if (!reserva.checkout && saldo > 0) {
        lista.push({ tipo: 'saldo', titulo: 'Saldo pendente', detalhe: `${reserva.nome_hospede || 'Hóspede'} deve ${formatarMoeda(saldo)}`, reserva })
      }

      if (!reserva.checkout && reserva.data_saida && reserva.data_saida < hoje) {
        lista.push({ tipo: 'vencida', titulo: 'Reserva vencida', detalhe: `${reserva.nome_hospede || 'Hóspede'} passou da saída prevista`, reserva })
      }
    })

    ;(Array.isArray(quartos) ? quartos : []).forEach((quarto) => {
      if (quarto.status === 'limpeza') {
        lista.push({ tipo: 'limpeza', titulo: 'Quarto em limpeza', detalhe: `Quarto ${quarto.numero || '-'} aguardando liberação`, quarto })
      }
    })

    return lista.slice(0, 12)
  }

  function tituloTela() {
    if (telaAtiva === 'dashboard') return 'Dashboard'
    if (telaAtiva === 'operacao') return 'Operação Hotel'
    if (telaAtiva === 'reservas') return 'Reservas e quartos'
    if (telaAtiva === 'restaurante') return 'Consumos por quarto'
    if (telaAtiva === 'servicos') return 'Serviços do Hóspede'
    if (telaAtiva === 'financeiro') return 'Finanças'
    if (telaAtiva === 'hospedes') return 'Hóspedes'
    if (telaAtiva === 'estoque') return 'Estoque'
    if (telaAtiva === 'relatorios') return 'Relatórios'
        if (telaAtiva === 'configuracoes') return 'Configurações'
    return 'Dashboard'
  }

  function subtituloTela() {
    if (telaAtiva === 'dashboard') return 'Visão geral do hotel'
    if (telaAtiva === 'operacao') return 'Reservas, quartos e contas em aberto'
    if (telaAtiva === 'reservas') return 'Criação de reservas, disponibilidade e mapa dos quartos'
    if (telaAtiva === 'restaurante') return 'Produtos e serviços consumidos por hóspedes ativos'
    if (telaAtiva === 'servicos') return 'Portal de serviços do hóspede'
    if (telaAtiva === 'financeiro') return 'Caixa e recebimentos'
    if (telaAtiva === 'hospedes') return 'Hóspedes e histórico'
    if (telaAtiva === 'estoque') return 'Produtos, quantidades e movimentações'
    if (telaAtiva === 'relatorios') return 'Relatórios do sistema'
        if (telaAtiva === 'configuracoes') return 'Empresa, logo e usuários'
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
          tela: 'reservas'
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
        tela: 'reservas'
      })
    }

    if (quartosOcupados.length > 0) {
      lista.push({
        titulo: `${quartosOcupados.length} quarto${quartosOcupados.length === 1 ? '' : 's'} ocupado${quartosOcupados.length === 1 ? '' : 's'}`,
        detalhe: 'Confira hóspedes e contas em aberto.',
        tela: 'reservas'
      })
    }

    if (estoqueBaixo.length > 0) {
      lista.push({
        titulo: `${estoqueBaixo.length} produto${estoqueBaixo.length === 1 ? '' : 's'} com estoque baixo`,
        detalhe: 'Verifique os itens com baixa quantidade.',
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



  function reservaAbertaDoQuarto(quartoId) {
    return (Array.isArray(reservas) ? reservas : []).find((reserva) => {
      return reserva.quarto_id === quartoId && !reserva.checkout
    })
  }

  function consumosDaReserva(reservaId) {
    return (Array.isArray(consumos) ? consumos : []).filter((consumo) => {
      return consumo.reserva_id === reservaId
    })
  }

  function consumosAtivosDaReserva(reservaId) {
    return (Array.isArray(consumos) ? consumos : []).filter((consumo) => {
      return String(consumo.reserva_id) === String(reservaId)
    })
  }

  function reservasAtivasComConsumo() {
    return (Array.isArray(reservas) ? reservas : []).filter((reserva) => {
      return !reserva.checkout && consumosAtivosDaReserva(reserva.id).length > 0
    })
  }


  function totalConsumoAbertoQuarto(quartoId) {
    const reserva = reservaAbertaDoQuarto(quartoId)

    if (!reserva) return 0

    return consumosDaReserva(reserva.id).reduce((total, consumo) => {
      return total + Number(consumo.valor || 0)
    }, 0)
  }

  function resumoConsumoAbertoQuarto(quartoId) {
    const reserva = reservaAbertaDoQuarto(quartoId)

    if (!reserva) return []

    return consumosDaReserva(reserva.id).slice(0, 3)
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
      mostrarAviso('Erro ao lançar consumo. Tente novamente.', 'erro')
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

                {totalConsumoAbertoQuarto(quarto.id) > 0 && (
                  <div className="quarto-consumo-alerta">
                    <strong>Consumo aberto:</strong>
                    <span>{formatarMoeda(totalConsumoAbertoQuarto(quarto.id))}</span>

                    <div className="quarto-consumo-lista">
                      {resumoConsumoAbertoQuarto(quarto.id).map((consumo) => (
                        <small key={consumo.id}>
                          {consumo.descricao}
                        </small>
                      ))}
                    </div>
                  </div>
                )}
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

  function renderizarQuartosOperacionalPorAndar(andar) {
    const quartosDoAndar = quartos.filter((quarto) => quarto.andar === andar)

    return (
      <div className="operacional-andar" key={`operacional-${andar}`}>
        <div className="andar-cabecalho operacional-cabecalho">
          <h2>{andar}</h2>
          <span>{quartosDoAndar.length} quarto{quartosDoAndar.length === 1 ? '' : 's'}</span>
        </div>

        <div className="operacional-grid">
          {quartosDoAndar.map((quarto) => {
            const reservaAtual = reservaAbertaDoQuarto(quarto.id)
            const saldoAtual = reservaAtual ? calcularSaldoReserva(reservaAtual) : 0
            const consumoAberto = totalConsumoAbertoQuarto(quarto.id)
            const statusAtual = quarto.status || 'livre'

            return (
              <div key={quarto.id} className={`operacional-card ${statusAtual}`}>
                <div className="operacional-card-topo">
                  <div>
                    <span className="operacional-label">Quarto</span>
                    <h3>{quarto.numero}</h3>
                  </div>

                  <span className={`status-quarto ${statusAtual}`}>{statusAtual}</span>
                </div>

                <div className="operacional-info">
                  <p><strong>Tipo:</strong> {quarto.tipo || 'A definir'}</p>
                  <p><strong>Diária:</strong> {formatarMoeda(quarto.valor_diaria)}</p>

                  {reservaAtual ? (
                    <>
                      <p><strong>Hóspede:</strong> {reservaAtual.nome_hospede || 'Hóspede'}</p>
                      <p><strong>Período:</strong> {reservaAtual.data_entrada || '-'} até {reservaAtual.data_saida || '-'}</p>
                      <p><strong>Saldo:</strong> <span className={saldoAtual > 0 ? 'saldo-alerta' : 'saldo-ok'}>{formatarMoeda(saldoAtual)}</span></p>
                      {consumoAberto > 0 && <p><strong>Consumo aberto:</strong> {formatarMoeda(consumoAberto)}</p>}
                    </>
                  ) : (
                    <p className="operacional-vazio">Sem hóspede vinculado no momento.</p>
                  )}
                </div>

                <div className="operacional-acoes">
                  {reservaAtual && !reservaAtual.checkin && !reservaAtual.checkout && (
                    <button className="acao-primaria" onClick={() => fazerCheckin(reservaAtual)}>Fazer check-in</button>
                  )}

                  {reservaAtual && reservaAtual.checkin && !reservaAtual.checkout && (
                    <button className="acao-perigo" onClick={() => fazerCheckout(reservaAtual)}>Fazer check-out</button>
                  )}

                  {!reservaAtual && (
                    <button className="acao-primaria" onClick={() => setTelaAtiva('operacao')}>Criar reserva</button>
                  )}

                  <button onClick={() => alterarStatus(quarto.id, 'livre')}>Livre</button>
                  <button onClick={() => alterarStatus(quarto.id, 'limpeza')}>Limpeza</button>
                </div>
              </div>
            )
          })}

          {quartosDoAndar.length === 0 && (
            <p className="sem-quartos">Nenhum quarto cadastrado neste andar.</p>
          )}
        </div>
      </div>
    )
  }



  return (
    <div className="hotel-layout">
      <style>{`
        .operacional-resumo {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 16px;
          margin-bottom: 18px;
        }

        .operacional-resumo-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
          border-left: 7px solid #2563eb;
        }

        .operacional-resumo-card span,
        .operacional-label {
          display: block;
          color: #64748b;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .operacional-resumo-card strong {
          display: block;
          color: #0f172a;
          font-size: 34px;
          margin: 6px 0 2px;
        }

        .operacional-resumo-card small {
          color: #64748b;
          font-weight: 700;
        }

        .operacional-resumo-card.livre { border-left-color: #16a34a; }
        .operacional-resumo-card.ocupado { border-left-color: #dc2626; }
        .operacional-resumo-card.reservado { border-left-color: #f59e0b; }
        .operacional-resumo-card.limpeza { border-left-color: #7c3aed; }

        .panel-subtitle {
          margin: 6px 0 0;
          color: #64748b;
          font-weight: 600;
        }


        .despesas-reserva-box {
          background: #f8fafc;
          border: 1px solid #dbeafe;
          border-radius: 16px;
          padding: 14px;
        }

        .despesas-reserva-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
          color: #0f172a;
        }

        .despesas-reserva-header span {
          color: #1d4ed8;
          font-weight: 900;
        }

        .despesas-reserva-form {
          display: grid;
          grid-template-columns: 1.5fr 90px 150px 180px;
          gap: 10px;
        }

        .despesas-reserva-lista {
          display: grid;
          gap: 8px;
          margin-top: 10px;
        }

        .despesa-reserva-item {
          display: grid;
          grid-template-columns: 1fr 180px 130px 100px;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 10px;
        }

        .despesa-reserva-item span,
        .despesa-reserva-item strong {
          color: #0f172a;
          font-weight: 900;
        }

        .despesa-reserva-item small {
          color: #64748b;
          font-weight: 700;
        }

        .resumo-reserva-criacao {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 14px;
          padding: 12px;
          color: #1e3a8a;
          font-weight: 800;
        }

        .resumo-reserva-criacao strong {
          color: #0f172a;
          font-size: 18px;
        }

        @media (max-width: 900px) {
          .despesas-reserva-form,
          .despesa-reserva-item {
            grid-template-columns: 1fr;
          }

          .resumo-reserva-criacao {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        .operacional-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 16px;
        }

        .operacional-card {
          background: linear-gradient(180deg, #ffffff, #f8fafc);
          border: 1px solid #e5e7eb;
          border-left: 8px solid #2563eb;
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
        }

        .operacional-card.livre { border-left-color: #16a34a; }
        .operacional-card.ocupado { border-left-color: #dc2626; }
        .operacional-card.reservado { border-left-color: #f59e0b; }
        .operacional-card.limpeza { border-left-color: #7c3aed; }

        .operacional-card-topo {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .operacional-card h3 {
          margin: 2px 0 0;
          color: #020617;
          font-size: 28px;
        }

        .operacional-info {
          background: #f1f5f9;
          border-radius: 14px;
          padding: 12px;
          min-height: 142px;
        }

        .operacional-info p {
          margin: 0 0 8px;
          color: #334155;
        }

        .operacional-vazio {
          color: #64748b !important;
          font-weight: 700;
        }

        .saldo-alerta {
          color: #dc2626;
          font-weight: 900;
        }

        .saldo-ok {
          color: #16a34a;
          font-weight: 900;
        }

        .operacional-acoes {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .operacional-acoes button {
          border: 0;
          border-radius: 10px;
          padding: 10px 12px;
          background: #e2e8f0;
          color: #0f172a;
          font-weight: 800;
          cursor: pointer;
        }

        .operacional-acoes .acao-primaria {
          background: #2563eb;
          color: #ffffff;
        }

        .operacional-acoes .acao-perigo {
          background: #dc2626;
          color: #ffffff;
        }


        .central-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(15, 23, 42, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .central-modal {
          width: min(1180px, 100%);
          max-height: 92vh;
          overflow: auto;
          background: #f8fafc;
          border-radius: 24px;
          box-shadow: 0 30px 90px rgba(2, 6, 23, 0.35);
          border: 1px solid #e2e8f0;
        }

        .central-modal-header {
          position: sticky;
          top: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 22px;
          background: linear-gradient(135deg, #0f172a, #1d4ed8);
          color: #ffffff;
        }

        .central-modal-header h2 { margin: 0; font-size: 24px; }
        .central-modal-header p { margin: 4px 0 0; color: rgba(255,255,255,0.78); }
        .central-modal-header button { border: 0; border-radius: 12px; background: rgba(255,255,255,0.16); color: #fff; padding: 10px 14px; font-weight: 900; cursor: pointer; }

        .central-modal-body {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 18px;
          padding: 18px;
        }

        .central-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
          margin-bottom: 14px;
        }

        .central-card h3 { margin: 0 0 12px; color: #0f172a; }
        .central-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; }
        .central-info { padding: 12px; border-radius: 14px; background: #f1f5f9; }
        .central-info span { display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 900; }
        .central-info strong { display: block; margin-top: 4px; color: #0f172a; }

        .central-resumo-lateral {
          position: sticky;
          top: 88px;
          align-self: start;
        }

        .central-total-box {
          border-radius: 22px;
          padding: 20px;
          color: #ffffff;
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          box-shadow: 0 18px 40px rgba(37, 99, 235, 0.28);
        }

        .central-total-box span { display: block; color: rgba(255,255,255,0.78); font-weight: 800; }
        .central-total-box strong { display: block; font-size: 32px; margin: 6px 0 14px; }
        .central-total-row { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.18); padding-top: 10px; margin-top: 10px; }

        .central-acoes-rapidas { display: grid; gap: 10px; margin-top: 14px; }
        .central-acoes-rapidas button { border: 0; border-radius: 14px; padding: 12px; font-weight: 900; cursor: pointer; background: #e2e8f0; color: #0f172a; }
        .central-acoes-rapidas .primary { background: #16a34a; color: #fff; }
        .central-acoes-rapidas .danger { background: #dc2626; color: #fff; }
        .central-acoes-rapidas .blue { background: #2563eb; color: #fff; }

        .operacao-alertas-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px; margin-bottom: 18px; }
        .operacao-alerta { border: 0; text-align: left; background: #ffffff; border-left: 7px solid #f59e0b; border-radius: 16px; padding: 14px; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06); cursor: pointer; }
        .operacao-alerta.saldo { border-left-color: #dc2626; }
        .operacao-alerta.checkout { border-left-color: #2563eb; }
        .operacao-alerta.vencida { border-left-color: #7f1d1d; }
        .operacao-alerta.limpeza { border-left-color: #7c3aed; }
        .operacao-alerta strong { display: block; color: #0f172a; margin-bottom: 4px; }
        .operacao-alerta span { color: #64748b; font-weight: 700; }

        .operacao-quarto-card { cursor: pointer; }
        .operacao-quarto-card:hover { transform: translateY(-2px); box-shadow: 0 18px 42px rgba(15, 23, 42, 0.12); }

        .central-mini-form { display: grid; grid-template-columns: 1fr 150px auto; gap: 10px; margin-top: 10px; }
        .central-mini-form input, .central-mini-form select { width: 100%; min-height: 40px; border: 1px solid #cbd5e1; border-radius: 12px; padding: 0 10px; }
        .central-mini-form button { border: 0; border-radius: 12px; background: #2563eb; color: #fff; font-weight: 900; padding: 0 14px; cursor: pointer; }

        @media (max-width: 980px) {
          .central-modal-body { grid-template-columns: 1fr; }
          .central-resumo-lateral { position: static; }
          .central-mini-form { grid-template-columns: 1fr; }
        }

        .toast-cronos {
          position: fixed;
          top: 22px;
          right: 24px;
          z-index: 9999;
          min-width: 320px;
          max-width: 430px;
          padding: 16px 18px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: toastEntrada 0.22s ease-out;
        }

        .toast-cronos.sucesso { border-left: 7px solid #16a34a; }
        .toast-cronos.erro { border-left: 7px solid #dc2626; }
        .toast-cronos.info { border-left: 7px solid #2563eb; }

        .toast-icone {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #ffffff;
          background: #2563eb;
          flex: 0 0 auto;
        }

        .toast-cronos.sucesso .toast-icone { background: #16a34a; }
        .toast-cronos.erro .toast-icone { background: #dc2626; }

        .toast-conteudo strong {
          display: block;
          font-size: 15px;
          margin-bottom: 3px;
          color: #0f172a;
        }

        .toast-conteudo span {
          display: block;
          font-size: 14px;
          color: #475569;
          line-height: 1.35;
        }

        @keyframes toastEntrada {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .financeiro-facil-grid {
          display: grid;
          grid-template-columns: minmax(280px, 0.9fr) minmax(360px, 1.6fr);
          gap: 18px;
          align-items: stretch;
        }

        .financeiro-card {
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          padding: 18px;
          background: #f8fafc;
        }

        .financeiro-card h3 { margin: 0 0 4px; }
        .financeiro-card p { margin: 0 0 14px; color: #64748b; }

        .financeiro-conta-resumo {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #ffffff;
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 18px 40px rgba(37, 99, 235, 0.22);
        }

        .financeiro-conta-resumo .muted { color: rgba(255,255,255,0.78); }
        .financeiro-conta-resumo h3 { margin: 6px 0 12px; font-size: 24px; }

        .financeiro-resumo-linhas {
          display: grid;
          gap: 10px;
          margin-top: 16px;
        }

        .financeiro-resumo-linhas div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255,255,255,0.12);
        }

        .saldo-grande {
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .financeiro-acoes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .financeiro-form-simples {
          display: grid;
          gap: 10px;
        }

        .financeiro-form-simples button,
        .financeiro-form-simples select,
        .financeiro-form-simples input {
          width: 100%;
        }

        .financeiro-dica {
          margin-top: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 700;
          font-size: 13px;
        }

        @media (max-width: 980px) {
          .financeiro-facil-grid,
          .financeiro-acoes {
            grid-template-columns: 1fr;
          }
        }



        .fasthotel-window {
          background: #f3f0df;
          border: 1px solid #9ca3af;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.16);
          margin-bottom: 18px;
          font-size: 14px;
        }

        .fasthotel-titlebar {
          height: 44px;
          background: linear-gradient(180deg, #eef2ff 0%, #dbe4f0 100%);
          border-bottom: 1px solid #9ca3af;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          color: #111827;
          font-size: 18px;
        }

        .fasthotel-window-actions {
          display: flex;
          gap: 5px;
        }

        .fasthotel-window-actions button {
          width: 25px;
          height: 25px;
          border-radius: 4px;
          border: 1px solid #6b7280;
          background: #584a3f;
          color: #ffffff;
          font-weight: 800;
          cursor: pointer;
        }

        .fasthotel-toolbar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 10px 14px;
          border-bottom: 1px solid #c7c7b4;
          color: #111827;
          flex-wrap: wrap;
        }

        .fasthotel-toolbar label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #111827;
        }

        .fasthotel-toolbar input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #65518f;
        }

        .fasthotel-link {
          margin-right: auto;
          background: transparent;
          border: 0;
          color: #334155;
          text-decoration: underline;
          font-weight: 700;
          cursor: pointer;
        }

        .fasthotel-reserva-select {
          display: grid;
          grid-template-columns: 140px 1fr;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #f6f2dc;
          border-bottom: 1px solid #c7c7b4;
        }

        .fasthotel-reserva-select span {
          font-weight: 800;
          color: #111827;
        }

        .fasthotel-reserva-select select,
        .fasthotel-mini-form input,
        .fasthotel-mini-form select {
          border: 1px solid #9ca3af;
          border-radius: 3px;
          min-height: 36px;
          padding: 0 10px;
          background: #ffffff;
          color: #111827;
        }

        .fasthotel-account-box {
          margin: 12px 14px 18px;
          border: 1px solid #79808a;
          background: #fffdee;
        }

        .fasthotel-account-header {
          background: #b5b2bd;
          border-bottom: 1px solid #7f7b88;
          padding: 10px 14px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .fasthotel-account-header h2 {
          margin: 0 0 8px;
          font-size: 22px;
          color: #3f3a46;
        }

        .fasthotel-account-header h2 span {
          font-weight: 500;
        }

        .fasthotel-meta {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #1f2937;
        }

        .checkedin-pill {
          background: #3b39e6;
          color: #ffffff;
          padding: 6px 18px;
          border-radius: 999px;
          font-weight: 800;
          white-space: nowrap;
        }

        .fasthotel-table-wrap {
          padding: 10px 10px 0;
          overflow-x: auto;
        }

        .fasthotel-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
          font-size: 13px;
        }

        .fasthotel-table th {
          background: #65518f;
          color: #ffffff;
          text-align: left;
          padding: 7px 8px;
          border-right: 1px solid rgba(255,255,255,0.18);
        }

        .fasthotel-table td {
          padding: 7px 8px;
          border: 1px solid #c9c4a9;
          background: #f9f5dc;
          color: #111827;
        }

        .fasthotel-table tr:nth-child(even) td {
          background: #ebe7cd;
        }

        .fasthotel-table .payment-line td {
          background: #dbeafe;
        }

        .fasthotel-table tfoot td {
          background: #65518f !important;
          color: #ffffff;
          font-weight: 900;
        }

        .delete-line {
          color: #b91c1c !important;
          font-weight: 900;
          text-align: center;
        }

        .fasthotel-summary-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          padding: 10px;
          color: #111827;
        }

        .fasthotel-summary-row strong {
          margin-right: 8px;
        }

        .dark-action,
        .light-action,
        .fasthotel-mini-form button {
          min-height: 36px;
          border-radius: 3px;
          padding: 0 18px;
          border: 1px solid #6b7280;
          font-weight: 800;
          cursor: pointer;
        }

        .dark-action {
          background: #243c5a;
          color: #ffffff;
        }

        .light-action {
          background: #e5e7eb;
          color: #111827;
        }

        .fasthotel-empty {
          margin: 14px;
          padding: 34px;
          background: #fffdee;
          border: 1px dashed #9ca3af;
          color: #374151;
          text-align: center;
          font-weight: 700;
        }

        .fasthotel-dual-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 18px;
          margin-bottom: 18px;
        }

        .fasthotel-operation-panel h2 {
          margin-bottom: 5px;
        }

        .fasthotel-mini-form {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 10px;
          margin-top: 16px;
        }

        .fasthotel-mini-form button {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }

        .fasthotel-mini-form button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }


        .linha-clicavel { cursor: pointer; }
        .linha-clicavel:hover { background: #f1f7ff; }
        .painel-alertas-dashboard { margin-bottom: 18px; }
        .alerta-operacional.ok { border-color: #bbf7d0; background: #f0fdf4; color: #166534; }
        .operacao-modo-limpo { border-left: 5px solid #2563eb; margin-bottom: 18px; }
        .operacao-quarto-card { cursor: pointer; }
        .operacao-quarto-card:hover { transform: translateY(-2px); box-shadow: 0 14px 35px rgba(15,23,42,.10); }

        .operacao-form-reserva {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .operacao-form-reserva input,
        .operacao-form-reserva select {
          width: 100%;
          border: 1px solid #dbe3ef;
          border-radius: 12px;
          padding: 13px 14px;
          background: #fff;
          font-weight: 700;
          color: #0f172a;
        }

        .operacao-form-reserva .form-wide { grid-column: span 2; }
        .operacao-form-reserva button {
          border: 0;
          border-radius: 12px;
          background: #2563eb;
          color: #fff;
          font-weight: 900;
          padding: 13px 16px;
          cursor: pointer;
        }


        .operacao-conta-fixa {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(280px, .7fr);
          gap: 16px;
          align-items: start;
          margin-bottom: 18px;
        }

        @media (max-width: 980px) {
          .operacao-conta-fixa { grid-template-columns: 1fr; }
          .operacao-form-reserva .form-wide { grid-column: span 1; }
        }

        @media (max-width: 820px) {
          .fasthotel-reserva-select,
          .fasthotel-mini-form {
            grid-template-columns: 1fr;
          }
        }


        .sidebar-logo-img { width: 46px; height: 46px; object-fit: contain; border-radius: 10px; background: #fff; }
        .logo-config-box { display:flex; gap:16px; align-items:center; padding:14px; border:1px dashed #93c5fd; border-radius:16px; background:#eff6ff; margin-bottom:16px; }
        .logo-preview { width:92px; height:72px; border-radius:14px; background:#fff; border:1px solid #dbeafe; display:flex; align-items:center; justify-content:center; overflow:hidden; color:#1d4ed8; font-weight:900; }
        .logo-preview img { width:100%; height:100%; object-fit:contain; }
        .logo-actions { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
        .logo-upload-label { cursor:pointer; background:#2563eb; color:white; padding:11px 14px; border-radius:12px; font-weight:900; }
        .logo-upload-label input { display:none; }
        .map-busy, .map-free { display:inline-flex; align-items:center; justify-content:center; min-width:76px; padding:10px 12px; border-radius:12px; font-weight:900; box-shadow:0 6px 14px rgba(15,23,42,.10); border:1px solid transparent; }
        .map-busy { background:#dc2626 !important; color:white !important; border-color:#991b1b; }
        .map-free { background:#16a34a !important; color:white !important; border-color:#166534; }
        .clean-table tbody tr:hover { background:#f8fafc; }
        .reservation-actions-extra { display:flex; gap:8px; flex-wrap:wrap; margin-top:10px; }

        .operacao-form-reserva {
          grid-template-columns: repeat(5, minmax(0, 1fr));
          align-items: start;
        }

        .operacao-form-reserva .form-wide,
        .operacao-form-reserva .despesas-reserva-box,
        .operacao-form-reserva .resumo-reserva-criacao {
          grid-column: 1 / -1;
        }

        .despesas-reserva-box {
          padding: 16px;
          overflow: hidden;
        }

        .despesas-reserva-header {
          margin-bottom: 14px;
        }

        .despesas-reserva-form {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) 90px 160px 190px;
          gap: 12px;
          align-items: stretch;
        }

        .despesas-reserva-form button {
          width: 100%;
          min-height: 46px;
          white-space: nowrap;
        }

        .despesas-reserva-lista {
          margin-top: 12px;
        }

        .despesa-reserva-item {
          grid-template-columns: minmax(180px, 1fr) 180px 140px 110px;
        }

        .resumo-reserva-criacao {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: center;
          gap: 12px;
          margin-top: 0;
          min-height: auto;
        }

        .resumo-reserva-criacao span,
        .resumo-reserva-criacao strong {
          display: block;
          background: #ffffff;
          border: 1px solid #dbeafe;
          border-radius: 12px;
          padding: 12px 14px;
          line-height: 1.25;
        }

        .btn-criar-reserva-pdf {
          grid-column: 1 / -1;
          justify-self: end;
          width: min(320px, 100%);
          min-height: 48px;
          margin-top: 0;
        }

        @media (max-width: 1100px) {
          .operacao-form-reserva {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .despesas-reserva-form,
          .resumo-reserva-criacao {
            grid-template-columns: 1fr 1fr;
          }
          .despesas-reserva-form button,
          .resumo-reserva-criacao strong {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 720px) {
          .operacao-form-reserva,
          .despesas-reserva-form,
          .resumo-reserva-criacao,
          .despesa-reserva-item {
            grid-template-columns: 1fr;
          }
          .btn-criar-reserva-pdf {
            justify-self: stretch;
            width: 100%;
          }
        }
        .reservation-actions-extra button { border:0; border-radius:10px; padding:10px 12px; background:#1d4ed8; color:#fff; font-weight:800; cursor:pointer; }
        .hotel-menu button { min-height: 52px; }

        /* CORREÇÃO FINAL DO FORMULÁRIO DE RESERVA - NÃO REMOVER */
        .operacao-form-reserva {
          display: grid !important;
          grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          gap: 12px !important;
          align-items: stretch !important;
        }

        .operacao-form-reserva > input,
        .operacao-form-reserva > select {
          width: 100% !important;
          min-width: 0 !important;
          height: 44px !important;
        }

        .operacao-form-reserva .despesas-reserva-box {
          grid-column: span 3 !important;
          min-height: 150px !important;
          padding: 14px !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: visible !important;
        }

        .despesas-reserva-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          gap: 12px !important;
          margin-bottom: 12px !important;
        }

        .despesas-reserva-form {
          display: grid !important;
          grid-template-columns: minmax(220px, 1fr) 80px 145px 170px !important;
          gap: 10px !important;
          align-items: stretch !important;
        }

        .despesas-reserva-form input,
        .despesas-reserva-form button {
          width: 100% !important;
          height: 44px !important;
          min-width: 0 !important;
        }

        .resumo-reserva-criacao {
          grid-column: span 1 !important;
          min-height: 150px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          gap: 8px !important;
          padding: 14px !important;
          overflow: visible !important;
        }

        .resumo-reserva-criacao span,
        .resumo-reserva-criacao strong {
          width: 100% !important;
          display: block !important;
          padding: 10px 12px !important;
          border-radius: 10px !important;
          line-height: 1.25 !important;
          font-size: 13px !important;
          word-break: normal !important;
          white-space: normal !important;
        }

        .resumo-reserva-criacao strong {
          font-size: 15px !important;
        }

        .operacao-form-reserva .btn-criar-reserva-pdf,
        .operacao-form-reserva > .primary-button {
          grid-column: span 1 !important;
          width: 100% !important;
          min-height: 150px !important;
          height: 100% !important;
          align-self: stretch !important;
          margin: 0 !important;
          border-radius: 14px !important;
          white-space: normal !important;
        }

        @media (max-width: 1250px) {
          .operacao-form-reserva { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .operacao-form-reserva .despesas-reserva-box,
          .resumo-reserva-criacao,
          .operacao-form-reserva .btn-criar-reserva-pdf,
          .operacao-form-reserva > .primary-button { grid-column: 1 / -1 !important; min-height: auto !important; }
          .despesas-reserva-form { grid-template-columns: 1fr 90px 150px 180px !important; }
        }

        @media (max-width: 720px) {
          .operacao-form-reserva,
          .despesas-reserva-form { grid-template-columns: 1fr !important; }
        }


      `}
</style>
      <aside className="hotel-sidebar">
        <div className="hotel-brand">
          <div className="hotel-logo-icon">{empresaLogo ? <img src={empresaLogo} alt="Logo do hotel" className="sidebar-logo-img" /> : icons.hotel}</div>
          <div>
            <h1>{empresaConfig?.nome_fantasia || 'CRONOS'}</h1>
            <p>{empresaConfig?.nome_empresa || 'Sistema Hotel'}</p>
          </div>
        </div>

        <nav className="hotel-menu professional-menu">
          <div className="menu-section-label">Visão geral</div>
          <button className={menuClasse('dashboard')} onClick={() => setTelaAtiva('dashboard')}>
            <span className="menu-icon">{icons.dashboard}</span> Dashboard
          </button>

          <div className="menu-section-label">Operação</div>
          <button className={menuClasse('reservas')} onClick={() => setTelaAtiva('reservas')}>
            <span className="menu-icon">{icons.reservas}</span> Reservas
          </button>

          <button className={menuClasse('restaurante')} onClick={() => setTelaAtiva('restaurante')}>
            <span className="menu-icon">{icons.servicos}</span> Recepção / Restaurante
          </button>

          <button className={menuClasse('servicos')} onClick={() => setTelaAtiva('servicos')}>
            <span className="menu-icon">{icons.servicos}</span> Serviços do Hóspede
          </button>

          <div className="menu-section-label">Gestão</div>
          <button className={menuClasse('financeiro')} onClick={() => setTelaAtiva('financeiro')}>
            <span className="menu-icon">{icons.financeiro}</span> Finanças
          </button>

          <button className={menuClasse('estoque')} onClick={() => setTelaAtiva('estoque')}>
            <span className="menu-icon">{icons.quartos}</span> Estoque
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

        {reservaCentralSelecionada && (
          <div className="central-modal-overlay">
            <div className="central-modal">
              <div className="central-modal-header">
                <div>
                  <h2>Central da Reserva - Quarto {reservaCentralSelecionada.quartos?.numero || '-'}</h2>
                  <p>{reservaCentralSelecionada.nome_hospede || 'Hóspede'} • {statusOperacionalReserva(reservaCentralSelecionada)}</p>
                </div>
                <button onClick={() => setCentralReservaId('')}>Fechar ×</button>
              </div>

              <div className="central-modal-body">
                <div>
                  <div className="central-card">
                    <h3>Dados da reserva</h3>
                    <div className="central-grid">
                      <div className="central-info"><span>Entrada</span><strong>{reservaCentralSelecionada.data_entrada || '-'}</strong></div>
                      <div className="central-info"><span>Saída</span><strong>{reservaCentralSelecionada.data_saida || '-'}</strong></div>
                      <div className="central-info"><span>Noites</span><strong>{calcularNoitesReserva(reservaCentralSelecionada)}</strong></div>
                      <div className="central-info"><span>Canal</span><strong>{reservaCentralSelecionada.canal_venda || 'Direto'}</strong></div>
                      <div className="central-info"><span>Telefone</span><strong>{reservaCentralSelecionada.telefone || '-'}</strong></div>
                      <div className="central-info"><span>Status</span><strong>{statusOperacionalReserva(reservaCentralSelecionada)}</strong></div>
                    </div>
                  </div>

                  <div className="central-card">
                    <h3>Hóspedes</h3>
                    <div className="central-grid">
                      <div className="central-info"><span>Titular</span><strong>{reservaCentralSelecionada.nome_hospede || 'Hóspede'}</strong></div>
                      <div className="central-info"><span>Quantidade</span><strong>{reservaCentralSelecionada.qtd_hospedes || 1}</strong></div>
                      <div className="central-info"><span>Tipo</span><strong>{reservaCentralSelecionada.tipo_hospede || 'homem'}</strong></div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      {Array.from({ length: Math.max(0, Number(reservaCentralSelecionada.qtd_hospedes || 1) - 1) }).map((_, index) => (
                        <div className="central-info" key={`acompanhante-${index}`} style={{ marginTop: 8 }}>
                          <span>Acompanhante {index + 1}</span>
                          <strong>Acompanhante não identificado</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="central-card">
                    <h3>Conta da reserva integrada</h3>
                    <div className="fasthotel-table-wrap">
                      <table className="fasthotel-table">
                        <thead>
                          <tr>
                            <th>Tipo</th>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Qtd.</th>
                            <th>Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gerarLinhasContaReserva(reservaCentralSelecionada).map((linha, indice) => (
                            <tr key={`central-linha-${indice}`} className={linha.tipo === 'pagamento' ? 'payment-line' : ''}>
                              <td>{linha.tipo === 'pagamento' ? 'Pagamento' : 'Despesa'}</td>
                              <td>{formatarDataCurta(linha.data)}</td>
                              <td>{linha.produto}</td>
                              <td>{linha.quantidade}</td>
                              <td>{formatarMoeda(linha.valor)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="central-mini-form">
                      <input placeholder="Produto/serviço/consumo" value={descricaoConsumo} onChange={(e) => setDescricaoConsumo(e.target.value)} />
                      <input placeholder="Valor" type="number" value={valorConsumo} onChange={(e) => setValorConsumo(e.target.value)} />
                      <button onClick={() => { setReservaContaId(reservaCentralSelecionada.id); setTimeout(() => lancarConsumo(), 0) }}>Adicionar</button>
                    </div>

                    <div className="central-mini-form">
                      <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                        <option>Dinheiro</option>
                        <option>PIX</option>
                        <option>Cartão de crédito</option>
                        <option>Cartão de débito</option>
                        <option>Transferência</option>
                      </select>
                      <input placeholder="Valor recebido" type="number" value={valorPagamento} onChange={(e) => setValorPagamento(e.target.value)} />
                      <button onClick={() => { setReservaContaId(reservaCentralSelecionada.id); setTimeout(() => registrarPagamento(), 0) }}>Receber</button>
                    </div>
                  </div>

                  <div className="central-card">
                    <h3>Observações</h3>
                    <p>{reservaCentralSelecionada.observacao || reservaCentralSelecionada.observacoes || 'Nenhuma observação cadastrada.'}</p>
                  </div>
                </div>

                <aside className="central-resumo-lateral">
                  <div className="central-total-box">
                    <span>Saldo da reserva</span>
                    <strong>{formatarMoeda(saldoCentralSelecionada)}</strong>
                    <div className="central-total-row"><b>Diárias</b><b>{formatarMoeda(totalDiariasCentral)}</b></div>
                    <div className="central-total-row"><b>Consumos</b><b>{formatarMoeda(totalConsumosCentral)}</b></div>
                    <div className="central-total-row"><b>Recebido</b><b>{formatarMoeda(totalPagamentosCentral)}</b></div>
                  </div>

                  <div className="central-card">
                    <h3>Fluxo operacional</h3>
                    <div className="central-grid">
                      <div className="central-info"><span>1</span><strong>Reservado</strong></div>
                      <div className="central-info"><span>2</span><strong>Check-in</strong></div>
                      <div className="central-info"><span>3</span><strong>Hospedado</strong></div>
                      <div className="central-info"><span>4</span><strong>Pagamento</strong></div>
                      <div className="central-info"><span>5</span><strong>Check-out</strong></div>
                      <div className="central-info"><span>6</span><strong>Limpeza/Livre</strong></div>
                    </div>
                  </div>

                  <div className="central-acoes-rapidas">
                    {!reservaCentralSelecionada.checkin && !reservaCentralSelecionada.checkout && (
                      <button className="primary" onClick={() => fazerCheckin(reservaCentralSelecionada)}>Fazer check-in</button>
                    )}
                    {reservaCentralSelecionada.checkin && !reservaCentralSelecionada.checkout && (
                      <button className="danger" onClick={() => fazerCheckout(reservaCentralSelecionada)}>Fazer check-out</button>
                    )}
                    <button className="blue" onClick={() => { setReservaContaId(reservaCentralSelecionada.id); setTelaAtiva('financeiro'); setCentralReservaId('') }}>Abrir no financeiro</button>
                    <button onClick={() => gerarRelatorioReservaPDF(reservaCentralSelecionada)}>Gerar resumo da reserva</button>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        )}


        {telaAtiva === 'operacao' && (
          <>
            <section className="white-panel">
              <div className="panel-header">
                <div>
                  <h2>Nova reserva</h2>
                </div>
              </div>

              <div className="operacao-form-reserva">
                <select value={quartoId} onChange={(e) => setQuartoId(e.target.value)}>
                  <option value="">Selecione o quarto</option>
                  {quartos.map((quarto) => (
                    <option key={quarto.id} value={quarto.id}>
                      Quarto {quarto.numero} - {quarto.tipo || 'A definir'} - {formatarMoeda(quarto.valor_diaria)}
                    </option>
                  ))}
                </select>

                <input placeholder="Nome do hóspede titular" value={nomeHospede} onChange={(e) => setNomeHospede(e.target.value)} />
                <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                <input type="date" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
                <input type="date" value={saida} onChange={(e) => setSaida(e.target.value)} />
                <input type="number" min="1" placeholder="Qtd. hóspedes" value={qtdHospedes} onChange={(e) => setQtdHospedes(e.target.value)} />
                <input
                  placeholder="Valor da diária"
                  value={valorReservaManual}
                  onChange={(e) => setValorReservaManual(e.target.value)}
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
                  <option>Airbnb</option>
                  <option>Agência</option>
                </select>

                <input className="form-wide" placeholder="Observação da reserva" value={observacao} onChange={(e) => setObservacao(e.target.value)} />

                <div className="form-wide despesas-reserva-box">
                  <div className="despesas-reserva-header">
                    <strong>Outras despesas da reserva</strong>
                    <span>Total extra: {formatarMoeda(totalDespesasReservaTemporarias())}</span>
                  </div>

                  <div className="despesas-reserva-form">
                    <input placeholder="Descrição. Ex: Café, passeio, taxa" value={despesaReservaDescricao} onChange={(e) => setDespesaReservaDescricao(e.target.value)} />
                    <input type="number" min="1" placeholder="Qtd." value={despesaReservaQuantidade} onChange={(e) => setDespesaReservaQuantidade(e.target.value)} />
                    <input placeholder="Valor unitário" value={despesaReservaValor} onChange={(e) => setDespesaReservaValor(e.target.value)} />
                    <button type="button" onClick={adicionarDespesaReserva}>Adicionar despesa</button>
                  </div>

                  {despesasReserva.length > 0 && (
                    <div className="despesas-reserva-lista">
                      {despesasReserva.map((item) => (
                        <div key={item.id} className="despesa-reserva-item">
                          <span>{item.descricao}</span>
                          <small>Qtd. {item.quantidade} × {formatarMoeda(item.valor_unitario)}</small>
                          <strong>{formatarMoeda(item.valor_total)}</strong>
                          <button type="button" onClick={() => removerDespesaReserva(item.id)}>Remover</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-wide resumo-reserva-criacao">
                  <span>Diária: {formatarMoeda(valorDiariaReservaDigitado())}</span>
                  <span>Outras despesas: {formatarMoeda(totalDespesasReservaTemporarias())}</span>
                  <strong>Total da reserva: {formatarMoeda(totalReservaTemporariarelatório())}</strong>
                </div>

                <button className="btn-criar-reserva-pdf" onClick={criarReserva}>Finalizar reserva</button>
              </div>

            </section>

            <section className="operacional-resumo">
              <div className="operacional-resumo-card livre"><span>Livres</span><strong>{disponiveis}</strong><small>Prontos para vender</small></div>
              <div className="operacional-resumo-card reservado"><span>Reservados</span><strong>{reservados}</strong><small>Aguardando check-in</small></div>
              <div className="operacional-resumo-card ocupado"><span>Ocupados</span><strong>{ocupados}</strong><small>Com hóspede ativo</small></div>
              <div className="operacional-resumo-card limpeza"><span>Limpeza</span><strong>{totalQuartosStatus('limpeza')}</strong><small>Aguardando liberação</small></div>
            </section>

            <div className="white-panel">
              <div className="panel-header">
                <div>
                  <h2>Alertas da operação</h2>
                </div>
                <button onClick={() => setTelaAtiva('operacao')}>Nova reserva</button>
              </div>

              <div className="operacao-alertas-grid">
                {alertasOperacionais().length === 0 && (
                  <div className="operacao-alerta"><strong>Nenhum alerta agora</strong><span>Operação sem pendências críticas.</span></div>
                )}
                {alertasOperacionais().map((alerta, index) => (
                  <button
                    type="button"
                    key={`alerta-operacional-${index}`}
                    className={`operacao-alerta ${alerta.tipo}`}
                    onClick={() => alerta.reserva ? abrirCentralReserva(alerta.reserva) : alerta.quarto ? abrirCentralQuarto(alerta.quarto) : null}
                  >
                    <strong>{alerta.titulo}</strong>
                    <span>{alerta.detalhe}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="white-panel operacional-painel">
              <div className="panel-header">
                <div>
                  <h2>Painel operacional dos quartos</h2>
                  <p className="panel-subtitle">Clique em um quarto ocupado/reservado para abrir a Central da Reserva com conta, saldo, consumo e pagamento.</p>
                </div>
              </div>

              <div className="quartos-andares operacional-andares">
                {['Térreo', 'Andar 01', 'Andar 02', 'Andar 03', 'Andar 04'].map((andar) => {
                  const quartosDoAndar = quartos.filter((quarto) => quarto.andar === andar)
                  return (
                    <div className="operacional-andar" key={`operacao-${andar}`}>
                      <div className="andar-cabecalho operacional-cabecalho"><h2>{andar}</h2><span>{quartosDoAndar.length} quarto{quartosDoAndar.length === 1 ? '' : 's'}</span></div>
                      <div className="operacional-grid">
                        {quartosDoAndar.map((quarto) => {
                          const reservaAtual = reservaAbertaDoQuarto(quarto.id)
                          const saldoAtual = reservaAtual ? calcularSaldoReserva(reservaAtual) : 0
                          const statusAtual = quarto.status || 'livre'
                          return (
                            <div key={quarto.id} className={`operacional-card operacao-quarto-card ${statusAtual}`} onClick={() => abrirCentralQuarto(quarto)}>
                              <div className="operacional-card-topo">
                                <div><span className="operacional-label">Quarto</span><h3>{quarto.numero}</h3></div>
                                <span className={`status-quarto ${statusAtual}`}>{statusAtual}</span>
                              </div>
                              <div className="operacional-info">
                                <p><strong>Tipo:</strong> {quarto.tipo || 'A definir'}</p>
                                <p><strong>Diária:</strong> {formatarMoeda(quarto.valor_diaria)}</p>
                                {reservaAtual ? (
                                  <>
                                    <p><strong>Hóspede:</strong> {reservaAtual.nome_hospede || 'Hóspede'}</p>
                                    <p><strong>Saída:</strong> {reservaAtual.data_saida || '-'}</p>
                                    <p><strong>Status:</strong> {statusOperacionalReserva(reservaAtual)}</p>
                                    <p><strong>Saldo:</strong> <span className={saldoAtual > 0 ? 'saldo-alerta' : 'saldo-ok'}>{formatarMoeda(saldoAtual)}</span></p>
                                  </>
                                ) : (
                                  <p className="operacional-vazio">Livre para nova reserva. Clique para pré-selecionar este quarto.</p>
                                )}
                              </div>
                              <div className="operacional-acoes" onClick={(e) => e.stopPropagation()}>
                                {reservaAtual ? (
                                  <button className="acao-primaria" onClick={() => abrirCentralReserva(reservaAtual)}>Abrir Central</button>
                                ) : (
                                  <button className="acao-primaria" onClick={() => { setQuartoId(quarto.id); setTelaAtiva('operacao') }}>Nova reserva</button>
                                )}
                                <button onClick={() => alterarStatus(quarto.id, 'limpeza')}>Limpeza</button>
                                <button onClick={() => alterarStatus(quarto.id, 'livre')}>Livre</button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {telaAtiva === 'dashboard' && (
          <>
            <section className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">▤</div>
                <div className="stat-info">
                  <span>Quartos ocupados</span>
                  <strong>{ocupados}</strong>
                  <small>de {totalQuartosReal} quartos</small>
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
                    <div style={{ width: `${percentualHospedes}%` }} />
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
                    <div style={{ width: `${percentualReservasHoje}%` }} />
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
                    <div style={{ width: `${percentualCheckouts}%` }} />
                  </div>
                </div>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="white-panel reservations-panel">
                <div className="panel-header">
                  <h3>Reservas dos próximos 7 dias</h3>
                  <button onClick={() => setTelaAtiva('operacao')}>Abrir operação</button>
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
                      <tr key={reserva.id} className="linha-clicavel" onClick={() => abrirCentralReserva(reserva)}>
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
                    <p><b className="dot gray-dot" /> Reservados {reservados}</p>
                    <p><b className="dot gray-dot" /> Disponíveis {disponiveis}</p>
                  </div>
                </div>
              </div>

              <div className="white-panel actions-panel">
                <h3>Ações rápidas</h3>

                <div className="quick-actions">
                  <button onClick={() => setTelaAtiva('operacao')}>
                    <span className="qa blue">+</span>
                    Nova reserva
                  </button>

                  <button onClick={() => setTelaAtiva('operacao')}>
                    <span className="qa green">↪</span>
                    Operação
                  </button>

                  <button onClick={() => setTelaAtiva('operacao')}>
                    <span className="qa orange">↩</span>
                    Saídas hoje
                  </button>

                  <button onClick={() => setTelaAtiva('operacao')}>
                    <span className="qa purple">♙</span>
                    Novo hóspede
                  </button>

                  <button onClick={() => setTelaAtiva('financeiro')}>
                    <span className="qa blue">◒</span>
                    Caixa
                  </button>
                </div>
              </div>

              <div className="white-panel revenue-panel">
                <h3>Receita do dia</h3>

                <div className="revenue-value">
                  {formatarMoeda(receitaHoje)}
                  <small className={receitaSubiu ? 'positive' : 'negative'}>
                    {receitaSubiu ? '↑' : '↓'} {Math.abs(percentualReceitaHoje)}%
                  </small>
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

                <div className="form-grid operacao-form-reserva">
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
                    placeholder="Valor da diária"
                    value={valorReservaManual}
                    onChange={(e) => setValorReservaManual(e.target.value)}
                  />

                  <input
                    placeholder="Observação"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />

                  <div className="form-wide despesas-reserva-box">
                    <div className="despesas-reserva-header">
                      <strong>Outras despesas da reserva</strong>
                      <span>Total extra: {formatarMoeda(totalDespesasReservaTemporarias())}</span>
                    </div>

                    <div className="despesas-reserva-form">
                      <input
                        placeholder="Descrição. Ex: Café, passeio, taxa"
                        value={despesaReservaDescricao}
                        onChange={(e) => setDespesaReservaDescricao(e.target.value)}
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qtd."
                        value={despesaReservaQuantidade}
                        onChange={(e) => setDespesaReservaQuantidade(e.target.value)}
                      />
                      <input
                        placeholder="Valor unitário"
                        value={despesaReservaValor}
                        onChange={(e) => setDespesaReservaValor(e.target.value)}
                      />
                      <button type="button" onClick={adicionarDespesaReserva}>
                        Adicionar despesa
                      </button>
                    </div>

                    {despesasReserva.length > 0 && (
                      <div className="despesas-reserva-lista">
                        {despesasReserva.map((item) => (
                          <div key={item.id} className="despesa-reserva-item">
                            <span>{item.descricao}</span>
                            <small>Qtd. {item.quantidade} × {formatarMoeda(item.valor_unitario)}</small>
                            <strong>{formatarMoeda(item.valor_total)}</strong>
                            <button type="button" onClick={() => removerDespesaReserva(item.id)}>
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-wide resumo-reserva-criacao">
                    <span>
                      Diária: {formatarMoeda(valorDiariaReservaDigitado())}
                    </span>
                    <span>
                      Outras despesas: {formatarMoeda(totalDespesasReservaTemporarias())}
                    </span>
                    <strong>
                      Total da reserva: {formatarMoeda(totalReservaTemporariarelatório())}
                    </strong>
                  </div>

                  <button className="primary-button btn-criar-reserva-pdf" onClick={criarReserva}>
                    Finalizar reserva
                  </button>
                </div>
              </div>
            )}

            <div className="reservas-status-grid">
              <div className="reserva-status-card livre"><span>Livres</span><strong>{disponiveis}</strong></div>
              <div className="reserva-status-card ocupado"><span>Ocupados</span><strong>{ocupados}</strong></div>
              <div className="reserva-status-card reservado"><span>Reservados</span><strong>{reservados}</strong></div>
              <div className="reserva-status-card limpeza"><span>Limpeza</span><strong>{totalQuartosStatus('limpeza')}</strong></div>
            </div>

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
                  const saldoReserva = calcularSaldoReserva(reserva)

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
                        <button onClick={() => abrirCentralReserva(reserva)}>Abrir Central da Reserva</button>
                        <button onClick={() => gerarRelatorioReservaPDF(reserva)}>Gerar resumo da reserva</button>

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


        {telaAtiva === 'financeiro' && podeAcessarFinanceiro() && (
          <>
            <div className="fasthotel-window">
              <div className="fasthotel-titlebar">
                <strong>Conta da reserva {reservaContaSelecionada ? `#${String(reservaContaSelecionada.id).slice(0, 8)}` : ''}</strong>
                <div className="fasthotel-window-actions">
                  <button title="Bloquear">🔒</button>
                  <button title="Ajuda">?</button>
                  <button title="Fechar">×</button>
                </div>
              </div>

              <div className="fasthotel-toolbar">
                <button className="fasthotel-link" onClick={() => setTelaAtiva('operacao')}>Ir para reserva</button>
                <label><input type="checkbox" /> Agrupar por produto</label>
                <label><input type="checkbox" /> Ordenar por data</label>
                <label><input type="checkbox" defaultChecked /> Ocultar estornados, transferidos ou zerados</label>
              </div>

              <div className="fasthotel-reserva-select">
                <span>Reserva / quarto</span>
                <select
                  value={reservaContaId}
                  onChange={(e) => setReservaContaId(e.target.value)}
                >
                  <option value="">Selecione a reserva</option>
                  {reservas
                    .filter((reserva) => !reserva.checkout)
                    .map((reserva) => (
                      <option key={reserva.id} value={reserva.id}>
                        Quarto {reserva.quartos?.numero || '-'} - {reserva.nome_hospede || 'Hóspede'} - {formatarMoeda(calcularSaldoReserva(reserva))}
                      </option>
                    ))}
                </select>
              </div>

              {reservaContaSelecionada ? (
                <div className="fasthotel-account-box">
                  <div className="fasthotel-account-header">
                    <div>
                      <h2>⌄ Quarto {reservaContaSelecionada.quartos?.numero || '-'} <span>👤 {reservaContaSelecionada.nome_hospede || 'Hóspede'}</span></h2>
                      <div className="fasthotel-meta">
                        <b>Data:</b> {formatarDataCurta(reservaContaSelecionada.data_entrada)} 12:00:00 - {formatarDataCurta(reservaContaSelecionada.data_saida)} 11:59:00 ({calcularNoitesReserva(reservaContaSelecionada)} diárias)
                        <b> Hóspedes:</b> {reservaContaSelecionada.qtd_hospedes || 1} / 0
                        <b> Tipo de quarto contratado:</b> {reservaContaSelecionada.quartos?.tipo || 'A definir'}
                        <b> Tipo de tarifa:</b> Tarifa Padrão
                      </div>
                    </div>
                    <span className="checkedin-pill">{reservaContaSelecionada.checkin ? 'Checked-in' : 'Reservado'}</span>
                  </div>

                  <div className="fasthotel-table-wrap">
                    <table className="fasthotel-table">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Item</th>
                          <th>Data</th>
                          <th>Produto</th>
                          <th>Qtd.</th>
                          <th>Preço Total (R$)</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {gerarLinhasContaReserva(reservaContaSelecionada).map((linha, indice) => (
                          <tr key={`${linha.produto}-${indice}`} className={linha.tipo === 'pagamento' ? 'payment-line' : ''}>
                            <td><input type="checkbox" /></td>
                            <td>{indice + 1}</td>
                            <td>{formatarDataCurta(linha.data)}</td>
                            <td>{linha.produto}</td>
                            <td>{linha.quantidade}</td>
                            <td>{formatarMoeda(linha.valor).replace('R$', '').trim()}</td>
                            <td className="delete-line">×</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="5">Total</td>
                          <td>{formatarMoeda(saldoContaSelecionada).replace('R$', '').trim()}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="fasthotel-summary-row">
                    <strong>Despesas: {formatarMoeda(totalDiariasConta + totalConsumosConta)}</strong>
                    <strong>Recebido: {formatarMoeda(totalPagamentosConta)}</strong>
                    <strong>Saldo: {formatarMoeda(saldoContaSelecionada)}</strong>
                    <button className="dark-action">＋ Adicionar item</button>
                    <button className="light-action">▣ Receber</button>
                    <button className="light-action">⇄ Transferir</button>
                    <button className="light-action" onClick={() => window.print()}>🖨 Imprimir</button>
                  </div>
                </div>
              ) : (
                <div className="fasthotel-empty">Selecione uma reserva para visualizar a conta igual ao modelo FastHotel.</div>
              )}
            </div>

            <div className="fasthotel-dual-grid">
              <div className="white-panel fasthotel-operation-panel">
                <h2>Receber pagamento</h2>
                <p className="panel-subtitle">Selecione a conta acima, informe o valor e a forma de pagamento.</p>
                <div className="fasthotel-mini-form">
                  <input
                    placeholder="Valor do pagamento"
                    type="number"
                    value={valorPagamento}
                    onChange={(e) => setValorPagamento(e.target.value)}
                  />
                  <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                    <option>Dinheiro</option>
                    <option>PIX</option>
                    <option>Cartão de crédito</option>
                    <option>Cartão de débito</option>
                    <option>Transferência</option>
                  </select>
                  <button onClick={registrarPagamento} disabled={!reservaContaId}>Receber</button>
                </div>
              </div>

              <div className="white-panel fasthotel-operation-panel">
                <h2>Adicionar item</h2>
                <p className="panel-subtitle">Lance itens extras diretamente na conta.</p>
                <div className="fasthotel-mini-form">
                  <input placeholder="Produto / descrição" value={descricaoConsumo} onChange={(e) => setDescricaoConsumo(e.target.value)} />
                  <input placeholder="Valor" type="number" value={valorConsumo} onChange={(e) => setValorConsumo(e.target.value)} />
                  <button onClick={lancarConsumo} disabled={!reservaContaId}>Adicionar item</button>
                </div>
              </div>
            </div>

            {podeAcessarCaixa() && (
              <div className="white-panel">
                <div className="panel-header">
                  <h2>Caixa</h2>
                  <strong>Saldo: {formatarMoeda(saldoCaixa())}</strong>
                </div>

                <div className="form-grid">
                  <select value={caixaTipo} onChange={(e) => setCaixaTipo(e.target.value)}>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                  <input placeholder="Descrição" value={caixaDescricao} onChange={(e) => setCaixaDescricao(e.target.value)} />
                  <input placeholder="Valor" type="number" value={caixaValor} onChange={(e) => setCaixaValor(e.target.value)} />
                  <select value={caixaFormaPagamento} onChange={(e) => setCaixaFormaPagamento(e.target.value)}>
                    <option>Dinheiro</option>
                    <option>PIX</option>
                    <option>Cartão de crédito</option>
                    <option>Cartão de débito</option>
                    <option>Transferência</option>
                  </select>
                  <button onClick={lancarCaixa}>Lançar caixa</button>
                </div>

                <table className="clean-table tabela-caixa">
                  <thead><tr><th>Tipo</th><th>Descrição</th><th>Valor</th><th>Forma</th></tr></thead>
                  <tbody>
                    {caixa.length === 0 && <tr><td colSpan="4">Nenhum lançamento no caixa</td></tr>}
                    {caixa.slice(0, 8).map((item) => (
                      <tr key={item.id}>
                        <td><span className={item.tipo === 'entrada' ? 'status confirmed' : 'status pending'}>{item.tipo}</span></td>
                        <td>{item.descricao}</td>
                        <td>{formatarMoeda(item.valor)}</td>
                        <td>{item.forma_pagamento || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {telaAtiva === 'restaurante' && (
          <div className="recepcao-restaurante-page">
            <div className="white-panel">
              <div className="panel-header">
                <h2>Lançar consumo manual</h2>
                <button onClick={() => setTelaAtiva('estoque')}>Cadastrar produtos</button>
              </div>

              <div className="form-grid consumo-manual-form">
                <select value={consumoReservaId} onChange={(e) => setConsumoReservaId(e.target.value)}>
                  <option value="">Selecione a reserva/quarto</option>
                  {(Array.isArray(reservas) ? reservas : [])
                    .filter((reserva) => !reserva.checkout)
                    .map((reserva) => (
                      <option key={reserva.id} value={reserva.id}>
                        {reserva.quartos?.numero || '-'} - {reserva.nome_hospede || 'Hóspede'}
                      </option>
                    ))}
                </select>

                <select value={consumoProdutoId} onChange={(e) => setConsumoProdutoId(e.target.value)}>
                  <option value="">Produto/serviço</option>
                  {(Array.isArray(produtos) ? produtos : [])
                    .filter((produto) => produto.ativo !== false)
                    .map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} - {formatarMoeda(produto.valor_venda || 0)}
                      </option>
                    ))}
                </select>

                <input type="number" placeholder="Quantidade" value={consumoQuantidade} onChange={(e) => setConsumoQuantidade(e.target.value)} />
                <input placeholder="Descrição/observação" value={consumoObservacao} onChange={(e) => setConsumoObservacao(e.target.value)} />
                <button onClick={lancarConsumoQuarto}>Lançar consumo</button>
              </div>
            </div>

            <div className="white-panel">
              <div className="panel-header">
                <h2>Quartos com consumo</h2>
              </div>

              <div className="consumo-quartos-grid">
                {reservasAtivasComConsumo().length === 0 && (
                  <div className="empty-state">Nenhum quarto com consumo em aberto.</div>
                )}

                {reservasAtivasComConsumo().map((reserva) => {
                  const itens = consumosAtivosDaReserva(reserva.id)
                  const totalItens = itens.reduce((total, consumo) => total + Number(consumo.valor || 0), 0)

                  return (
                    <div key={reserva.id} className="consumo-quarto-card">
                      <div className="consumo-quarto-topo">
                        <div><span>Quarto</span><strong>{reserva.quartos?.numero || '-'}</strong></div>
                        <div><span>Hóspede</span><strong>{reserva.nome_hospede || 'Hóspede'}</strong></div>
                        <div><span>Total</span><strong>{formatarMoeda(totalItens)}</strong></div>
                      </div>

                      <table className="clean-table consumo-itens-table">
                        <thead><tr><th>Descrição</th><th>Data</th><th>Valor</th></tr></thead>
                        <tbody>
                          {itens.map((consumo) => (
                            <tr key={consumo.id}>
                              <td>{consumo.descricao || 'Consumo'}</td>
                              <td>{formatarDataCurta(String(consumo.criado_em || consumo.created_at || '').slice(0, 10))}</td>
                              <td>{formatarMoeda(consumo.valor || 0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}


        {telaAtiva === 'servicos' && (
          <div className="servicos-hospede-page">
            <section className="white-panel servicos-hospede-hero">
              <div>
                <h2>Serviços para o hóspede</h2>
                <p>Cardápio e serviços para envio pelo WhatsApp.</p>
              </div>
            </section>

            <section className="white-panel">
              <div className="panel-header">
                <div>
                  <h2>Enviar link de serviços</h2>
                  
                </div>
              </div>

              <div className="form-grid servicos-hospede-form">
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

                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    const reservaSelecionada = (Array.isArray(reservas) ? reservas : []).find((reserva) => String(reserva.id) === String(consumoReservaId))

                    if (!reservaSelecionada) {
                      mostrarAviso('Selecione uma reserva ativa para enviar o link.', 'erro')
                      return
                    }

                    if (!reservaSelecionada.telefone) {
                      mostrarAviso('A reserva selecionada não tem telefone salvo.', 'erro')
                      return
                    }

                    const linkServicos = `${window.location.origin}/servicos-hospede?reserva=${reservaSelecionada.id}`
                    const mensagem = [
                      `Olá, ${reservaSelecionada.nome_hospede || 'hóspede'}!`,
                      '',
                      `Segue o link de serviços do ${empresaFantasia || empresaConfig?.nome_fantasia || 'hotel'}:`,
                      linkServicos,
                      '',
                      'Por ele você pode escolher cardápio, bebidas, frigobar e outros serviços.'
                    ].join('\n')

                    window.open(`https://wa.me/${telefoneWhatsApp(reservaSelecionada.telefone)}?text=${encodeURIComponent(mensagem)}`, '_blank')
                  }}
                >
                  Enviar link pelo WhatsApp
                </button>
              </div>
            </section>

            <section className="white-panel">
              <div className="panel-header">
                <div>
                  <h2>Cardápio e serviços disponíveis</h2>
                  <p className="panel-subtitle">Produtos ativos que aparecem como opções para o hóspede.</p>
                </div>
                <button onClick={() => setTelaAtiva('estoque')}>Cadastrar produtos</button>
              </div>

              <div className="servicos-cardapio-grid">
                {(Array.isArray(produtos) ? produtos : [])
                  .filter((produto) => produto.ativo !== false)
                  .slice(0, 18)
                  .map((produto) => (
                    <div className="servico-cardapio-card" key={produto.id}>
                      <strong>{produto.nome}</strong>
                      <span>{produto.local_uso || produto.tipo || 'Serviço'}</span>
                      <b>{formatarMoeda(produto.valor_venda || 0)}</b>
                    </div>
                  ))}

                {(Array.isArray(produtos) ? produtos : []).filter((produto) => produto.ativo !== false).length === 0 && (
                  <p className="config-info">Nenhum produto ou serviço ativo cadastrado ainda.</p>
                )}
              </div>
            </section>
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
                <h2>Cadastro de Produtos</h2>
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
                  placeholder="Nome do produto"
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
                  <option>Recepção / Restaurante</option>
                  <option>Bar</option>
                  <option>Limpeza</option>
                </select>

                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    checked={produtoFrigobar}
                    onChange={(e) => setProdutoFrigobar(e.target.checked)}
                  />
                  Controlar estoque desse item
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
                <h2>Produtos cadastrados</h2>
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
                    <small>Itens e serviços consumidos</small>
                  </div>
                </div>

                <div className="stat-card purple">
                  <div className="stat-info">
                    <span>Saldo estimado</span>
                    <strong>{formatarMoeda(reservasPorPeriodo().reduce((total, reserva) => total + calcularSaldoReserva(reserva), 0))}</strong>
                    <small>Somente contas abertas</small>
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
                      <tr key={reserva.id} className="linha-clicavel" onClick={() => abrirCentralReserva(reserva)}>
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

              <div className="logo-config-box">
                <div className="logo-preview">
                  {empresaLogo ? <img src={empresaLogo} alt="Logo do hotel" /> : 'LOGO'}
                </div>
                <div>
                  <strong>Logo do hotel para o sistema e relatórios</strong>
                  <p>Envie uma imagem PNG/JPG para aparecer no sistema e no topo dos relatórios.</p>
                  <div className="logo-actions">
                    <label className="logo-upload-label">
                      Escolher logo
                      <input type="file" accept="image/*" onChange={(e) => carregarLogoHotel(e.target.files?.[0])} />
                    </label>
                    {empresaLogo && <button type="button" onClick={removerLogoHotel}>Remover logo</button>}
                  </div>
                </div>
              </div>

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

            {usuarioLogado?.perfil === 'Administrador' && (
              <div className="white-panel">
                <div className="panel-header"><h2>Usuários do Sistema</h2></div>

                <div className="form-grid">
                  <input placeholder="Nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
                  <input placeholder="Telefone" value={novoTelefone} onChange={(e) => setNovoTelefone(e.target.value)} />
                  <input placeholder="Login" value={novoLogin} onChange={(e) => setNovoLogin(e.target.value)} />
                  <input placeholder="Senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                  <select value={novoPerfil} onChange={(e) => setNovoPerfil(e.target.value)}>
                    <option>Administrador</option><option>Recepção</option><option>Financeiro</option><option>Limpeza</option>
                  </select>
                  <button onClick={criarUsuario}>Criar usuário</button>
                </div>

                <div className="user-list">
                  {usuarios.map((usuario) => (
                    <div key={usuario.id} className="user-card">
                      <strong>{usuario.nome}</strong>
                      <p>Login: {usuario.login}</p><p>Perfil: {usuario.perfil}</p><p>Telefone: {usuario.telefone || 'Não informado'}</p><p>Status: {usuario.ativo ? 'Ativo' : 'Inativo'}</p>
                      <div className="button-row"><button onClick={() => setEditandoUsuario(usuario)}>Editar</button><button onClick={() => alterarStatusUsuario(usuario)}>{usuario.ativo ? 'Desativar' : 'Ativar'}</button></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {editandoUsuario && usuarioLogado?.perfil === 'Administrador' && (
              <div className="white-panel">
                <h2>Editar Usuário</h2>
                <div className="form-grid">
                  <input placeholder="Nome" value={editandoUsuario.nome} onChange={(e) => setEditandoUsuario({ ...editandoUsuario, nome: e.target.value })} />
                  <input placeholder="Telefone" value={editandoUsuario.telefone || ''} onChange={(e) => setEditandoUsuario({ ...editandoUsuario, telefone: e.target.value })} />
                  <input placeholder="Login" value={editandoUsuario.login} onChange={(e) => setEditandoUsuario({ ...editandoUsuario, login: e.target.value })} />
                  <input placeholder="Senha" value={editandoUsuario.senha} onChange={(e) => setEditandoUsuario({ ...editandoUsuario, senha: e.target.value })} />
                  <select value={editandoUsuario.perfil} onChange={(e) => setEditandoUsuario({ ...editandoUsuario, perfil: e.target.value })}>
                    <option>Administrador</option><option>Recepção</option><option>Financeiro</option><option>Limpeza</option>
                  </select>
                </div>
                <div className="button-row"><button onClick={salvarEdicaoUsuario}>Salvar alterações</button><button onClick={() => setEditandoUsuario(null)}>Cancelar</button></div>
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
