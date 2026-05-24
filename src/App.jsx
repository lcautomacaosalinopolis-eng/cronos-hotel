import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [quartos, setQuartos] = useState([])
  const [reservas, setReservas] = useState([])
  const [consumos, setConsumos] = useState([])
  const [pagamentos, setPagamentos] = useState([])
  const [categoriasProdutos, setCategoriasProdutos] = useState([])
  const [produtos, setProdutos] = useState([])
  const [movimentacoesEstoque, setMovimentacoesEstoque] = useState([])
  const [caixa, setCaixa] = useState([])
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
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
              <div className="brand-building">▥</div>
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
          <div className="hotel-logo-icon">▥</div>
          <div>
            <h1>CRONOS</h1>
            <p>Sistema Hotel</p>
          </div>
        </div>

        <nav className="hotel-menu">
          <button className={menuClasse('dashboard')} onClick={() => setTelaAtiva('dashboard')}>
            <span>▦</span> Dashboard
          </button>

          <button className={menuClasse('reservas')} onClick={() => setTelaAtiva('reservas')}>
            <span>▣</span> Reservas
          </button>

          <button className={menuClasse('hospedes')} onClick={() => setTelaAtiva('hospedes')}>
            <span>♙</span> Hóspedes
          </button>

          <button className={menuClasse('recepcao')} onClick={() => setTelaAtiva('recepcao')}>
            <span>▣</span> Check-in / Check-out
          </button>

          <button className={menuClasse('quartos')} onClick={() => setTelaAtiva('quartos')}>
            <span>▤</span> Quartos
          </button>

          <button className={menuClasse('restaurante')} onClick={() => setTelaAtiva('restaurante')}>
            <span>◉</span> Serviços
          </button>

          <button className={menuClasse('financeiro')} onClick={() => setTelaAtiva('financeiro')}>
            <span>$</span> Financeiro
          </button>

          <button className={menuClasse('relatorios')} onClick={() => setTelaAtiva('relatorios')}>
            <span>▥</span> Relatórios
          </button>

          <button className={menuClasse('configuracoes')} onClick={() => setTelaAtiva('configuracoes')}>
            <span>⚙</span> Configurações
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
            <div className="search-field">
              <input placeholder="Buscar..." />
              <span>⌕</span>
            </div>

            <button className="bell-button">
              ♢
              <small>3</small>
            </button>

            <div className="date-picker">
              {new Date().toLocaleDateString('pt-BR')}
              <span>⌄</span>
            </div>
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
                            <div className="guest-avatar">
                              {reserva.nome_hospede?.slice(0, 1)}
                            </div>
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
          <>
            {podeFazerReserva() && (
              <div className="white-panel">
                <h2>Criar Reserva</h2>

                <div className="form-grid">
                  <select value={quartoId} onChange={(e) => setQuartoId(e.target.value)}>
                    <option value="">Selecione o quarto</option>
                    {quartos.map((q) => (
                      <option key={q.id} value={q.id}>
                        Quarto {q.numero} - {q.andar || 'Sem andar'} - {q.tipo} - R$ {q.valor_diaria} - {q.status}
                      </option>
                    ))}
                  </select>

                  <input placeholder="Nome do hóspede" value={nomeHospede} onChange={(e) => setNomeHospede(e.target.value)} />
                  <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                  <input type="date" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
                  <input type="date" value={saida} onChange={(e) => setSaida(e.target.value)} />
                  <input type="number" placeholder="Qtd hóspedes" value={qtdHospedes} onChange={(e) => setQtdHospedes(e.target.value)} />

                  <select value={canalVenda} onChange={(e) => setCanalVenda(e.target.value)}>
                    <option>Direto</option>
                    <option>WhatsApp</option>
                    <option>Booking</option>
                    <option>Recepção</option>
                    <option>Telefone</option>
                  </select>

                  <input placeholder="Observação" value={observacao} onChange={(e) => setObservacao(e.target.value)} />
                </div>

                <button className="primary-button" onClick={criarReserva}>
                  Criar reserva
                </button>
              </div>
            )}

            <div className="white-panel">
              <h2>Mapa de Reservas</h2>

              <div className="table-scroll">
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Quarto</th>
                      {datasMapa.map((data) => (
                        <th key={data}>{data}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {quartos.map((quarto) => (
                      <tr key={quarto.id}>
                        <td><strong>{quarto.numero}</strong></td>

                        {datasMapa.map((data) => {
                          const reserva = reservas.find((r) => {
                            return (
                              r.quarto_id === quarto.id &&
                              data >= r.data_entrada &&
                              data <= r.data_saida
                            )
                          })

                          return (
                            <td key={data}>
                              <span className={reserva ? 'map-busy' : 'map-free'}>
                                {reserva ? reserva.nome_hospede : 'Livre'}
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
              <h2>Reservas</h2>

              <div className="reservation-cards">
                {reservas.map((reserva) => (
                  <div key={reserva.id} className="reservation-card">
                    <h3>{reserva.nome_hospede}</h3>
                    <p>Quarto: {reserva.quartos?.numero} - {reserva.quartos?.tipo}</p>
                    <p>Entrada: {reserva.data_entrada}</p>
                    <p>Saída: {reserva.data_saida}</p>
                    <p>Hóspedes: {reserva.qtd_hospedes}</p>
                    <p>Canal: {reserva.canal_venda}</p>
                    <p>Diárias: {formatarMoeda(reserva.valor_total)}</p>
                    <p>Consumos: {formatarMoeda(totalConsumosReserva(reserva.id))}</p>
                    <p>Pago: {formatarMoeda(totalPagamentosReserva(reserva.id))}</p>
                    <p>
                      Saldo: {formatarMoeda(
                        Number(reserva.valor_total || 0) +
                        totalConsumosReserva(reserva.id) -
                        totalPagamentosReserva(reserva.id)
                      )}
                    </p>
                    <p>Status: <strong>{reserva.status}</strong></p>

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
                ))}
              </div>
            </div>
          </>
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
              <h2>Serviços</h2>
              <button onClick={() => setTelaAtiva('financeiro')}>Lançar na conta</button>
            </div>

            <div className="module-grid">
              <div className="module-card">
                <h3>Restaurante e Bar</h3>
                <p>Lançamento de alimentos e bebidas na conta da reserva.</p>
              </div>

              <div className="module-card">
                <h3>Serviços extras</h3>
                <p>Lavanderia, estacionamento, passeios e outros adicionais.</p>
              </div>

              <div className="module-card">
                <h3>Consumos registrados</h3>
                <strong>{consumos.length}</strong>
                <p>Total de itens lançados nas contas.</p>
              </div>
            </div>

            <table className="clean-table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Reserva</th>
                </tr>
              </thead>

              <tbody>
                {consumos.length === 0 && (
                  <tr>
                    <td colSpan="3">Nenhum consumo lançado</td>
                  </tr>
                )}

                {consumos.map((consumo) => (
                  <tr key={consumo.id}>
                    <td>{consumo.descricao}</td>
                    <td>{formatarMoeda(consumo.valor)}</td>
                    <td>{consumo.reserva_id}</td>
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
                        <div className="guest-avatar">
                          {reserva.nome_hospede?.slice(0, 1)}
                        </div>
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
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {produtos.length === 0 && (
                    <tr>
                      <td colSpan="6">Nenhum produto cadastrado</td>
                    </tr>
                  )}

                  {produtos.map((produto) => (
                    <tr key={produto.id}>
                      <td>{produto.nome}</td>
                      <td>{produto.categorias_produtos?.nome || '-'}</td>
                      <td>{produto.tipo}</td>
                      <td>{formatarMoeda(produto.valor_venda)}</td>
                      <td>{produto.estoque_atual}</td>
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
            <section className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-info">
                  <span>Receita total</span>
                  <strong>{formatarMoeda(faturamentoTotal())}</strong>
                  <small>Pagamentos registrados</small>
                </div>
              </div>

              <div className="stat-card green">
                <div className="stat-info">
                  <span>Reservas</span>
                  <strong>{reservas.length}</strong>
                  <small>Total de reservas</small>
                </div>
              </div>

              <div className="stat-card orange">
                <div className="stat-info">
                  <span>Consumos</span>
                  <strong>{formatarMoeda(consumos.reduce((total, consumo) => total + Number(consumo.valor || 0), 0))}</strong>
                  <small>Total em consumos</small>
                </div>
              </div>

              <div className="stat-card purple">
                <div className="stat-info">
                  <span>Ocupação</span>
                  <strong>{ocupacaoPercentual()}%</strong>
                  <small>Ocupação atual</small>
                </div>
              </div>
            </section>

            <div className="white-panel print-report-panel">
              <div className="panel-header">
                <h2>Relatórios</h2>
                <button onClick={() => window.print()}>Imprimir</button>
              </div>

              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Relatório</th>
                    <th>Descrição</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Reservas</td>
                    <td>Lista de reservas, períodos, quartos e status.</td>
                    <td><span className="status confirmed">Disponível</span></td>
                  </tr>
                  <tr>
                    <td>Financeiro</td>
                    <td>Pagamentos, consumos, diárias e saldos.</td>
                    <td><span className="status confirmed">Disponível</span></td>
                  </tr>
                  <tr>
                    <td>Ocupação</td>
                    <td>Percentual de ocupação por período.</td>
                    <td><span className="status pending">Em evolução</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {telaAtiva === 'configuracoes' && (
          <div className="white-panel">
            <h2>Configurações</h2>

            <div className="module-grid">
              <div className="module-card">
                <h3>Empresa</h3>
                <p>Dados do hotel, nome fantasia, CNPJ e endereço.</p>
              </div>

              <div className="module-card">
                <h3>Usuários</h3>
                <p>Gerenciamento de usuários e permissões.</p>
                <button onClick={() => setTelaAtiva('usuarios')}>Abrir usuários</button>
              </div>

              <div className="module-card">
                <h3>Financeiro</h3>
                <p>Formas de pagamento, caixa e regras de cobrança.</p>
              </div>

              <div className="module-card">
                <h3>Sistema</h3>
                <p>Parâmetros gerais, auditoria, backup e segurança.</p>
              </div>
            </div>
          </div>
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
