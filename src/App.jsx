
import { useMemo, useState } from 'react'
import './App.css'
import hotelBrisasLogo from './assets/hotel-brisas-logo.jpeg'

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const todayISO = () => new Date().toISOString().slice(0, 10)
const addDays = (date, days) => {
  const d = new Date(date + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
const diffDays = (a, b) => Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000))

const dateSlotBase = (date) => Math.floor(new Date(date + 'T00:00:00').getTime() / 86400000) * 2
const dateToSlot = (date, half = 0) => dateSlotBase(date) + Number(half || 0)
const slotToDate = (slot) => new Date(Math.floor(Number(slot) / 2) * 86400000).toISOString().slice(0, 10)
const slotLabel = (slot) => `${slotToDate(slot)} ${Number(slot) % 2 === 0 ? '00h-12h' : '12h-24h'}`
const reservationStartSlot = (r) => Number.isFinite(Number(r.entradaSlot)) ? Number(r.entradaSlot) : dateToSlot(r.entrada, 0)
const reservationEndSlot = (r) => Number.isFinite(Number(r.saidaSlot)) ? Number(r.saidaSlot) : dateToSlot(r.saida, 0)
const blockStartSlot = (b) => dateToSlot(b.inicio, 0)
const blockEndSlot = (b) => dateToSlot(b.fim, 0)
const diffHalfDays = (r) => Math.max(1, reservationEndSlot(r) - reservationStartSlot(r)) / 2
const moneyNumber = (v) => Number(String(v || 0).replace(/\./g, '').replace(',', '.')) || 0
const id = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())
const reservationCode = () => String(Math.floor(33000 + Math.random() * 9000))

function useLocalState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })
  const save = (value) => {
    setState((current) => {
      const nextValue = typeof value === 'function' ? value(current) : value
      localStorage.setItem(key, JSON.stringify(nextValue))
      return nextValue
    })
  }
  return [state, save]
}

const roomTypesSeed = [
  { id: 'casal', nome: 'Casal', capacidade: 2, diaria: 200 },
  { id: 'triplo', nome: 'Triplo', capacidade: 3, diaria: 300 },
  { id: 'quadruplo', nome: 'Quádruplo', capacidade: 4, diaria: 420 },
  { id: 'quintuplo', nome: 'Quíntuplo', capacidade: 5, diaria: 500 },
  { id: 'sextuplo', nome: 'Sêxtuplo', capacidade: 6, diaria: 560 },
  { id: 'septuplo', nome: 'Séptuplo', capacidade: 7, diaria: 600 },
  { id: 'octuplo', nome: 'Óctuplo', capacidade: 8, diaria: 620 },
  { id: 'casal-varanda', nome: 'Casal com Varanda', capacidade: 2, diaria: 280 },
  { id: 'triplo-varanda', nome: 'Triplo com Varanda', capacidade: 3, diaria: 380 },
  { id: 'quadruplo-varanda', nome: 'Quádruplo com Varanda', capacidade: 4, diaria: 480 },
  { id: 'quintuplo-varanda', nome: 'Quíntuplo com Varanda', capacidade: 5, diaria: 580 },
  { id: 'sextuplo-varanda', nome: 'Sêxtuplo com Varanda', capacidade: 6, diaria: 660 },
  { id: 'octuplo-varanda', nome: 'Óctuplo com Varanda', capacidade: 8, diaria: 720 },
]

const roomMapSeed = {
  casal: ['119', '240'],
  triplo: ['115', '116', '117', '118', '234', '235', '237', '238', '239', '359', '360', '361', '362', '363', '364', '365'],
  quadruplo: ['106', '109', '110', '233', '353', '355', '358'],
  quintuplo: ['230', '232', '344'],
  sextuplo: ['229'],
  septuplo: ['228', '356'],
  octuplo: ['231'],
  'casal-varanda': ['241', '242', '243', '244', '366', '367', '368', '369'],
  'triplo-varanda': ['225', '350', '351'],
  'quadruplo-varanda': ['222', '223', '352'],
  'quintuplo-varanda': ['226', '227', '347', '348'],
  'sextuplo-varanda': ['220', '221', '224', '349'],
  'octuplo-varanda': ['346'],
}

const roomsSeed = roomTypesSeed.flatMap((type, typeIndex) =>
  (roomMapSeed[type.id] || []).map((numero, roomIndex) => ({
    id: numero,
    numero,
    tipoId: type.id,
    tipo: type.nome,
    andar: Number(numero) < 200 ? 'Térreo' : Number(numero) < 300 ? '1º andar' : '2º andar',
    statusLimpeza: (typeIndex + roomIndex) % 9 === 0 ? 'verificar' : 'limpo',
  }))
)

const clientsSeed = []

const reservationsSeed = []

const paymentsSeed = []

const consumosSeed = []
const guestsSeed = []

const paymentMethodsSeed = [
  { id: 'pm1', nome: 'Dinheiro', tipo: 'normal', ativo: true },
  { id: 'pm2', nome: 'PIX', tipo: 'normal', ativo: true },
  { id: 'pm3', nome: 'Cartão de débito', tipo: 'cartao', ativo: true },
  { id: 'pm4', nome: 'Cartão de crédito', tipo: 'cartao', ativo: true },
  { id: 'pm5', nome: 'Crédito do cliente', tipo: 'credito', ativo: true },
]


const MOVEMENT_STORAGE_KEYS = [
  'fh_clients_v2',
  'fh_reservations_v2',
  'fh_payments_v2',
  'fh_consumos_v1',
  'fh_blocks_v2',
  'fh_rates_v2',
  'fh_precheckins_v2',
  'fh_audit_logs_v1',
]

if (typeof localStorage !== 'undefined' && localStorage.getItem('fh_movimentos_zerados_v14') !== 'ok') {
  MOVEMENT_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
  localStorage.setItem('fh_movimentos_zerados_v14', 'ok')
}

const menu = [
  ['dashboard', '▦', 'Dashboard'],
  ['painel', '▥', 'Painel de reservas'],
  ['reservas', '▣', 'Reservas'],
  ['recepcao', '⇄', 'Recepção'],
  ['clientes', '♙', 'Clientes'],
  ['hospedes', '♟', 'Hóspedes'],
  ['precheckin', '☑', 'Pré check-in'],
  ['quartos', '▤', 'Quartos'],
  ['tarifas', '◷', 'Tarifas'],
  ['servicos', '⚑', 'Serviços'],
  ['financeiro', '$', 'Financeiro'],
  ['caixa', '▣', 'Caixa diário'],
  ['relatorios', '▧', 'Relatórios'],
  ['auditoria', '☷', 'Auditoria'],
  ['config', '⚙', 'Configurações'],
]

function App() {
  const [products, setProducts] = useState([])
  const [productForm, setProductForm] = useState({ nome: '', categoria: 'Frigobar', estoque: '', valor: '' })
  const [tab, setTab] = useState('dashboard')
  const [usuarios, setUsuarios] = useState([{ id: 'admin', nome: 'Administrador', email: '', perfil: 'Administrador', ativo: true }])
  const [usuarioForm, setUsuarioForm] = useState({ nome: '', email: '', perfil: 'Recepção', senha: '', ativo: true })
  const [search, setSearch] = useState('')
  const [roomTypes, setRoomTypes] = useLocalState('fh_room_types_v3', roomTypesSeed)
  const [rooms, setRooms] = useLocalState('fh_rooms_v3', roomsSeed)
  const [clients, setClients] = useLocalState('fh_clients_v2', clientsSeed)
  const [reservations, setReservations] = useLocalState('fh_reservations_v2', reservationsSeed)
  const [payments, setPayments] = useLocalState('fh_payments_v2', paymentsSeed)
  const [consumos, setConsumos] = useLocalState('fh_consumos_v1', consumosSeed)
  const [guests, setGuests] = useLocalState('fh_guests_v1', guestsSeed)
  const [blocks, setBlocks] = useLocalState('fh_blocks_v2', [])
  const [rates, setRates] = useLocalState('fh_rates_v2', [])
  const [precheckins, setPrecheckins] = useLocalState('fh_precheckins_v2', [])
  const [paymentMethods, setPaymentMethods] = useLocalState('fh_payment_methods_v1', paymentMethodsSeed)
  const [auditLogs, setAuditLogs] = useLocalState('fh_audit_logs_v1', [])
  const [methodForm, setMethodForm] = useState({ nome: '', tipo: 'normal', ativo: true })
  const [selectedReserva, setSelectedReserva] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [receiveReserva, setReceiveReserva] = useState(null)
  const [cancelReserva, setCancelReserva] = useState(null)
  const [serviceReserva, setServiceReserva] = useState(null)
  const [transferReserva, setTransferReserva] = useState(null)
  const [rescheduleReserva, setRescheduleReserva] = useState(null)
  const [blockModal, setBlockModal] = useState(null)
  const [toast, setToast] = useState('')
  const [periodStart, setPeriodStart] = useState(todayISO())
  const [periodDays, setPeriodDays] = useState(21)
  const [groupByType, setGroupByType] = useState(true)
  const [expandedTypes, setExpandedTypes] = useState({})
  const [dragSelection, setDragSelection] = useState(null)
  const [dragReservationRequest, setDragReservationRequest] = useState(null)
  const [newReservation, setNewReservation] = useState({
    tipoId: 'triplo', quartoId: '', clienteId: '', nome: '', cpf: '', telefone: '', email: '',
    entrada: todayISO(), saida: addDays(todayISO(), 1), adultos: 2, criancas: 0, diaria: 300, canal: 'Direto', origem: 'Direto - recepção', observacao: ''
  })
  const [newClient, setNewClient] = useState({ nome: '', cpf: '', telefone: '', email: '', nascimento: '', endereco: '', observacao: '' })
  const [rateForm, setRateForm] = useState({ tipoId: 'todos', inicio: todayISO(), fim: todayISO(), diasSemana: ['0','1','2','3','4','5','6'], valor: '', acao: 'criar' })
  const [preBusca, setPreBusca] = useState('')

  const dates = useMemo(() => Array.from({ length: Number(periodDays) }, (_, i) => addDays(periodStart, i)), [periodStart, periodDays])
  const futureReservations = reservations.filter(r => ['pendente', 'confirmada'].includes(r.status))
  const hospedados = reservations.filter(r => r.status === 'hospedado')
  const occupiedRoomIds = new Set(hospedados.map(r => r.quartoId))
  const revenueToday = payments.filter(p => p.data === todayISO() && p.tipo === 'recebimento').reduce((s, p) => s + Number(p.valor), 0)

  function notify(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }

  function logAction(acao, detalhe) {
    setAuditLogs([{ id: id(), data: new Date().toLocaleString('pt-BR'), usuario: 'Administrador', acao, detalhe }, ...auditLogs].slice(0, 300))
  }

  function clientOf(r) {
    return clients.find(c => c.id === r.clienteId) || { nome: r.nome || 'Cliente não informado', credito: 0 }
  }

  function typeOf(idTipo) {
    return roomTypes.find(t => t.id === idTipo) || roomTypes[0]
  }

  function roomOf(idQuarto) {
    return rooms.find(q => q.id === idQuarto) || {}
  }

  function diariaTotal(r) {
    return diffHalfDays(r) * Number(r.diaria || typeOf(r.tipoId).diaria || 0)
  }

  function servicesTotal(reservaId) {
    return consumos.filter(c => c.reservaId === reservaId).reduce((s, c) => s + Number(c.qtd || 1) * Number(c.valor || 0), 0)
  }

  function reservationTotal(r) {
    return diariaTotal(r) + servicesTotal(r.id)
  }

  function paidTotal(rid) {
    return payments.filter(p => p.reservaId === rid && p.tipo === 'recebimento').reduce((s, p) => s + Number(p.valor), 0) -
      payments.filter(p => p.reservaId === rid && p.tipo === 'estorno').reduce((s, p) => s + Number(p.valor), 0)
  }

  function balance(r) {
    return reservationTotal(r) - paidTotal(r.id)
  }

  function isRoomAvailable(roomId, start, end, ignoreId = '') {
    const startSlot = typeof start === 'number' ? start : dateToSlot(start, 0)
    const endSlot = typeof end === 'number' ? end : dateToSlot(end, 0)
    const conflictReservation = reservations.some(r => r.id !== ignoreId && r.quartoId === roomId && !['cancelada', 'checkout'].includes(r.status) && startSlot < reservationEndSlot(r) && endSlot > reservationStartSlot(r))
    const conflictBlock = blocks.some(b => b.quartoId === roomId && startSlot < blockEndSlot(b) && endSlot > blockStartSlot(b))
    return !conflictReservation && !conflictBlock
  }

  function availableRooms(tipoId = newReservation.tipoId, start = newReservation.entrada, end = newReservation.saida) {
    return rooms.filter(q => q.tipoId === tipoId && isRoomAvailable(q.id, start, end))
  }


  function createReservationByDrag(roomId, startSlotRaw, endSlotRaw) {
    if (!roomId || startSlotRaw === undefined || endSlotRaw === undefined) return
    const startSlot = Math.min(Number(startSlotRaw), Number(endSlotRaw))
    const endSlot = Math.max(Number(startSlotRaw), Number(endSlotRaw)) + 1
    const inicio = slotToDate(startSlot)
    const fim = slotToDate(endSlot + (endSlot % 2 ? 1 : 0))
    const quarto = roomOf(roomId)
    if (!quarto?.id) return notify('Quarto não encontrado.')
    if (!isRoomAvailable(roomId, startSlot, endSlot)) return notify('Esse período já possui reserva ou bloqueio.')
    setDragReservationRequest({
      roomId: quarto.id,
      roomNumber: quarto.numero,
      tipoId: quarto.tipoId,
      tipo: quarto.tipo,
      entrada: inicio,
      saida: fim,
      entradaSlot: startSlot,
      saidaSlot: endSlot,
      periodoTexto: `${slotLabel(startSlot)} até ${slotLabel(endSlot)}`,
      nome: '',
      telefone: '',
      cpf: ''
    })
  }

  function confirmDragReservation(data) {
    if (!data || !data.nome || !data.nome.trim()) return notify('Informe o nome do cliente.')
    const quarto = roomOf(data.roomId)
    if (!quarto?.id) return notify('Quarto não encontrado.')
    if (!isRoomAvailable(data.roomId, Number(data.entradaSlot ?? dateToSlot(data.entrada, 0)), Number(data.saidaSlot ?? dateToSlot(data.saida, 0)))) return notify('Esse período já possui reserva ou bloqueio.')
    const cli = {
      id: id(),
      nome: `${data.nome.trim()} ${data.sobrenome || ''}`.trim(),
      cpf: data.cpf || '',
      telefone: data.telefone || '',
      email: data.email || '',
      nascimento: data.nascimento || '',
      endereco: '',
      observacao: '',
      credito: 0,
      vip: false
    }
    const diaria = typeOf(quarto.tipoId).diaria || 0
    const reserva = {
      id: id(),
      codigo: reservationCode(),
      clienteId: cli.id,
      quartoId: quarto.id,
      tipoId: quarto.tipoId,
      entrada: data.entrada,
      saida: data.saida,
      entradaSlot: Number(data.entradaSlot ?? dateToSlot(data.entrada, 0)),
      saidaSlot: Number(data.saidaSlot ?? dateToSlot(data.saida, 0)),
      adultos: Number(data.adultos || typeOf(quarto.tipoId).capacidade || 1),
      criancas: Number(data.criancas || 0),
      diaria: moneyNumber(data.diaria) || diaria,
      status: 'pendente',
      origem: 'Painel de reservas',
      canal: data.canal || 'Direto',
      origem: data.origem || 'Painel de reservas',
      observacao: data.observacao || 'Criada arrastando no painel de reservas.'
    }
    setClients([cli, ...clients])
    setReservations([reserva, ...reservations])
    setDragReservationRequest(null)
    setSelectedReserva(reserva)
    logAction('Reserva criada por arrasto', `Reserva ${reserva.codigo} criada no quarto ${quarto.numero} de ${data.entrada} até ${data.saida}.`)
    notify(`Reserva ${reserva.codigo} criada pelo período selecionado.`)
  }


  function saveReservation(event) {
    if (event && event.preventDefault) event.preventDefault()

    const quartoSelecionado = newReservation.quartoId || newReservation.quarto || ''
    if (!quartoSelecionado) {
      notify('Selecione um quarto disponível para criar a reserva.')
      return
    }

    if (!newReservation.entrada || !newReservation.saida) {
      notify('Informe entrada e saída da reserva.')
      return
    }

    if (newReservation.saida <= newReservation.entrada) {
      notify('A data de saída precisa ser maior que a data de entrada.')
      return
    }

    if (!isRoomAvailable(quartoSelecionado, newReservation.entrada, newReservation.saida)) {
      notify('Esse quarto não está disponível nesse período. Escolha outro quarto.')
      return
    }

    const clienteExistente = newReservation.clienteId
      ? clients.find(c => c.id === newReservation.clienteId)
      : null

    if (!clienteExistente) {
      if (!newReservation.nome?.trim()) {
        notify('Informe o nome do contratante.')
        return
      }
      if (!newReservation.cpf?.trim()) {
        notify('Informe o CPF/CNPJ.')
        return
      }
      if (!newReservation.telefone?.trim()) {
        notify('Informe o telefone/WhatsApp.')
        return
      }
    }

    const cliente = clienteExistente || {
      id: id(),
      nome: newReservation.nome.trim(),
      cpf: newReservation.cpf.trim(),
      telefone: newReservation.telefone.trim(),
      email: (newReservation.email || '').trim(),
      nascimento: newReservation.nascimento || '',
      endereco: newReservation.endereco || '',
      reservaCodigo: reservationCode()
    }

    const diaria = moneyNumber(newReservation.diaria || 0)
    if (diaria <= 0) {
      notify('Informe o valor da diária.')
      return
    }

    const reserva = {
      id: id(),
      codigo: reservationCode(),
      clienteId: cliente.id,
      quartoId: quartoSelecionado,
      entrada: newReservation.entrada,
      saida: newReservation.saida,
      entradaSlot: dateToSlot(newReservation.entrada, 0),
      saidaSlot: dateToSlot(newReservation.saida, 0),
      adultos: Number(newReservation.adultos || 1),
      criancas: Number(newReservation.criancas || 0),
      diaria,
      canal: newReservation.canal || 'Direto',
      origem: newReservation.origem || 'Direto - recepção',
      observacao: newReservation.observacao || '',
      status: 'pendente',
      criadoEm: todayISO()
    }

    if (!clienteExistente) {
      setClients(prev => [cliente, ...prev])
    }

    setReservations(prev => [reserva, ...prev])

    setNewReservation(prev => ({
      ...prev,
      quartoId: '',
      clienteId: '',
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      observacao: ''
    }))

    logAction('Reserva criada', `Reserva ${reserva.codigo} criada para ${cliente.nome}`)
    notify(`Reserva ${reserva.codigo} criada com sucesso.`)
  }

  function receivePayment(form) {
    const r = receiveReserva
    const valor = moneyNumber(form.valor)
    if (!r || valor <= 0) return notify('Informe um valor para receber.')
    const cliente = clientOf(r)
    if (form.forma === 'Crédito do cliente') {
      if (Number(cliente.credito || 0) < valor) return notify('Crédito insuficiente para esse cliente.')
      setClients(clients.map(c => c.id === cliente.id ? { ...c, credito: Number(c.credito || 0) - valor } : c))
    }
    setPayments([{ id: id(), reservaId: r.id, data: todayISO(), tipo: 'recebimento', forma: form.forma, valor, pagante: cliente.nome, observacao: form.observacao || form.forma }, ...payments])
    setReservations(reservations.map(x => x.id === r.id ? { ...x, status: balance(x) - valor <= 0 && x.status === 'pendente' ? 'confirmada' : x.status } : x))
    setReceiveReserva(null)
    logAction('Pagamento recebido', `Reserva ${r.codigo}: ${form.forma} no valor de ${BRL.format(valor)}.`)
    notify('Pagamento recebido.')
  }

  function doCheckin(r) {
    if (balance(r) > 0) return notify('Check-in bloqueado: precisa pagar primeiro.')
    setReservations(reservations.map(x => x.id === r.id ? { ...x, status: 'hospedado' } : x))
    setSelectedReserva({ ...r, status: 'hospedado' })
    logAction('Check-in', `Reserva ${r.codigo} entrou no quarto ${r.quartoId}.`)
    notify('Check-in realizado.')
  }

  function doCheckout(r) {
    const totalConsumosAbertos = consumos
      .filter(c => c.reservaId === r.id)
      .reduce((s, c) => s + Number(c.qtd || 1) * Number(c.valor || 0), 0)
    const pagoConsumos = payments
      .filter(p => p.reservaId === r.id && p.tipo === 'recebimento' && String(p.observacao || '').toLowerCase().includes('consumo'))
      .reduce((s, p) => s + Number(p.valor || 0), 0)
    const saldoConsumo = Math.max(0, totalConsumosAbertos - pagoConsumos)
    if (saldoConsumo > 0) {
      notify(`Checkout bloqueado. Existe consumo em aberto no quarto: ${BRL.format(saldoConsumo)}.`)
      setTab('quartos')
      return
    }

    setReservations(reservations.map(x => x.id === r.id ? { ...x, status: 'checkout' } : x))
    setRooms(rooms.map(q => q.id === r.quartoId ? { ...q, statusLimpeza: 'verificar' } : q))
    setSelectedReserva(null)
    logAction('Check-out', `Reserva ${r.codigo} saiu do quarto ${r.quartoId}. Quarto marcado para verificar.`)
    notify('Check-out realizado. Quarto marcado para verificar.')
  }

  function cancelWithCredit({ motivo, observacao, multa }) {
    const r = cancelReserva
    const recebido = paidTotal(r.id)
    const multaValor = moneyNumber(multa)
    const credito = Math.max(0, recebido - multaValor)
    const cliente = clientOf(r)
    const newPayments = [...payments]
    if (multaValor > 0) newPayments.unshift({ id: id(), reservaId: r.id, data: todayISO(), tipo: 'multa', forma: 'Multa de cancelamento', valor: multaValor, pagante: cliente.nome, observacao: motivo })
    if (credito > 0) newPayments.unshift({ id: id(), reservaId: r.id, data: todayISO(), tipo: 'estorno', forma: 'Crédito do cliente', valor: credito, pagante: cliente.nome, observacao: observacao || 'Cancelamento convertido em crédito' })
    setPayments(newPayments)
    setClients(clients.map(c => c.id === cliente.id ? { ...c, credito: Number(c.credito || 0) + credito } : c))
    setReservations(reservations.map(x => x.id === r.id ? { ...x, status: 'cancelada', cancelamento: { motivo, observacao, credito, multa: multaValor } } : x))
    setCancelReserva(null)
    setSelectedReserva(null)
    logAction('Cancelamento / estorno', `Reserva ${r.codigo} cancelada. Crédito gerado: ${BRL.format(credito)}. Multa: ${BRL.format(multaValor)}.`)
    notify(`Reserva cancelada. Crédito gerado: ${BRL.format(credito)}.`)
  }



  function moveReservation(reservaId, novoQuartoId) {
    const r = reservations.find(x => x.id === reservaId)
    if (!r || !novoQuartoId) return
    if (novoQuartoId === r.quartoId) return
    if (!isRoomAvailable(novoQuartoId, r.entrada, r.saida, r.id)) return notify('Esse quarto não está livre no período da reserva.')
    const novoQuarto = roomOf(novoQuartoId)
    const reservaAtualizada = { ...r, quartoId: novoQuartoId, tipoId: novoQuarto.tipoId }
    setReservations(reservations.map(x => x.id === r.id ? reservaAtualizada : x))
    setRooms(rooms.map(q => q.id === r.quartoId ? { ...q, statusLimpeza: 'verificar' } : q))
    setSelectedReserva(reservaAtualizada)
    logAction('Reserva movida no mapa', `Reserva ${r.codigo}: quarto ${r.quartoId} para ${novoQuarto.numero}.`)
    notify(`Reserva movida para o quarto ${novoQuarto.numero}.`)
  }

  function transferRoom(form) {
    const r = transferReserva
    if (!r) return
    if (!form.quartoId) return notify('Selecione o novo quarto.')
    if (form.quartoId === r.quartoId) return notify('Esse já é o quarto atual.')
    if (!isRoomAvailable(form.quartoId, r.entrada, r.saida, r.id)) return notify('O quarto escolhido está indisponível no período da reserva.')
    const novoQuarto = roomOf(form.quartoId)
    const reservaAtualizada = { ...r, quartoId: form.quartoId, tipoId: novoQuarto.tipoId, observacao: `${r.observacao || ''} ${form.observacao || 'Troca/alocação de quarto realizada pela recepção.'}`.trim() }
    setReservations(reservations.map(x => x.id === r.id ? reservaAtualizada : x))
    setRooms(rooms.map(q => q.id === r.quartoId ? { ...q, statusLimpeza: 'verificar' } : q))
    setSelectedReserva(reservaAtualizada)
    setTransferReserva(null)
    logAction('Troca/alocação de quarto', `Reserva ${r.codigo}: quarto ${r.quartoId} para ${novoQuarto.numero}.`)
    notify(`Reserva ${r.codigo} alocada no quarto ${novoQuarto.numero}.`)
  }



  function rescheduleReservation(form) {
    const r = rescheduleReserva
    if (!r) return
    if (!form.entrada || !form.saida) return notify('Informe entrada e saída.')
    if (form.entrada >= form.saida) return notify('A saída precisa ser depois da entrada.')
    if (!form.quartoId) return notify('Selecione um quarto disponível para a nova data.')
    if (!isRoomAvailable(form.quartoId, form.entrada, form.saida, r.id)) return notify('Esse quarto não está livre na nova data.')
    const novoQuarto = roomOf(form.quartoId)
    const novasDiarias = diffDays(form.entrada, form.saida)
    const reservaAtualizada = {
      ...r,
      entrada: form.entrada,
      saida: form.saida,
      quartoId: form.quartoId,
      tipoId: novoQuarto.tipoId,
      diaria: moneyNumber(form.diaria) || r.diaria,
      status: r.status === 'cancelada' ? 'pendente' : r.status,
      observacao: `${r.observacao || ''} ${form.observacao || 'Reserva remarcada pela recepção.'}`.trim(),
      remarcacao: { data: todayISO(), entradaAnterior: r.entrada, saidaAnterior: r.saida, quartoAnterior: r.quartoId, novasDiarias }
    }
    setReservations(reservations.map(x => x.id === r.id ? reservaAtualizada : x))
    setSelectedReserva(reservaAtualizada)
    setRescheduleReserva(null)
    logAction('Reserva remarcada', `Reserva ${r.codigo}: ${r.entrada} até ${r.saida} para ${form.entrada} até ${form.saida}, quarto ${novoQuarto.numero}.`)
    notify(`Reserva ${r.codigo} remarcada.`)
  }

  function sendReservationWhatsapp(r) {
    const cliente = clientOf(r)
    const quarto = roomOf(r.quartoId)
    const msg = `Olá ${cliente.nome}, sua reserva ${r.codigo} está registrada. Quarto ${quarto.numero} - ${quarto.tipo}. Entrada: ${r.entrada} às 12:00. Saída: ${r.saida} às 11:59. Valor total: ${BRL.format(reservationTotal(r))}. Saldo: ${BRL.format(balance(r))}.`
    window.open(`https://wa.me/55${String(cliente.telefone || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
    logAction('WhatsApp da reserva', `Mensagem da reserva ${r.codigo} enviada/aberta no WhatsApp.`)
  }

  function limparQuarto(quartoId) {
    setRooms(rooms.map(q => q.id === quartoId ? { ...q, statusLimpeza: 'limpo' } : q))
    logAction('Governança', `Quarto ${quartoId} marcado como limpo/liberado.`)
    notify(`Quarto ${quartoId} marcado como limpo/liberado.`)
  }

  function saveConsumo(form) {
    const valor = moneyNumber(form.valor)
    const qtd = Number(form.qtd || 1)
    if (!serviceReserva) return
    if (!form.item.trim()) return notify('Informe o item do consumo.')
    if (valor <= 0) return notify('Informe o valor do consumo.')
    setConsumos([{ id: id(), reservaId: serviceReserva.id, data: todayISO(), item: form.item, qtd, valor, observacao: form.observacao || '' }, ...consumos])
    setServiceReserva(null)
    logAction('Consumo lançado', `Reserva ${serviceReserva.codigo}: ${form.item}, qtd ${qtd}, valor ${BRL.format(valor)}.`)
    notify('Consumo lançado na conta do quarto.')
  }

  function saveBlock(data) {
    if (!data.quartoId || !data.inicio || !data.fim) return notify('Informe quarto e período.')
    setBlocks([{ id: id(), quartoId: data.quartoId, inicio: data.inicio, fim: data.fim, motivo: data.motivo || 'Bloqueio manual' }, ...blocks])
    setBlockModal(null)
    logAction('Bloqueio manual', `Quarto ${data.quartoId} bloqueado de ${data.inicio} até ${data.fim}.`)
    notify('Período bloqueado no quarto.')
  }

  function saveRate() {
    const valor = moneyNumber(rateForm.valor)
    if (valor <= 0) return notify('Informe o valor da tarifa.')

    const applyAll = rateForm.tipoId === 'todos'
    const targets = applyAll ? roomTypes : roomTypes.filter(t => t.id === rateForm.tipoId)

    if (!targets.length) return notify('Selecione o tipo de quarto.')

    const novosLancamentos = targets.map(t => ({
      id: id(),
      ...rateForm,
      tipoId: t.id,
      tipoNome: t.nome,
      valor,
      todos: applyAll
    }))

    setRates([...novosLancamentos, ...rates])

    if (rateForm.acao !== 'remover') {
      setRoomTypes(roomTypes.map(t =>
        applyAll || t.id === rateForm.tipoId ? { ...t, diaria: valor } : t
      ))
    }

    const detalhe = applyAll
      ? `Todos os tipos de quarto: ${BRL.format(valor)} de ${rateForm.inicio} até ${rateForm.fim}.`
      : `${typeOf(rateForm.tipoId).nome}: ${BRL.format(valor)} de ${rateForm.inicio} até ${rateForm.fim}.`

    logAction('Tarifa alterada', detalhe)
    notify(applyAll ? 'Tarifa aplicada para todos os quartos.' : 'Tarifa criada/modificada para o período.')
  }


  function saveProduct() {
    if (!productForm.nome?.trim()) return notify('Informe o nome do produto.')
    const estoque = Number(productForm.estoque || 0)
    const valor = moneyNumber(productForm.valor)
    if (estoque < 0) return notify('Estoque não pode ser negativo.')
    if (valor <= 0) return notify('Informe o valor de venda do produto.')
    const produto = {
      id: id(),
      nome: productForm.nome.trim(),
      categoria: productForm.categoria || 'Geral',
      estoque,
      valor
    }
    setProducts([produto, ...products])
    setProductForm({ nome: '', categoria: 'Frigobar', estoque: '', valor: '' })
    logAction('Produto cadastrado', `${produto.nome} - estoque ${produto.estoque} - ${BRL.format(produto.valor)}`)
    notify('Produto cadastrado no estoque.')
  }

  function saveClient() {
    const nome = newClient.nome?.trim() || ''
    const cpf = newClient.cpf?.trim() || ''
    const telefone = newClient.telefone?.trim() || ''
    const email = newClient.email?.trim() || ''

    if (!nome) return notify('Informe o nome do cliente.')
    if (!cpf) return notify('Informe o CPF/CNPJ do cliente.')
    if (!telefone) return notify('Informe o telefone/WhatsApp do cliente.')
    if (!email) return notify('Informe o e-mail do cliente.')

    const cli = { id: id(), ...newClient, nome, cpf, telefone, email, reservaCodigo: reservationCode(), credito: 0, vip: false }
    setClients([cli, ...clients])
    setNewClient({ nome: '', cpf: '', telefone: '', email: '', nascimento: '', endereco: '', observacao: '' })
    logAction('Cliente cadastrado', `${cli.nome} cadastrado.`)
    notify('Cliente cadastrado. Ao criar reserva, o código será gerado automaticamente.')
  }

  function createPrecheckin(reserva) {
    const token = id().slice(0, 8)
    const link = `${location.origin}/pre-checkin/${reserva.codigo}-${token}`
    setPrecheckins([{ id: id(), reservaId: reserva.id, codigo: reserva.codigo, token, link, status: 'enviado', data: todayISO(), nomeCompleto: '', selfie: '', documentoFoto: '', endereco: '', nascimento: '', observacao: '' }, ...precheckins])
    const cliente = clientOf(reserva)
    const msg = `Olá ${cliente.nome}, segue o link do pré check-in da sua reserva ${reserva.codigo}: ${link}`
    window.open(`https://wa.me/55${String(cliente.telefone || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
    logAction('Pré check-in enviado', `Reserva ${reserva.codigo}: link enviado por WhatsApp.`)
    notify('Link de pré check-in gerado para WhatsApp.')
  }

  function savePaymentMethod() {
    const nome = methodForm.nome.trim()
    if (!nome) return notify('Informe o nome da forma de pagamento.')
    if (paymentMethods.some(m => m.nome.toLowerCase() === nome.toLowerCase())) return notify('Essa forma de pagamento já existe.')
    const nova = { id: id(), nome, tipo: methodForm.tipo, ativo: methodForm.ativo }
    setPaymentMethods([nova, ...paymentMethods])
    setMethodForm({ nome: '', tipo: 'normal', ativo: true })
    logAction('Forma de pagamento criada', `${nome} criada nas configurações.`)
    notify('Forma de pagamento criada.')
  }

  function togglePaymentMethod(mid) {
    setPaymentMethods(paymentMethods.map(m => m.id === mid ? { ...m, ativo: !m.ativo } : m))
    logAction('Forma de pagamento alterada', 'Forma de pagamento ativada/desativada.')
  }

  function roomStatus(q) {
    const hosp = hospedados.find(r => r.quartoId === q.id)
    if (hosp) return ['status-blue', 'Alugado / Check-in']
    if (q.statusLimpeza === 'verificar') return ['status-orange', 'Verificar saída']
    if (q.statusLimpeza === 'manutencao') return ['status-red', 'Manutenção']
    const blocked = blocks.find(b => b.quartoId === q.id && todayISO() >= b.inicio && todayISO() < b.fim)
    if (blocked) return ['status-red', 'Bloqueado']
    const fut = futureReservations.find(r => r.quartoId === q.id)
    if (fut) return ['status-green', 'Reserva futura']
    return ['status-free', 'Disponível']
  }

  function openRoom(q) {
    setSelectedRoom(q)
  }

  function printReceipt(r) {
    const cliente = clientOf(r), quarto = roomOf(r.quartoId)
    const html = `
      <html><head><title>Reserva ${r.codigo}</title><style>
      body{font-family:Arial;margin:40px;color:#111}.center{text-align:center}.logo{font-size:30px;font-weight:800}.logo-print-brisas{width:96px;height:96px;object-fit:contain;margin-bottom:6px}.line{border-top:1px solid #ccc;margin:18px 0}
      table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border:1px solid #ccc;padding:8px;text-align:left}.right{text-align:right}.assinatura{margin-top:50px;border-top:1px solid #333;width:70%}
      </style></head><body>
      <div class="center"><img class="logo-print-brisas" src="data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9oADAMBAAIAAwAAACH33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333330AAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAD33333333333333333333330AAAAAAAAAAAAAAAQ00wAAAAAAAAAAAAAAD33333333333333333333330AAAAAAAAAAAFSPkFnUNNuI0AAAAAAAAAAD33333333333333333333330AAAAAAAAArWcIAAAAAAACJpQEAAAAAAAAD33333333333333333333330AAAAAAAAILIAAAAAAAA6KAADY4AAAAAAAD33333333333333333333330AAAAAATioqYJkK274gCkX1VF3KwGsAAAAD33333333333333333333330AAAAASlBUkZMGIZuLIRL54IPyxd0kAAAAD33333333333333333333330AAAABUEZcysEgkPoXKGV2kABmfMkAAAAAD33333333333333333333330AAAAHZ6f5UUBRIvaAAAAsQABTIP0IAAAAD33333333333333333333330AAATzUkkY+ysDep6sUFAPRTWWVLZqUAAAD33333333333333333333330AAAH4IFclgpvXYsa4AtQKiiAlHGckqIAAD33333333333333333333330AAAJEASW6gBR4E/Ss/vz78ZE2lRcbYoAAD33333333333333333333330ABHMAAAG1RgzwG3g9qV44Vs/eivSEBUAAD33333333333333333333330ABWEABxuD/wCLKWBt8s2eBFRztCwy3AUrAA19999999999999999999999AAsqmYZhEdRF6LAgDbU2TXGWpB0NzJBJAA99999999999999999999999AAtAAElVWhAeS0SznGlEiQgHgEAiiAQBAA99999999999999999999999AATABluaiZveirQQNS3L6AAHBggAAAHMAA99999999999999999999999AAHAA+zAAAxRh3bsAGGAQAAQgAAAAADIAA99999999999999999999999AAJIFiAAAAAS9jKlNYAAAAIJFIAABCBBAA99999999999999999999999AAmCGqAAAFxdIZ7aVeiCx7yl9qvmZhTqAA99999999999999999999999AAACRpAE2Wu53k7AXaSCuxmb0KY6NA1pAA99999999999999999999999AAROAAdBdxhpHthuY02aJwcfo7CpAAfAAA99999999999999999999999AAAWBAQywgAAyTgK+DEDX4ZGtQyAAVLAAA99999999999999999999999AAAijAAAAAAHFrQkPtHLVjAAAAAAADBAAA99999999999999999999999AAAAiDAAAAAD5H9NA5SHrgIAAAAAT+AAAA99999999999999999999999AAAAGGIAAAADgjgQAfDyRCgAAAABBBAAAA99999999999999999999999AAAAAGxi2qgBpyJwTKNrAZjANs2GAAAAAA99999999999999999999999AAAAAAAqPuL1M/KUAkDrFVeAqJjAAAAAAA99999999999999999999999AAAAAAUKyacVkSAAUTgEIZHpfmaIAAAAAA99999999999999999999999AAAAAAR5qO2V4sLAWiKyeT529EaLAAAAAA99999999999999999999999AAAAAAAxqehQh3PWvwDhzAQATRQAAAQAAA99999999999999999999999AAAAAAAAAAAAAAXpXgAAAAAAAAAAAAAAAA19999999999999999999999AAAAAAAWuOZGkOODxm22qHllSdNdAAAAAA99999999999999999999999AAAAAAAytrKKf98VU493qvXwet6nAAAAAA99999999999999999999999AAAAAAm+tjzpdEW9MHCTR41uFmMltBAAAA99999999999999999999999AAAAAA9xV9XmvCPQt0MqJxBbLF1lhLAAAA999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999/9oADAMBAAIAAwAAABA+t9/8+t9/8+t9/wDPrff/AD633+z63z/zyzz/AM8s8/8APLPP/PLPP/PLPP8Ay/28wxy20wxy20wxy20wx620wxy20ww6200w6280w+280w+280w+080w+0z8z8y09x8y09x8y09x8y09x4xw8x41x0z51x8z71x8z71x8z71x8z70x4w3410734106z4106z4106z4106zw1w6z4zx6z57x6357x6357x6155x6083+1w6371w6371w6371w637106371062y9062y9162y9162y91+2y90+2wz633/z633/AM+t9/8APrff/Prff7PrfP8Azyzz/wA8s8/88s8/88s8/wDPLPP/AC/28wxy20wxy20wxy20wx620wxy20ww6200w6280w+280w+280w+080w+0z8z8y09x8y09x8y09x8y09x4xw8x41x0z51x8z71x8z71x8z71x8z70x4w3410/3410+3410+3410+341063w1w634zx6357x6357x6357x6155x6083+1063+1063+1063+1063+1063+1062y9062y9162y9162y91+2y90+2wz733/AO+99/8Avvff/vvff/vvff8A773z/wA888/8888/8888/wDPPPP/ADzzz/y/280xy+00x6+00x6+00x6+00x6200w6208w6288w+288w+288w+0884+0z9z9y09x9609x9609x9609x54w9x51w1z51w9z70x8z70x8z70x8z70x4z3410/3410+3410+3410+341263w1w634zx6357x6357x6357x6155x6083+1063+1063+1063+1063+1063+1062y9062y91+2y91+2y91+2y90+2wz733/wC+99/++99/++99/wDvvff/AL73z/zzzz/zzzz/AM888/8APPPP/PPPP/L/AG80xy+00x6+00x6+00x6+00x6200w+208w+288w+288w+288w+0884+0z9z9y09x9609x9609x9609x54w9x51w1z51w9z70x8z70x8z70x8z70x4z3410/3410+3410+3410+341263w1w634zx6357x6357x6357x6155x6083+1063+1063+1063+1063+1063+1062y9062y91+2y91+2y91+2y90+2wz733/7733/7733/AO+99/8Avvff/vvfP/PPPP8Azzzz/wA888/8888/8888/wDL/bzTHL7TTHr7TTHr7TTHr7TTHrbTTD7bTzD7bzzD7bzzD7bzzD7Tzzj7TP3P3LT3H3rT3H3rT3H3rT3HnjD3HnXDXPnXD3PvTHzPvTHzPvTHzPvTHjPfjXT/AH410+3410+3410+341263w1w634zx6357x6357x6357x6155x6083+1063+1063+1063+1063+1063+1062y9062y91+2y91+2y91+2y90+2wz733/7733/AO+99/8Avvff/vvff/vvfP8Azzzz/wA888/8888/8888/wDPPPP/AC/280xy+00x6+00x6+00x6+00x6200w+208w+288w+288w+288w+0884+0z9z9y09x9609x9609x9609x54w9x51w1z51w9z70x8z70x8z70x8z70x4z3410/3410+3410+3410+341263w1w634zx6357x6357x6357x6155x6083+1063+1063+1063+1063+1063+1062y9062y91+2y91+2y91+2y90+2wz733/AO+99/8Avvff/vvff/vvff8A773z/wA888/8888/8888/wDPPPP/ADzzz/y/280xy+00x6+33z7/AN98+/8AffPvfffP/ff/AD/3/wD8/wDf/wDz/wBvPMPtPPOPtM/c/ctPcfetPcAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAADs+9MfM+9MeM9+NdP9+NdPt8AAAAAAAAAAAAAAAQ00wAAAAAAAAAAAAAAD+e8eteecetPN/tdOt/tdOt8AAAAAAAAAAAdQyIJOFiQCIcAAAAAAAAAADsvdftsvdPtsM+99/8Avvff/wDwAAAAAAAACfzMwAAAAAAAAqWAwAAAAAAAALzzz/zzzz/y/wBvNMcvtNMev8AAAAAAABHMMAAAAAAAAFmgDCo4AAAAAAADvPMPtPPOPtM/M/MtPcfOtPcAAAAAATxoeKHlHd3sQAoYNXgcUQckAAAADsu9MfMu9MeM9+NdP9+NdPt8AAAAATcBPUkp2IYvI0iMKKLKamJ+sAAAAD+f8etefcetPNvtdONv9dOt8AAAAAJI6d7iicHbo0HX7UIAB/HGsAAAAADsvdftsvdPtsM+99+++99//wDAAAASWGe1NxNXC1wgAAEiCIA1QAOhAAAAArPPP/LPPP8Ay/0wwxy20wxy3wAABII1+8UoFmpJzdBAUEk2Lto3YgDgAAAO04w+0044+0z8x4y09x46w9wAAFfoYWlL58RJx7x7X6y/SgDRfa0AgQAAOw48x8w48x4w34107341073wAAPwYBOd7LJq86r0gG5iH1H/AMYPZbKYAAD+f8etefcetP8Ab7XTjb/XTrfAAXEAAAAgxGk+ZxImG/Stz1Tt5B3hAGAAA7L3X7bL3T7bDPvffvvvff8A/wAABGMAA5Oa+pZ3yVcPCfNcpEdaWPkEBSgACM88/wDLPPP/AC/0wwxy20wxy3wAJCWVPQR9kPevQEPn+oixy1UUdI7aQ4wAO04w+0044+0z8x4y09x46w9wAKwABytcCEOhWQnRTEsfUJGYAAMwQEAgAOw48x8w48x4w34107341073wAFABbjeRerH5VUB/RhgUgAJn2oAAAADAAP5/wAetefcetP9vtdONv8AXTrfAAcASdQAAATDTtWxgCUAAAAAgAAAAAUBAA7L3X7bL3T7bDPbPfvPbPf/AHwBMiA+wAAAAFaeiSxWAAAAADyyAABwQSwALyzz7zyzx7yz220xy221xz3wAByVYQAADeiJuZO16kneLzk7z8Y2+QKgAOw0w+2w0w+2z9w8w49w8w49wAFCQSwAHtecEGqAq7XW8zXVsd8W2wJ6gAOw4050w4050z3w/wBO98P9O98ABMkABgWeR4a/Sy4TiN3XAZCZF3kABwAAD+P8eteP8etfJvNdOtuNdOt8AAAEsDCFOAACINHzkPTvZenFOHEAALAAADsPdetsPdOts89s9u89s9/98AADGQAAAAAAI+JcYqEYd+kAAAAAADgMAAC8s8+88s8e8s9ttMctttcc98AAAC8AAAAAAM6Ww4DkIeoYAAAAAAB8AAADsNMPtsNMPts/cPMOPcPMOPcAAABZkgAAABGIGEED0FDMKAAAAAeOEAAADsONOdMONOdM98P9O98P9O98AAAABeN/vnH+pslZDn4sBkIAn/4YAAAAAD+P8eteP8etfJvNdOtuNdOt8AAAAAAC2b+Ns2APpFY5Ic+0CcbYAAAAAADsPdetsPdOts89s9u89s9/98AAAAABXJKvusxkBVzNq8umuNxI8AAAAAAC8u9+88s9e8s9NtMctttcc98AAAAABTeNGXspQFhAhjbFG7ok7ekAAAAADtNMPtMNMPtM/c/cOPcfcOPcAAAAABAQ7yPENHTT1oPNEBCKAHEAABAAADsvdedMvdOdM98P9O98P9O98AAAAAAAAAAAAAAXreAAAAAAAAAAAAAAgADeP8et+P8AHrfybz3Trbj3TrfAAAAAAAbjPXPoPTsfHD2nYGFlzH/AAAAAA7D3TrbD3TrbPfLPbv8Ayz3/AP8AAAAAAAADP8PbGnkjkYeQnw8YrP6YAAAAAA/LvfvfLvXvbPTbXHLbbXHPfAAAAAAl6HgA93MfqwUrgHw5mzmMthDAAAA7DTD7TDTD7TP3P3Dz3H3Dj3AAAAAA+WCzEyiHUMTEozLvCogJn2DoAAAA7L3XnTL3TnTPfD/TvfD/AE738/8AP/8Az/z/AP8AP/P/APz/AN+/4z1+/wDP/fv/AD/37/j/AB634/x638m8906249062490624906249042w9062w9062w9062w9062w9062w9062z3yz27/wAs9v8A/LPb/wDyz2//AMs9v+8s9/8AfLvf/fLvf/fLvf8A3y7373y7172z021xy221xz221xz221x7201xz201wy2w0wy2w0w+2w0w+2w0w+0w0w+0z9z9w89x9w49x9w49x9w49x9w49x9141y9141y9150y9150y9150y9050z3w/wBO98P9O9+P9O9+P9O98P8ATvfD/Xrfj/Xrfj/Hrfj/AB634/x634/x638m8906249062490624906249042w9062w9062w9062w9062w9062w9062z3yz27/yz2/8A8s9v/wDLPb//ACz2/wC8s9/98u9/98u9/wDfLvf/AHy7373y7172z021xy221xz221xz221x7201xz201wy2w0wy2w0w+2w0w+2w0w+0w0w+0z9z9w89x9w49x9w49x9w49x9w49x9141y9141y9150y9150y9150y9050z3w/073w/0734/0734/wBO98P9O98P9et+P9et+P8AHrfj/Hrfj/Hrfj/Hrfybz3Trbj3Trbj3Trbj3Trbj3TjbD3TrbD3TrbD3TrbD3TrbD3TrbD3TrbPfLPfv/LPf/8Ayz3/AP8ALPf/APyz3/7yz3/3y73/AN8u9/8AfLvf/fLvfvfLvXvbPTbXHLbbXHPbbXHPbbXHvbTXHPbTXDPbDTDPbDTD/bDTD/bDTD7TDTD7TP3P3Dz3H3Dj3H3Dj3H3Dj3H3Dj3H3XjXL3XjXL3XnTL3XnTL3XnTL3TnTPfD/TvfD/Tvfj/AE734/073w/073w/1634/wBet+P8et+P8et+P8et+P8AHrfybz3Trbj3Trbj3Trbj3Trbj3TjbD3TrbD3TrbD3TrbD3TrbD3TrbD3TrbPfLPfv8Ayz3/AP8ALPf/APyz3/8A8s9/+8s9/wDfLvf/AHy73/3y73/3y7373y7172z121wz121wz021wz021w7001wz001wz0w0wz0w0w/0w0w/0w0w+0w0w+0z9z9w89x9w49x9w49x9w49x9w49x9141y9141y9150y9150y9150y9050z3w/073w/wBO9+P9O9+P9O98P9O98P8AXrfj/Xrfj/Hrfj/Hrfj/AB634/x63828906249062490624906249042w9062w9062w9062w9062w9062w9062z2yz37+yz3/wDss9//ALLPf/7LPf8A6yz372y7372y7372y7372y7372y7172z121wz121wz021wz021w7001wz001wz0w0wz0w0w/0w0w/wBMNMPtMNMPtM/c/cONcfcONcfcONcfcONcfcONcfdeNcvdeNcvdeNMvdeNMvdedMvdOdM98N9O98N9O98N9O98N9O98N9O98N8et8M8et+M8et+M8et+M8et8M8et/NvPdOtuPdOtuPdOtuPdOtuPdONMPdOtMPdOtMPdOtMPdOtMPdOtMPdOtM88s9+88s9+88s9+88s9+88s9+88s9+88u9+88u9+88u9+88u9+88u9essNdtcMtdNcM9NNcM9NNcO9NNcM9NNcMtMNMMtMNMOtMNMOtMNMPtMNMPtM/c/cONcfcONcfcONcfcONcfcONcfdeNcvdeNcvdeNMvdeNMvdedMvdOdM98N9O98N9O98N9O98N9O98N9O98N8et8M8et+M8et+M8et+M8et8M8et/NvPdOtuPdOtuPdOtuPdOtuPdONMPdOtMPdOtMPdOtMPdOtMPdOtMPdOtM//xAA1EQACAgEDAgMFBwQCAwAAAAABAgADEQQSMRMhEDJBFCJQUWEFICMzQEJxMFKBkSSgYqHB/9oACAECAQE/AP8Au6d5g/EwpY4ETQ2Nz2nstNf5jTqaVOBme21jypPbz6LPbz6rPbUPmSdTSvyMT2Wmz8to+isTjvCCDg/DERnOFGYmjVBuuOI2rrrG2pY+pss5P9GvU2V8GLqqrRi0SzRZG6o5EZSpwfhNGla33m7CPqa6BspEexrDlj/RqqD92OBFoos91G7y2tqm2t4V2vWcqYttWpG2zsZdp2qPfj4Pp9MFHUt4mo1Rs91ewiVs5wogorT8xv8AUFumThcz2yscJBrajyk62lfsRieyUWeRo/2e48pzHqdPMPAsSAImdwxzPtDG5fn4dHeu5IQVODKNV22W9xNRpun76cQAnsIy7Tj4Hp6Ai9W3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"/><div class="logo">HOTEL BRISAS</div><b>Sistema de Gestão</b><br/>Impresso em ${new Date().toLocaleString('pt-BR')}</div>
      <div class="line"></div>
      <div><b>Contratante / Hóspede:</b> ${cliente.nome}<br/><b>CPF:</b> ${cliente.cpf || ''}<br/><b>E-mail:</b> ${cliente.email || ''}<br/><b>Telefone:</b> ${cliente.telefone || ''}</div>
      <p><b>Reserva:</b> ${r.codigo}<br/><b>Quarto:</b> ${quarto.numero} - ${quarto.tipo}<br/><b>Entrada:</b> ${r.entrada} 12:00<br/><b>Saída:</b> ${r.saida} 11:59</p>
      <table><tr><th>Item</th><th>Data</th><th>Produto</th><th>Qtd.</th><th>Preço Total</th></tr>
      <tr><td>1</td><td>${r.entrada}</td><td>Diária</td><td>${diffDays(r.entrada,r.saida)}</td><td class="right">${BRL.format(reservationTotal(r))}</td></tr>
      ${payments.filter(p=>p.reservaId===r.id).map((p,i)=>`<tr><td>${i+2}</td><td>${p.data}</td><td>${p.forma}</td><td>1</td><td class="right">${p.tipo==='recebimento'?'-':''}${BRL.format(p.valor)}</td></tr>`).join('')}
      </table>
      <p><b>Despesas:</b> ${BRL.format(reservationTotal(r))} &nbsp; <b>Pago:</b> ${BRL.format(paidTotal(r.id))} &nbsp; <b>Saldo:</b> ${BRL.format(balance(r))}</p>
      <div class="assinatura">Assinatura:</div>
      </body></html>`
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
    w.print()
  }


  function exportSystemData() {
    const data = {
      roomTypes,
      rooms,
      clients,
      reservations,
      payments,
      consumos,
      blocks,
      rates,
      precheckins,
      paymentMethods,
      auditLogs,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-sistema-hotel-${todayISO()}.json`
    a.click()
    URL.revokeObjectURL(url)
    logAction('Backup exportado', 'Backup completo dos dados do sistema foi gerado.')
    notify('Backup exportado com sucesso.')
  }

  function clearOperationalData() {
    const ok = window.confirm('Tem certeza que deseja zerar reservas, clientes, financeiro, consumos, pré check-in, bloqueios e auditoria? Os quartos e categorias serão mantidos.')
    if (!ok) return
    setClients([])
    setReservations([])
    setPayments([])
    setConsumos([])
    setBlocks([])
    setRates([])
    setPrecheckins([])
    setAuditLogs([])
    setSelectedReserva(null)
    setSelectedRoom(null)
    localStorage.removeItem('fh_clients_v2')
    localStorage.removeItem('fh_reservations_v2')
    localStorage.removeItem('fh_payments_v2')
    localStorage.removeItem('fh_consumos_v1')
    localStorage.removeItem('fh_blocks_v2')
    localStorage.removeItem('fh_rates_v2')
    localStorage.removeItem('fh_precheckins_v2')
    localStorage.removeItem('fh_audit_logs_v1')
    notify('Sistema zerado. Quartos e categorias mantidos.')
  }

  function restoreRoomDefaults() {
    const ok = window.confirm('Restaurar quartos e categorias para o padrão definido pelo hotel?')
    if (!ok) return
    setRoomTypes(roomTypesSeed)
    setRooms(roomsSeed)
    localStorage.setItem('fh_room_types_v3', JSON.stringify(roomTypesSeed))
    localStorage.setItem('fh_rooms_v3', JSON.stringify(roomsSeed))
    logAction('Quartos restaurados', 'Quartos e categorias foram restaurados para o padrão.')
    notify('Quartos e categorias restaurados.')
  }


  const pageTitle = menu.find(m => m[0] === tab)?.[2] || 'Dashboard'

  return (
    <div className="hotel-layout">
      <aside className="hotel-sidebar">
        <div className="hotel-brand">
          <img className="hotel-logo-img" src={hotelBrisasLogo} alt="Hotel Brisas" />
          <div><h1>HOTEL BRISAS</h1><p>Sistema de Gestão</p></div>
        </div>
        <nav className="hotel-menu">
          {menu.map(([key, icon, label]) => (
            <button key={key} className={'menu-link ' + (tab === key ? 'active' : '')} onClick={() => setTab(key)}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div className="sidebar-user"><div className="user-avatar">LA</div><div><strong>Lucas Almeida</strong><small>Administrador</small></div></div>
      </aside>

      <main className="hotel-main">
        <header className="hotel-topbar">
          <div className="topbar-title"><button className="hamburger">☰</button><div><h2>{pageTitle}</h2><p>Sistema de Gestão do Hotel Brisas</p></div></div>
          <div className="topbar-right">
            <div className="search-field"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar reserva, hóspede, quarto..." /><span>⌕</span></div>
            <button className="bell-button">🔔<small>{reservations.filter(r => r.status === 'pendente').length}</small></button>
            <input className="date-input-top" type="date" value={todayISO()} readOnly />
          </div>
        </header>

        {toast && <div className="toast">{toast}</div>}
        {tab === 'dashboard' && <Dashboard rooms={rooms} reservations={reservations} payments={payments} clients={clients} revenueToday={revenueToday} occupiedRoomIds={occupiedRoomIds} setTab={setTab} clientOf={clientOf} />}
        {tab === 'painel' && <Painel dates={dates} periodStart={periodStart} setPeriodStart={setPeriodStart} periodDays={periodDays} setPeriodDays={setPeriodDays} groupByType={groupByType} setGroupByType={setGroupByType} roomTypes={roomTypes} rooms={rooms} reservations={reservations} blocks={blocks} expandedTypes={expandedTypes} setExpandedTypes={setExpandedTypes} setSelectedReserva={setSelectedReserva} setBlockModal={setBlockModal} clientOf={clientOf} moveReservation={moveReservation} dragSelection={dragSelection} setDragSelection={setDragSelection} createReservationByDrag={createReservationByDrag} />}
        {tab === 'reservas' && <Reservas newReservation={newReservation} setNewReservation={setNewReservation} roomTypes={roomTypes} availableRooms={availableRooms} saveReservation={saveReservation} clients={clients} reservations={reservations} clientOf={clientOf} roomOf={roomOf} balance={balance} setSelectedReserva={setSelectedReserva} setReceiveReserva={setReceiveReserva} doCheckin={doCheckin} />}
        {tab === 'recepcao' && <Recepcao rooms={rooms} roomTypes={roomTypes} reservations={reservations} roomStatus={roomStatus} clientOf={clientOf} roomOf={roomOf} setSelectedReserva={setSelectedReserva} setSelectedRoom={openRoom} setBlockModal={setBlockModal} moveReservation={moveReservation} />}
        {tab === 'clientes' && <Clientes clients={clients} setClients={setClients} newClient={newClient} setNewClient={setNewClient} saveClient={saveClient} reservations={reservations} />}
        {tab === 'hospedes' && <Hospedes reservations={reservations} clients={clients} guests={guests} setGuests={setGuests} clientOf={clientOf} roomOf={roomOf} logAction={logAction} notify={notify} />}
        {tab === 'usuarios' && <Usuarios usuarios={usuarios} setUsuarios={setUsuarios} usuarioForm={usuarioForm} setUsuarioForm={setUsuarioForm} notify={notify} logAction={logAction} />}
      {tab === 'precheckin' && <PreCheckin preBusca={preBusca} setPreBusca={setPreBusca} reservations={reservations} precheckins={precheckins} setPrecheckins={setPrecheckins} clientOf={clientOf} createPrecheckin={createPrecheckin} />}
        {tab === 'quartos' && <Quartos roomTypes={roomTypes} rooms={rooms} reservations={reservations} clients={clients} consumos={consumos} payments={payments} setConsumos={setConsumos} setPayments={setPayments} setSelectedRoom={openRoom} notify={notify} logAction={logAction} />}
        {tab === 'tarifas' && <Tarifas roomTypes={roomTypes} rateForm={rateForm} setRateForm={setRateForm} saveRate={saveRate} rates={rates} />}
        {tab === 'servicos' && <Servicos products={products} productForm={productForm} setProductForm={setProductForm} saveProduct={saveProduct} consumos={consumos} reservations={reservations} clients={clients} rooms={rooms} />}
        {tab === 'financeiro' && <Financeiro reservations={reservations} payments={payments} clients={clients} clientOf={clientOf} roomOf={roomOf} setReceiveReserva={setReceiveReserva} setCancelReserva={setCancelReserva} balance={balance} paidTotal={paidTotal} reservationTotal={reservationTotal} />}
        {tab === 'caixa' && <CaixaDiario payments={payments} consumos={consumos} reservations={reservations} clients={clients} clientOf={clientOf} roomOf={roomOf} />}
        {tab === 'relatorios' && <Relatorios reservations={reservations} payments={payments} clients={clients} rooms={rooms} clientOf={clientOf} roomOf={roomOf} printReceipt={printReceipt} />}
        {tab === 'auditoria' && <Auditoria auditLogs={auditLogs} />}
        {tab === 'config' && <Config roomTypes={roomTypes} rooms={rooms} clients={clients} reservations={reservations} payments={payments} exportSystemData={exportSystemData} clearOperationalData={clearOperationalData} restoreRoomDefaults={restoreRoomDefaults} paymentMethods={paymentMethods} methodForm={methodForm} setMethodForm={setMethodForm} savePaymentMethod={savePaymentMethod} togglePaymentMethod={togglePaymentMethod} />}
      </main>

      {selectedRoom && <RoomModal room={selectedRoom} status={roomStatus(selectedRoom)} reservations={reservations.filter(r => r.quartoId === selectedRoom.id).sort((a,b)=>a.entrada.localeCompare(b.entrada))} blocks={blocks.filter(b => b.quartoId === selectedRoom.id)} clientOf={clientOf} setSelectedReserva={setSelectedReserva} setBlockModal={setBlockModal} setRooms={setRooms} rooms={rooms} onClose={() => setSelectedRoom(null)} />}
      {selectedReserva && <ReservationModal r={selectedReserva} client={clientOf(selectedReserva)} room={roomOf(selectedReserva.quartoId)} diariaTotal={diariaTotal(selectedReserva)} servicesTotal={servicesTotal(selectedReserva.id)} total={reservationTotal(selectedReserva)} paid={paidTotal(selectedReserva.id)} balance={balance(selectedReserva)} payments={payments.filter(p => p.reservaId === selectedReserva.id)} consumos={consumos.filter(c => c.reservaId === selectedReserva.id)} guests={guests.filter(g => g.reservaId === selectedReserva.id)} onClose={() => setSelectedReserva(null)} onReceive={() => setReceiveReserva(selectedReserva)} onCancel={() => setCancelReserva(selectedReserva)} onCheckin={() => doCheckin(selectedReserva)} onCheckout={() => doCheckout(selectedReserva)} onPre={() => createPrecheckin(selectedReserva)} onService={() => setServiceReserva(selectedReserva)} onTransfer={() => setTransferReserva(selectedReserva)} onReschedule={() => setRescheduleReserva(selectedReserva)} onWhatsapp={() => sendReservationWhatsapp(selectedReserva)} onPrint={() => printReceipt(selectedReserva)} />}
      {receiveReserva && <ReceiveModal reserva={receiveReserva} client={clientOf(receiveReserva)} saldo={balance(receiveReserva)} paymentMethods={paymentMethods} onClose={() => setReceiveReserva(null)} onSave={receivePayment} />}
      {cancelReserva && <CancelModal reserva={cancelReserva} received={paidTotal(cancelReserva.id)} onClose={() => setCancelReserva(null)} onSave={cancelWithCredit} />}
      {rescheduleReserva && <RescheduleModal reserva={rescheduleReserva} rooms={rooms} roomTypes={roomTypes} roomOf={roomOf} availableRooms={availableRooms} onClose={() => setRescheduleReserva(null)} onSave={rescheduleReservation} />}
      {transferReserva && <TransferModal reserva={transferReserva} rooms={rooms} roomOf={roomOf} availableRooms={availableRooms} onClose={() => setTransferReserva(null)} onSave={transferRoom} />}
      {serviceReserva && <ServiceModal reserva={serviceReserva} client={clientOf(serviceReserva)} room={roomOf(serviceReserva.quartoId)} onClose={() => setServiceReserva(null)} onSave={saveConsumo} />}
      {blockModal && <BlockModal rooms={rooms} roomTypes={roomTypes} data={blockModal} onClose={() => setBlockModal(null)} onSave={saveBlock} />}
      {dragReservationRequest && <DragReservationModal data={dragReservationRequest} setData={setDragReservationRequest} onClose={() => setDragReservationRequest(null)} onSave={confirmDragReservation} />}
    </div>
  )
}


function DragReservationModal({ data, setData, onClose, onSave }) {
  const noites = Math.max(0.5, (Number(data.saidaSlot ?? dateToSlot(data.saida, 0)) - Number(data.entradaSlot ?? dateToSlot(data.entrada, 0))) / 2)
  return (
    <div className="modal-backdrop">
      <div className="modal-card clean-reservation-modal">
        <div className="modal-head">
          <div>
            <h3>Criar reserva</h3>
            <p>Quarto {data.roomNumber} · {data.tipo} · {data.periodoTexto || `${data.entrada} até ${data.saida}`} · {noites} diária{noites > 1 ? 's' : ''}</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="form-grid">
          <label className="full">Nome do cliente
            <input autoFocus value={data.nome} onChange={e => setData({ ...data, nome: e.target.value })} placeholder="Digite o nome completo" />
          </label>
          <label>Telefone/WhatsApp
            <input value={data.telefone} onChange={e => setData({ ...data, telefone: e.target.value })} placeholder="(91) 99999-9999" />
          </label>
          <label>CPF/CNPJ
            <input value={data.cpf} onChange={e => setData({ ...data, cpf: e.target.value })} placeholder="000.000.000-00" />
          </label>
        </div>
        <div className="actions modal-actions">
          <button className="ghost" onClick={onClose}>Cancelar</button>
          <button className="primary" onClick={() => onSave(data)}>Criar reserva</button>
        </div>
      </div>
    </div>
  )
}



function RoomAccountModal({ data, setData, rooms, reservations, clients, consumos, payments, onClose, onAdd, onReceive }) {
  const room = rooms.find(r => r.id === data.roomId) || {}
  const activeReservations = reservations.filter(r => r.quartoId === data.roomId && ['hospedado','confirmada','pendente'].includes(r.status))
  const reserva = reservations.find(r => r.id === data.reservaId) || activeReservations[0]
  const cliente = clients.find(c => c.id === reserva?.clienteId) || {}
  const itens = reserva ? consumos.filter(c => c.reservaId === reserva.id) : []
  const totalConsumo = itens.reduce((s, c) => s + Number(c.qtd || 1) * Number(c.valor || 0), 0)
  const pagoConsumo = reserva ? payments
    .filter(p => p.reservaId === reserva.id && p.tipo === 'recebimento' && String(p.observacao || '').toLowerCase().includes('consumo'))
    .reduce((s, p) => s + Number(p.valor || 0), 0) : 0
  const saldo = Math.max(0, totalConsumo - pagoConsumo)

  return (
    <div className="modal-backdrop">
      <div className="modal-card quarto-conta-modal">
        <div className="modal-head">
          <div>
            <h3>Quarto {room.numero}</h3>
            <p>{room.tipo} · {reserva ? `Reserva ${reserva.codigo} — ${cliente.nome || 'Cliente'}` : 'Sem reserva ativa'}</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {!reserva && (
          <div className="empty-room-account">
            <b>Quarto sem hospedagem ativa.</b>
            <span>Para lançar consumo, primeiro crie ou vincule uma reserva ao quarto.</span>
          </div>
        )}

        {reserva && (
          <>
            <div className="room-account-summary">
              <div><small>Total consumido</small><b>{BRL.format(totalConsumo)}</b></div>
              <div><small>Pago em consumo</small><b>{BRL.format(pagoConsumo)}</b></div>
              <div className={saldo > 0 ? 'saldo-devedor' : 'saldo-ok'}><small>Saldo consumo</small><b>{BRL.format(saldo)}</b></div>
            </div>

            <div className="form-grid">
              <label>Item / Produto
                <input value={data.item || ''} onChange={e => setData({ ...data, item: e.target.value })} placeholder="Ex: Água, refrigerante, almoço..." />
              </label>
              <label>Quantidade
                <input type="number" min="1" value={data.qtd || 1} onChange={e => setData({ ...data, qtd: e.target.value })} />
              </label>
              <label>Valor unitário
                <input value={data.valor || ''} onChange={e => setData({ ...data, valor: e.target.value })} placeholder="R$" />
              </label>
              {activeReservations.length > 1 && (
                <label>Reserva vinculada
                  <select value={data.reservaId || reserva.id} onChange={e => setData({ ...data, reservaId: e.target.value })}>
                    {activeReservations.map(r => <option key={r.id} value={r.id}>{r.codigo}</option>)}
                  </select>
                </label>
              )}
            </div>

            <div className="actions">
              <button onClick={() => onAdd({ ...data, reservaId: data.reservaId || reserva.id })}>Adicionar item</button>
              {saldo > 0 && <button className="primary" onClick={() => onReceive(reserva.id, saldo)}>Receber consumo</button>}
            </div>

            <h4>Itens consumidos no quarto</h4>
            <table className="data-table">
              <thead><tr><th>Data</th><th>Item</th><th>Qtd.</th><th>Valor</th><th>Total</th></tr></thead>
              <tbody>
                {itens.length === 0 && <tr><td colSpan="5">Nenhum consumo lançado.</td></tr>}
                {itens.map(c => (
                  <tr key={c.id}>
                    <td>{c.data}</td>
                    <td>{c.item}</td>
                    <td>{c.qtd}</td>
                    <td>{BRL.format(Number(c.valor || 0))}</td>
                    <td>{BRL.format(Number(c.qtd || 1) * Number(c.valor || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {saldo > 0 && <div className="checkout-warning">Checkout bloqueado enquanto houver consumo em aberto neste quarto.</div>}
          </>
        )}
      </div>
    </div>
  )
}


function Card({ label, value, sub, icon, color }) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><div><p>{label}</p><h3>{value}</h3><small>{sub}</small></div></div>
}


function Usuarios({ usuarios, setUsuarios, usuarioForm, setUsuarioForm, notify, logAction }) {
  function saveUsuario() {
    if (!usuarioForm.nome?.trim() || !usuarioForm.email?.trim() || !usuarioForm.perfil?.trim()) {
      notify('Informe nome, e-mail e perfil do usuário.')
      return
    }
    const novo = {
      id: id(),
      nome: usuarioForm.nome.trim(),
      email: usuarioForm.email.trim(),
      perfil: usuarioForm.perfil,
      ativo: usuarioForm.ativo !== false
    }
    setUsuarios([novo, ...usuarios])
    setUsuarioForm({ nome: '', email: '', perfil: 'Recepção', senha: '', ativo: true })
    logAction('Usuário cadastrado', `${novo.nome} - ${novo.perfil}`)
    notify('Usuário cadastrado.')
  }

  function toggleUsuario(uid) {
    setUsuarios(usuarios.map(u => u.id === uid ? { ...u, ativo: !u.ativo } : u))
  }

  return (
    <section className="usuarios-page grid-two">
      <div className="panel-card">
        <h3>Cadastrar usuário do sistema</h3>
        <p className="hint">Crie usuários para operar o sistema com perfil de acesso.</p>

        <div className="form-grid">
          <label>Nome*
            <input value={usuarioForm.nome} onChange={e => setUsuarioForm({ ...usuarioForm, nome: e.target.value })} placeholder="Nome do usuário" />
          </label>
          <label>E-mail*
            <input value={usuarioForm.email} onChange={e => setUsuarioForm({ ...usuarioForm, email: e.target.value })} placeholder="usuario@email.com" />
          </label>
          <label>Perfil*
            <select value={usuarioForm.perfil} onChange={e => setUsuarioForm({ ...usuarioForm, perfil: e.target.value })}>
              <option>Administrador</option>
              <option>Recepção</option>
              <option>Financeiro</option>
              <option>Serviços</option>
              <option>Consulta</option>
            </select>
          </label>
          <label>Senha inicial
            <input type="password" value={usuarioForm.senha} onChange={e => setUsuarioForm({ ...usuarioForm, senha: e.target.value })} placeholder="Opcional nesta versão" />
          </label>
        </div>

        <div className="actions">
          <button className="ghost" onClick={() => setUsuarioForm({ nome: '', email: '', perfil: 'Recepção', senha: '', ativo: true })}>Limpar</button>
          <button className="primary" onClick={saveUsuario}>Cadastrar usuário</button>
        </div>
      </div>

      <div className="panel-card">
        <h3>Usuários cadastrados</h3>
        <table className="data-table">
          <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td><b>{u.nome}</b></td>
                <td>{u.email || '-'}</td>
                <td>{u.perfil}</td>
                <td><span className={`pill ${u.ativo ? 'confirmada' : 'cancelada'}`}>{u.ativo ? 'Ativo' : 'Inativo'}</span></td>
                <td><button onClick={() => toggleUsuario(u.id)}>{u.ativo ? 'Desativar' : 'Ativar'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}


function Dashboard({ rooms, clients, reservations, payments, setTab }) {
  const today = todayISO()
  const ocupados = rooms.filter(q => reservations.some(r => r.quartoId === q.id && r.status === 'hospedado')).length
  const checkinsHoje = reservations.filter(r => r.entrada === today && r.status !== 'cancelada').length
  const checkoutsHoje = reservations.filter(r => r.saida === today && r.status !== 'cancelada').length
  const receitaDia = payments
    .filter(p => p.tipo === 'recebimento' && p.data === today)
    .reduce((s, p) => s + Number(p.valor || 0), 0)

  const recentes = [
    ...reservations.slice(0, 3).map(r => ({
      icon: '✓',
      color: 'blue',
      title: r.status === 'hospedado' ? 'Check-in realizado' : 'Nova reserva criada',
      desc: `${clients.find(c => c.id === r.clienteId)?.nome || 'Cliente'} · Quarto ${rooms.find(q => q.id === r.quartoId)?.numero || '-'}`,
      time: 'Hoje'
    })),
    ...payments.slice(0, 2).map(p => ({
      icon: '$',
      color: 'green',
      title: 'Pagamento recebido',
      desc: BRL.format(Number(p.valor || 0)),
      time: p.data === today ? 'Hoje' : p.data
    }))
  ].slice(0, 5)

  const metricCards = [
    {
      label: 'Quartos ocupados',
      value: ocupados,
      sub: `de ${rooms.length} quartos`,
      icon: '▭',
      color: 'blue',
      action: () => setTab('quartos')
    },
    {
      label: 'Check-ins hoje',
      value: checkinsHoje,
      sub: `${reservations.filter(r => r.entrada === today && r.status === 'pendente').length} pendentes`,
      icon: '↪',
      color: 'green',
      action: () => setTab('recepcao')
    },
    {
      label: 'Check-outs hoje',
      value: checkoutsHoje,
      sub: 'previstos para hoje',
      icon: '↩',
      color: 'orange',
      action: () => setTab('recepcao')
    },
    {
      label: 'Receita do dia',
      value: BRL.format(receitaDia),
      sub: `${payments.filter(p => p.tipo === 'recebimento' && p.data === today).length} pagamentos`,
      icon: '$',
      color: 'purple',
      action: () => setTab('financeiro')
    }
  ]

  const quickActions = [
    ['▣', 'Nova reserva', 'reservas'],
    ['↪', 'Check-in', 'recepcao'],
    ['↩', 'Check-out', 'recepcao'],
    ['☑', 'Pré check-in', 'precheckin'],
    ['▭', 'Ver quartos', 'quartos'],
    ['$', 'Caixa diário', 'caixa']
  ]

  return (
    <section className="dashboard-clean">
      <div className="dashboard-welcome">
        <div>
          <h2>Olá, Administrador</h2>
          <p>Resumo operacional do Hotel Brisas</p>
        </div>
        <div className="dashboard-date-pill">
          <span>▣</span>
          <b>{today.split('-').reverse().join('/')}</b>
        </div>
      </div>

      <div className="clean-metrics-grid">
        {metricCards.map(card => (
          <button key={card.label} className={`clean-metric-card ${card.color}`} onClick={card.action}>
            <div className="clean-metric-icon">{card.icon}</div>
            <div>
              <small>{card.label}</small>
              <strong>{card.value}</strong>
              <span>{card.sub}</span>
            </div>
            <em>›</em>
          </button>
        ))}
      </div>

      <div className="dashboard-clean-grid">
        <div className="clean-panel clean-activities">
          <div className="clean-panel-head">
            <div>
              <h3>Atividades recentes</h3>
              <p>Últimas movimentações importantes do hotel</p>
            </div>
            <span>☰</span>
          </div>

          <div className="activity-list">
            {recentes.length === 0 && (
              <div className="empty-state-clean">
                <b>Nenhuma atividade registrada ainda.</b>
                <span>As reservas, check-ins e pagamentos aparecerão aqui.</span>
              </div>
            )}

            {recentes.map((item, index) => (
              <div className="activity-row" key={`${item.title}-${index}`}>
                <div className={`activity-icon ${item.color}`}>{item.icon}</div>
                <div>
                  <b>{item.title}</b>
                  <span>{item.desc}</span>
                </div>
                <time>{item.time}</time>
              </div>
            ))}
          </div>
        </div>

        <div className="clean-panel clean-actions">
          <div className="clean-panel-head">
            <div>
              <h3>Ações rápidas</h3>
              <p>Acesse as operações mais usadas</p>
            </div>
            <span>⚡</span>
          </div>

          <div className="quick-clean-grid">
            {quickActions.map(([icon, label, tab]) => (
              <button key={label} onClick={() => setTab(tab)}>
                <i>{icon}</i>
                <b>{label}</b>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


function Painel({ dates, periodStart, setPeriodStart, periodDays, setPeriodDays, groupByType, setGroupByType, roomTypes, rooms, reservations, blocks, expandedTypes, setExpandedTypes, setSelectedReserva, setBlockModal, clientOf, moveReservation, dragSelection, setDragSelection, createReservationByDrag }) {
  const [zoom, setZoom] = useState('normal')
  const [onlyProblems, setOnlyProblems] = useState(false)
  const activeReservations = reservations.filter(r => !['cancelada', 'checkout'].includes(r.status))
  const groups = groupByType ? roomTypes.map(t => ({ id: t.id, nome: t.nome, rooms: rooms.filter(q => q.tipoId === t.id) })).filter(g => g.rooms.length) : [{ id: 'todos', nome: 'Todos os quartos', rooms }]
  const isOccupied = (q, d) => activeReservations.some(r => r.quartoId === q.id && dateToSlot(d, 0) < reservationEndSlot(r) && dateToSlot(d, 1) + 1 > reservationStartSlot(r))
  const dayOcc = (d) => rooms.length ? Math.round((rooms.filter(q => isOccupied(q, d)).length / rooms.length) * 100) : 0
  const problems = activeReservations.filter(r => !r.quartoId || r.entrada >= r.saida)

  function reservationOn(q, d) {
    return activeReservations.find(r => r.quartoId === q.id && dateToSlot(d, 0) < reservationEndSlot(r) && dateToSlot(d, 1) + 1 > reservationStartSlot(r))
  }
  function blockOn(q, d) {
    return blocks.find(b => b.quartoId === q.id && dateToSlot(d, 0) < blockEndSlot(b) && dateToSlot(d, 1) + 1 > blockStartSlot(b))
  }

  function halfFromEvent(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    return (e.clientX - rect.left) < rect.width / 2 ? 0 : 1
  }

  function halfHasReservation(q, d, half) {
    const s = dateToSlot(d, half)
    return activeReservations.some(r => r.quartoId === q.id && s < reservationEndSlot(r) && (s + 1) > reservationStartSlot(r))
  }

  function halfHasBlock(q, d, half) {
    const s = dateToSlot(d, half)
    return blocks.some(b => b.quartoId === q.id && s < blockEndSlot(b) && (s + 1) > blockStartSlot(b))
  }

  function isSelectedHalf(q, d, half) {
    if (!dragSelection || dragSelection.roomId !== q.id) return false
    const slot = dateToSlot(d, half)
    const a = Math.min(dragSelection.startSlot, dragSelection.endSlot)
    const b = Math.max(dragSelection.startSlot, dragSelection.endSlot)
    return slot >= a && slot <= b
  }

  function startCellSelection(q, d, e) {
    const half = halfFromEvent(e)
    if (halfHasReservation(q, d, half) || halfHasBlock(q, d, half)) return
    const slot = dateToSlot(d, half)
    setDragSelection({ roomId: q.id, startSlot: slot, endSlot: slot })
  }

  function moveCellSelection(q, d, e) {
    if (!dragSelection || dragSelection.roomId !== q.id) return
    const slot = dateToSlot(d, halfFromEvent(e))
    setDragSelection({ ...dragSelection, endSlot: slot })
  }

  function finishCellSelection(q, d, e) {
    if (!dragSelection || dragSelection.roomId !== q.id) return
    const slot = dateToSlot(d, halfFromEvent(e))
    const current = { ...dragSelection, endSlot: slot }
    setDragSelection(null)
    const a = Math.min(current.startSlot, current.endSlot)
    const b = Math.max(current.startSlot, current.endSlot)
    for (let s = a; s <= b; s += 1) {
      const date = slotToDate(s)
      const half = s % 2
      if (halfHasReservation(q, date, half) || halfHasBlock(q, date, half)) return
    }
    createReservationByDrag(q.id, current.startSlot, current.endSlot)
  }

  return <section className="panel-card painel-profissional">
    <div className="card-head sticky-head"><div><h3>Painel de reservas profissional</h3><p className="hint">Visual por período, agrupado por categoria. Arraste uma reserva para outro quarto livre no mesmo período.</p></div><div className="actions"><button onClick={()=>setOnlyProblems(!onlyProblems)}>{onlyProblems?'Ver todos':'Ver conflitos'}</button><button className="primary" onClick={() => setBlockModal({quartoId: rooms[0]?.id || '', inicio: periodStart, fim: addDays(periodStart,1), motivo: ''})}>Bloquear dia</button></div></div>
    <div className="timeline-tools"><label>Início<input type="date" value={periodStart} onChange={e=>setPeriodStart(e.target.value)}/></label><label>Dias<select value={periodDays} onChange={e=>setPeriodDays(e.target.value)}><option>7</option><option>14</option><option>21</option><option>30</option><option>45</option></select></label><label>Visual<select value={zoom} onChange={e=>setZoom(e.target.value)}><option value="compacto">Compacto</option><option value="normal">Normal</option><option value="grande">Grande</option></select></label><label className="switch"><input type="checkbox" checked={groupByType} onChange={e=>setGroupByType(e.target.checked)}/> Agrupar por tipo</label></div>
    <div className="occupancy-ruler">{dates.map(d=><div key={d} className="occ-day"><b>{dayOcc(d)}%</b><span>{d.slice(5).split('-').reverse().join('/')}</span><i style={{height:`${Math.max(8, dayOcc(d))}%`}}></i></div>)}</div>
    {onlyProblems && <div className="info-box"><b>Conflitos encontrados:</b> {problems.length || 'nenhum'}. Reservas sem quarto, datas invertidas ou sobrepostas aparecem aqui quando existirem.</div>}
    <div className={`reservation-board ${zoom}`}>
      <div className="board-header"><div className="room-col">Quarto / tipo</div>{dates.map(d=><div className="date-col" key={d}><b>{new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')}</b><span>{d.slice(8)}/{d.slice(5,7)}</span></div>)}</div>
      {groups.map(g => <div className="type-group" key={g.id}>
        <button className="type-row" onClick={()=>setExpandedTypes({...expandedTypes, [g.id]: !expandedTypes[g.id]})}><b>{g.nome}</b><span>{g.rooms.length} quartos · {activeReservations.filter(r=>g.rooms.some(q=>q.id===r.quartoId)).length} reservas</span></button>
        {(expandedTypes[g.id] !== false) && g.rooms.map(q => <div className="board-row" key={q.id} onDragOver={e=>e.preventDefault()} onDrop={e=>moveReservation(e.dataTransfer.getData('text/reserva'), q.id)}>
          <div className="room-col"><b>{q.numero}</b><span>{q.andar}</span></div>
          {dates.map(d => { const r = reservationOn(q,d); const b = blockOn(q,d); const isStart = r && slotToDate(reservationStartSlot(r)) === d; const selectedFirst = isSelectedHalf(q,d,0); const selectedSecond = isSelectedHalf(q,d,1); const halfReservation = (half) => r && dateToSlot(d, half) < reservationEndSlot(r) && (dateToSlot(d, half) + 1) > reservationStartSlot(r); const firstBusy = halfReservation(0); const secondBusy = halfReservation(1); return <div className={`date-col cell half-cell ${(selectedFirst || selectedSecond) ? 'cell-selected' : ''}`} key={d} onMouseDown={(e)=>startCellSelection(q,d,e)} onMouseEnter={(e)=>moveCellSelection(q,d,e)} onMouseUp={(e)=>finishCellSelection(q,d,e)} onDoubleClick={()=>setBlockModal({quartoId:q.id,inicio:d,fim:addDays(d,1),motivo:'Bloqueio manual'})}>
            <div className={`half-zone left ${selectedFirst ? 'half-selected' : ''}`}></div><div className={`half-zone right ${selectedSecond ? 'half-selected' : ''}`}></div>
            {r ? <button draggable onDragStart={e=>e.dataTransfer.setData('text/reserva', r.id)} onClick={()=>setSelectedReserva(r)} className={`booking-chip ${r.status} ${isStart?'start':''} ${firstBusy && !secondBusy ? 'half-left' : !firstBusy && secondBusy ? 'half-right' : ''}`}>{isStart ? <><b>{r.codigo}</b><span>{clientOf(r).nome.split(' ')[0]}</span></> : '→'}</button> : b ? <span className="block-chip">Bloq.</span> : <span className="free-dot">·</span>}</div>})}
        </div>)}
      </div>)}
    </div>
  </section>
}

function Reservas({ newReservation, setNewReservation, roomTypes, availableRooms, saveReservation, clients, reservations, clientOf, roomOf, balance, setSelectedReserva, setReceiveReserva, doCheckin }) {
  const tipo = roomTypes.find(t => t.id === newReservation.tipoId)
  const quartosDisponiveis = availableRooms()
  return <section className="grid-two">
    <div className="panel-card"><h3>Criar reserva</h3><div className="form-grid">
      <label>Canal de venda<select value={newReservation.canal} onChange={e=>setNewReservation({...newReservation, canal:e.target.value})}><option>Direto</option><option>WhatsApp</option><option>Telefone</option><option>Booking</option></select></label>
      <label>Agência/origem<input value={newReservation.origem} onChange={e=>setNewReservation({...newReservation, origem:e.target.value})}/></label>
      <label>Tipo de quarto<select value={newReservation.tipoId} onChange={e=>{const t=roomTypes.find(x=>x.id===e.target.value);setNewReservation({...newReservation,tipoId:e.target.value, diaria:t?.diaria||0, quartoId:''})}}>{roomTypes.map(t=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></label>
      <label>Quarto disponível<select value={newReservation.quartoId} onChange={e=>setNewReservation({...newReservation, quartoId:e.target.value})}><option value="">Selecione</option>{quartosDisponiveis.map(q=><option key={q.id} value={q.id}>Quarto {q.numero} - {q.andar}</option>)}</select></label>
      <label>Entrada<input type="date" value={newReservation.entrada} onChange={e=>setNewReservation({...newReservation, entrada:e.target.value, quartoId:''})}/></label>
      <label>Saída<input type="date" value={newReservation.saida} onChange={e=>setNewReservation({...newReservation, saida:e.target.value, quartoId:''})}/></label>
      <label>Adultos<input type="number" value={newReservation.adultos} onChange={e=>setNewReservation({...newReservation, adultos:e.target.value})}/></label>
      <label>Crianças<input type="number" value={newReservation.criancas} onChange={e=>setNewReservation({...newReservation, criancas:e.target.value})}/></label>
      <label>Total de diárias<input value={BRL.format(diffDays(newReservation.entrada,newReservation.saida)*Number(newReservation.diaria||tipo?.diaria||0))} readOnly /></label>
      <label>Valor diária<input value={newReservation.diaria} onChange={e=>setNewReservation({...newReservation, diaria:e.target.value})}/></label>
      <label>Cliente cadastrado<select value={newReservation.clienteId} onChange={e=>setNewReservation({...newReservation, clienteId:e.target.value})}><option value="">Novo cliente</option>{clients.map(c=><option key={c.id} value={c.id}>{c.nome} {c.credito>0?`- crédito ${BRL.format(c.credito)}`:''}</option>)}</select></label>
      {!newReservation.clienteId && <><label>Nome do contratante<input value={newReservation.nome} onChange={e=>setNewReservation({...newReservation, nome:e.target.value})}/></label><label>CPF/CNPJ<input value={newReservation.cpf} onChange={e=>setNewReservation({...newReservation, cpf:e.target.value})}/></label><label>Telefone/WhatsApp<input value={newReservation.telefone} onChange={e=>setNewReservation({...newReservation, telefone:e.target.value})}/></label><label>E-mail<input value={newReservation.email} onChange={e=>setNewReservation({...newReservation, email:e.target.value})}/></label></>}
      <label className="full">Observação<textarea value={newReservation.observacao} onChange={e=>setNewReservation({...newReservation, observacao:e.target.value})}></textarea></label>
    </div><div className="actions"><button className="ghost" onClick={() => setNewReservation({
        tipoId: 'triplo', quartoId: '', clienteId: '', nome: '', cpf: '', telefone: '', email: '',
        entrada: todayISO(), saida: addDays(todayISO(), 1), adultos: 2, criancas: 0, diaria: 300, canal: 'Direto', origem: 'Direto - recepção', observacao: ''
      })}>Descartar</button><button type="button" className="primary" onClick={(e) => saveReservation(e)}>Reservar</button></div><p className="hint">Regra: o check-in só libera quando o saldo da reserva estiver pago.</p></div>
    <div className="panel-card"><h3>Lista de reservas</h3><table className="data-table"><thead><tr><th>Código</th><th>Cliente</th><th>Quarto</th><th>Saldo</th><th>Status</th><th>Ações</th></tr></thead><tbody>{reservations.map(r=><tr key={r.id}><td>{r.codigo}</td><td>{clientOf(r).nome}</td><td>{roomOf(r.quartoId).numero}</td><td>{BRL.format(balance(r))}</td><td><span className={`pill ${r.status}`}>{r.status}</span></td><td><button onClick={()=>setSelectedReserva(r)}>Abrir</button><button onClick={()=>setReceiveReserva(r)}>Receber</button><button onClick={()=>doCheckin(r)}>Check-in</button></td></tr>)}</tbody></table></div>
  </section>
}

function Recepcao({ rooms, roomTypes, reservations, roomStatus, clientOf, setSelectedReserva, setSelectedRoom, setBlockModal, moveReservation }) {
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroAndar, setFiltroAndar] = useState('todos')
  const andares = [...new Set(rooms.map(q => q.andar))]
  const filtrados = rooms.filter(q => (filtroTipo === 'todos' || q.tipoId === filtroTipo) && (filtroAndar === 'todos' || q.andar === filtroAndar))
  const grupos = andares.map(andar => ({ andar, quartos: filtrados.filter(q => q.andar === andar) })).filter(g => g.quartos.length)
  const ocupados = rooms.filter(q => roomStatus(q)[0] === 'status-blue').length
  const futuras = rooms.filter(q => roomStatus(q)[0] === 'status-green').length
  const verificar = rooms.filter(q => roomStatus(q)[0] === 'status-orange').length

  return <section className="panel-card recepcao-fast">
    <div className="card-head"><div><h3>Mapa visual de quartos</h3><p className="hint">Clique no quarto ocupado/reservado para abrir a reserva. Arraste uma reserva do painel para trocar de quarto. Dois cliques bloqueia.</p></div><button className="primary" onClick={() => setBlockModal({quartoId: rooms[0]?.id || '', inicio: todayISO(), fim: addDays(todayISO(),1), motivo: ''})}>Bloquear quarto</button></div>
    <div className="fast-status-strip"><div><b>{rooms.length}</b><span>Total</span></div><div><b>{ocupados}</b><span>Alugados</span></div><div><b>{futuras}</b><span>Reservas futuras</span></div><div><b>{verificar}</b><span>Verificar saída</span></div><div><b>{rooms.length - ocupados - futuras - verificar}</b><span>Disponíveis</span></div></div>
    <div className="filters-line"><label>Tipo de quarto<select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)}><option value="todos">Todos</option>{roomTypes.map(t=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></label><label>Andar<select value={filtroAndar} onChange={e=>setFiltroAndar(e.target.value)}><option value="todos">Todos</option>{andares.map(a=><option key={a}>{a}</option>)}</select></label></div>
    <div className="legend"><span className="box status-free"></span> Disponível <span className="box status-green"></span> Reserva futura <span className="box status-blue"></span> Alugado/Check-in <span className="box status-orange"></span> Verificar saída <span className="box status-red"></span> Bloqueado</div>
    {grupos.map(g => <div className="floor-section" key={g.andar}><h4>{g.andar}</h4><div className="rooms-grid fast-map">
      {g.quartos.map(q => { const [cls, label] = roomStatus(q); const r = reservations.find(x => x.quartoId === q.id && !['cancelada','checkout'].includes(x.status)); return <button key={q.id} className={`room-card ${cls}`} onDragOver={e=>e.preventDefault()} onDrop={e=>moveReservation(e.dataTransfer.getData('reservaId'), q.id)} onClick={()=> r ? setSelectedReserva(r) : setSelectedRoom(q)} onDoubleClick={()=>setBlockModal({quartoId:q.id,inicio:todayISO(),fim:addDays(todayISO(),1),motivo:''})}><strong>{q.numero}</strong><small>{q.tipo}</small><span>{label}</span>{r && <em>{r.codigo} · {clientOf(r).nome.split(' ')[0]}</em>}</button>})}
    </div></div>)}
  </section>
}

function Clientes({ clients, setClients, newClient, setNewClient, saveClient, reservations }) {
  return <section className="grid-two"><div className="panel-card"><h3>Cadastrar cliente</h3><div className="form-grid">{['nome','cpf','telefone','email','nascimento','endereco'].map(k=><label key={k}>{k.toUpperCase()}<input type={k==='nascimento'?'date':'text'} value={newClient[k]} onChange={e=>setNewClient({...newClient,[k]:e.target.value})}/></label>)}<label className="full">Observação<textarea value={newClient.observacao} onChange={e=>setNewClient({...newClient,observacao:e.target.value})}></textarea></label></div><button className="primary" onClick={saveClient}>Salvar cliente</button></div><div className="panel-card"><h3>Clientes / crédito</h3><table className="data-table"><thead><tr><th>Cliente</th><th>Documento</th><th>Telefone</th><th>Crédito</th><th>Reservas</th></tr></thead><tbody>{clients.map(c=><tr key={c.id}><td><b>{c.nome}</b>{c.vip&&<span className="vip">VIP</span>}</td><td>{c.cpf}</td><td>{c.telefone}</td><td>{BRL.format(Number(c.credito||0))}</td><td>{reservations.filter(r=>r.clienteId===c.id).length}</td></tr>)}</tbody></table></div></section>
}


function Hospedes({ reservations, clients, guests, setGuests, clientOf, roomOf, logAction, notify }) {
  const reservasAtivas = reservations.filter(r => !['cancelada', 'checkout'].includes(r.status))
  const [form, setForm] = useState({ reservaId: '', nome: '', documento: '', nascimento: '', telefone: '', endereco: '', tipo: 'Acompanhante', observacao: '' })
  const reserva = reservasAtivas.find(r => r.id === form.reservaId)
  function saveGuest() {
    if (!form.reservaId) return notify('Selecione a reserva para vincular o hóspede.')
    if (!form.nome.trim()) return notify('Informe o nome completo do hóspede.')
    if (!form.documento.trim()) return notify('Informe o documento com foto do hóspede.')
    if (!form.nascimento) return notify('Informe a data de nascimento do hóspede.')
    const novo = { id: id(), ...form, criadoEm: todayISO() }
    setGuests([novo, ...guests])
    setForm({ reservaId: form.reservaId, nome: '', documento: '', nascimento: '', telefone: '', endereco: '', tipo: 'Acompanhante', observacao: '' })
    logAction('Hóspede vinculado', `${novo.nome} vinculado à reserva ${reserva?.codigo || novo.reservaId}.`)
    notify('Hóspede vinculado à reserva.')
  }
  return <section className="grid-two">
    <div className="panel-card"><h3>Cadastro de hóspedes por reserva</h3><p className="hint">Use para registrar contratante, acompanhantes e documentos obrigatórios. O pré check-in também pode trazer esses dados.</p><div className="form-grid">
      <label>Reserva<select value={form.reservaId} onChange={e=>setForm({...form,reservaId:e.target.value})}><option value="">Selecione</option>{reservasAtivas.map(r=><option key={r.id} value={r.id}>{r.codigo} - {clientOf(r).nome} - quarto {roomOf(r.quartoId).numero}</option>)}</select></label>
      <label>Tipo<select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}><option>Contratante</option><option>Acompanhante</option><option>Criança</option><option>Visitante</option></select></label>
      <label>Nome completo<input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/></label>
      <label>Documento com foto<input value={form.documento} onChange={e=>setForm({...form,documento:e.target.value})} placeholder="RG, CPF, CNH ou passaporte"/></label>
      <label>Data de nascimento<input type="date" value={form.nascimento} onChange={e=>setForm({...form,nascimento:e.target.value})}/></label>
      <label>Telefone<input value={form.telefone} onChange={e=>setForm({...form,telefone:e.target.value})}/></label>
      <label className="full">Endereço<input value={form.endereco} onChange={e=>setForm({...form,endereco:e.target.value})}/></label>
      <label className="full">Observação<textarea value={form.observacao} onChange={e=>setForm({...form,observacao:e.target.value})}></textarea></label>
    </div><button className="primary" onClick={saveGuest}>Vincular hóspede</button></div>
    <div className="panel-card"><h3>Hóspedes cadastrados</h3><table className="data-table"><thead><tr><th>Reserva</th><th>Quarto</th><th>Nome</th><th>Documento</th><th>Tipo</th></tr></thead><tbody>{guests.length ? guests.map(g=>{const r=reservations.find(x=>x.id===g.reservaId);return <tr key={g.id}><td>{r?.codigo || '-'}</td><td>{r ? roomOf(r.quartoId).numero : '-'}</td><td><b>{g.nome}</b></td><td>{g.documento}</td><td>{g.tipo}</td></tr>}) : <tr><td colSpan="5">Nenhum hóspede cadastrado ainda.</td></tr>}</tbody></table></div>
  </section>
}

function PreCheckin({ preBusca, setPreBusca, reservations, precheckins, setPrecheckins, clientOf, createPrecheckin }) {
  const reserva = reservations.find(r => r.codigo === preBusca)
  return <section className="grid-two"><div className="panel-card"><h3>Pré check-in por número da reserva</h3><div className="search-reserva"><input value={preBusca} onChange={e=>setPreBusca(e.target.value)} placeholder="Digite o número da reserva" /></div>{reserva ? <div className="pre-box"><h3>Reserva {reserva.codigo}</h3><p>{clientOf(reserva).nome}</p><p>Obrigatório para o cliente: nome completo, selfie, documento com foto, endereço, data de nascimento e observação.</p><button className="primary" onClick={()=>createPrecheckin(reserva)}>Enviar link pelo WhatsApp</button></div> : <p className="hint">Digite o código para localizar a reserva.</p>}</div><div className="panel-card"><h3>Links enviados</h3><table className="data-table"><thead><tr><th>Reserva</th><th>Status</th><th>Link</th><th>Data</th></tr></thead><tbody>{precheckins.map(p=><tr key={p.id}><td>{p.codigo}</td><td><span className="pill confirmada">{p.status}</span></td><td><input value={p.link} readOnly /></td><td>{p.data}</td></tr>)}</tbody></table></div></section>
}

function Quartos({ roomTypes = [], rooms = [], reservations = [], clients = [], consumos = [], payments = [], setConsumos = () => {}, setPayments = () => {}, setSelectedRoom = () => {}, notify = () => {}, logAction = () => {} }) {
  const [roomAccount, setRoomAccount] = useState(null)

  function tipoNome(room) {
    return room.tipo || roomTypes.find(t => t.id === room.tipoId)?.nome || 'Quarto'
  }

  function activeReservation(roomId) {
    return reservations.find(r => r.quartoId === roomId && ['hospedado','confirmada','pendente'].includes(r.status))
  }

  function clienteDaReserva(r) {
    return clients.find(c => c.id === r?.clienteId) || { nome: 'Cliente' }
  }

  function statusRoom(room) {
    const r = activeReservation(room.id)
    if (room.status === 'manutencao') return 'manutencao'
    if (room.status === 'limpeza') return 'limpeza'
    if (r?.status === 'hospedado') return 'ocupado'
    if (r) return 'reservado'
    return 'livre'
  }

  function consumosReserva(reservaId) {
    return consumos.filter(c => c.reservaId === reservaId)
  }

  function totalConsumo(reservaId) {
    return consumosReserva(reservaId).reduce((s, c) => s + Number(c.qtd || 1) * Number(c.valor || 0), 0)
  }

  function pagoConsumo(reservaId) {
    return payments
      .filter(p => p.reservaId === reservaId && p.tipo === 'recebimento' && String(p.observacao || '').toLowerCase().includes('consumo'))
      .reduce((s, p) => s + Number(p.valor || 0), 0)
  }

  function abrirConta(room) {
    const r = activeReservation(room.id)
    setRoomAccount({
      roomId: room.id,
      reservaId: r?.id || '',
      item: '',
      qtd: 1,
      valor: ''
    })
  }

  function adicionarConsumo() {
    const room = rooms.find(q => q.id === roomAccount.roomId)
    const reserva = reservations.find(r => r.id === roomAccount.reservaId) || activeReservation(roomAccount.roomId)
    if (!reserva) return notify('Esse quarto não possui reserva ativa para lançar consumo.')
    if (!roomAccount.item || !roomAccount.item.trim()) return notify('Informe o item consumido.')
    const valor = moneyNumber(roomAccount.valor)
    if (valor <= 0) return notify('Informe o valor do item.')
    const novo = {
      id: id(),
      reservaId: reserva.id,
      data: todayISO(),
      item: roomAccount.item.trim(),
      qtd: Number(roomAccount.qtd || 1),
      valor
    }
    setConsumos([novo, ...consumos])
    setRoomAccount({ ...roomAccount, item: '', qtd: 1, valor: '' })
    logAction?.('Consumo lançado no quarto', `${room?.numero}: ${novo.item} x${novo.qtd} - ${BRL.format(valor)}`)
    notify('Consumo lançado no quarto.')
  }

  function receberConsumo(reservaId) {
    const saldo = Math.max(0, totalConsumo(reservaId) - pagoConsumo(reservaId))
    if (saldo <= 0) return notify('Não há consumo em aberto.')
    setPayments([{
      id: id(),
      reservaId,
      tipo: 'recebimento',
      forma: 'PIX',
      valor: saldo,
      data: todayISO(),
      observacao: 'Recebimento de consumo do quarto'
    }, ...payments])
    notify('Consumo recebido.')
  }

  const room = roomAccount ? rooms.find(q => q.id === roomAccount.roomId) : null
  const reserva = room ? (reservations.find(r => r.id === roomAccount.reservaId) || activeReservation(room.id)) : null
  const cliente = clienteDaReserva(reserva)
  const itens = reserva ? consumosReserva(reserva.id) : []
  const total = reserva ? totalConsumo(reserva.id) : 0
  const pago = reserva ? pagoConsumo(reserva.id) : 0
  const saldo = Math.max(0, total - pago)

  const statusText = {
    livre: 'Livre',
    reservado: 'Reservado',
    ocupado: 'Ocupado',
    limpeza: 'Limpeza',
    manutencao: 'Manutenção'
  }

  return (
    <section className="panel-card quartos-situacao-page">
      <div className="quartos-title-line">
        <div>
          <h3>Painel de situação atual</h3>
          <p className="hint">Clique no quarto para abrir conta, ver consumos e lançar itens manualmente.</p>
        </div>
        <div className="quartos-legend">
          <span><i className="q-livre"></i>Livre</span>
          <span><i className="q-reservado"></i>Reservado</span>
          <span><i className="q-ocupado"></i>Ocupado</span>
          <span><i className="q-limpeza"></i>Limpeza</span>
          <span><i className="q-manutencao"></i>Manutenção</span>
        </div>
      </div>

      <div className="quartos-situacao-grid">
        {rooms.map(room => {
          const st = statusRoom(room)
          const r = activeReservation(room.id)
          const debt = r ? Math.max(0, totalConsumo(r.id) - pagoConsumo(r.id)) : 0
          return (
            <button
              key={room.id}
              className={`situacao-room-card ${st}`}
              onClick={() => abrirConta(room)}
              onDoubleClick={() => setSelectedRoom?.(room)}
            >
              <strong>{room.numero}</strong>
              <span>{tipoNome(room)}</span>
              <em>{statusText[st]}</em>
              {r && <small>{r.codigo}</small>}
              {debt > 0 && <b className="debt-badge">{BRL.format(debt)}</b>}
            </button>
          )
        })}
      </div>

      {roomAccount && room && (
        <div className="modal-backdrop">
          <div className="modal-card quarto-conta-modal">
            <div className="modal-head">
              <div>
                <h3>Quarto {room.numero}</h3>
                <p>{tipoNome(room)} · {reserva ? `Reserva ${reserva.codigo} — ${cliente.nome}` : 'Sem reserva ativa'}</p>
              </div>
              <button className="modal-close" onClick={() => setRoomAccount(null)}>×</button>
            </div>

            {!reserva && (
              <div className="empty-room-account">
                <b>Quarto sem reserva ativa.</b>
                <span>Para lançar consumo, primeiro crie ou vincule uma reserva ao quarto.</span>
              </div>
            )}

            {reserva && (
              <>
                <div className="room-account-summary">
                  <div><small>Total consumido</small><b>{BRL.format(total)}</b></div>
                  <div><small>Pago</small><b>{BRL.format(pago)}</b></div>
                  <div className={saldo > 0 ? 'saldo-devedor' : 'saldo-ok'}><small>Saldo</small><b>{BRL.format(saldo)}</b></div>
                </div>

                <div className="form-grid room-consumo-form">
                  <label>Item / Produto
                    <input value={roomAccount.item} onChange={e => setRoomAccount({ ...roomAccount, item: e.target.value })} placeholder="Ex: Água, refrigerante, almoço..." />
                  </label>
                  <label>Qtd.
                    <input type="number" min="1" value={roomAccount.qtd} onChange={e => setRoomAccount({ ...roomAccount, qtd: e.target.value })} />
                  </label>
                  <label>Valor unitário
                    <input value={roomAccount.valor} onChange={e => setRoomAccount({ ...roomAccount, valor: e.target.value })} placeholder="R$" />
                  </label>
                </div>

                <div className="actions room-account-actions">
                  <button onClick={adicionarConsumo}>Adicionar item</button>
                  {saldo > 0 && <button className="primary" onClick={() => receberConsumo(reserva.id)}>Receber consumo</button>}
                </div>

                <h4>Itens consumidos no quarto</h4>
                <table className="data-table">
                  <thead><tr><th>Data</th><th>Item</th><th>Qtd.</th><th>Valor</th><th>Total</th></tr></thead>
                  <tbody>
                    {itens.length === 0 && <tr><td colSpan="5">Nenhum consumo lançado.</td></tr>}
                    {itens.map(c => (
                      <tr key={c.id}>
                        <td>{c.data}</td>
                        <td>{c.item}</td>
                        <td>{c.qtd}</td>
                        <td>{BRL.format(Number(c.valor || 0))}</td>
                        <td>{BRL.format(Number(c.qtd || 1) * Number(c.valor || 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {saldo > 0 && <div className="checkout-warning">Checkout bloqueado enquanto houver consumo em aberto neste quarto.</div>}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}


function Tarifas({ roomTypes, rateForm, setRateForm, saveRate, rates }) {
  const tipoLabel = rateForm.tipoId === 'todos'
    ? 'Todos os quartos'
    : roomTypes.find(t => t.id === rateForm.tipoId)?.nome || 'Tipo selecionado'

  return (
    <section className="grid-two tarifas-page">
      <div className="panel-card">
        <h3>Criar e modificar tarifas massivamente</h3>
        <p className="hint">Aplique uma tarifa para um tipo específico ou para todos os quartos do hotel.</p>

        <div className="tarifa-alert">
          <b>Aplicação atual:</b>
          <span>{tipoLabel}</span>
        </div>

        <div className="form-grid">
          <label>Ação
            <select value={rateForm.acao} onChange={e => setRateForm({ ...rateForm, acao: e.target.value })}>
              <option value="criar">Criar ou modificar</option>
              <option value="remover">Remover tarifa</option>
            </select>
          </label>

          <label>Aplicar tarifa em*
            <select value={rateForm.tipoId} onChange={e => setRateForm({ ...rateForm, tipoId: e.target.value })}>
              <option value="todos">Todos os quartos</option>
              {roomTypes.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </label>

          <label>Data inicial
            <input type="date" value={rateForm.inicio} onChange={e => setRateForm({ ...rateForm, inicio: e.target.value })} />
          </label>

          <label>Data final
            <input type="date" value={rateForm.fim} onChange={e => setRateForm({ ...rateForm, fim: e.target.value })} />
          </label>

          <label>Valor da tarifa
            <input value={rateForm.valor} onChange={e => setRateForm({ ...rateForm, valor: e.target.value })} placeholder="R$" />
          </label>

          <label>Qtd. adultos
            <input value="Indiferente" readOnly />
          </label>
        </div>

        <div className="week-days">
          {['D','S','T','Q','Q','S','S'].map((d, i) => (
            <label key={i}>
              <input
                type="checkbox"
                checked={rateForm.diasSemana.includes(String(i))}
                onChange={e => {
                  const v = String(i)
                  setRateForm({
                    ...rateForm,
                    diasSemana: e.target.checked
                      ? [...rateForm.diasSemana, v]
                      : rateForm.diasSemana.filter(x => x !== v)
                  })
                }}
              />
              {d}
            </label>
          ))}
        </div>

        <div className="actions">
          <button className="ghost" onClick={() => setRateForm({ ...rateForm, valor: '' })}>Limpar</button>
          <button className="primary" onClick={saveRate}>Salvar tarifa</button>
        </div>
      </div>

      <div className="panel-card">
        <h3>Tarifas cadastradas</h3>
        <table className="data-table">
          <thead>
            <tr><th>Aplicação</th><th>Período</th><th>Valor</th></tr>
          </thead>
          <tbody>
            {rates.map(r => (
              <tr key={r.id}>
                <td>{r.todos ? 'Todos os quartos' : (r.tipoNome || roomTypes.find(t => t.id === r.tipoId)?.nome)}</td>
                <td>{r.inicio} até {r.fim}</td>
                <td>{BRL.format(r.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}


function Servicos({ products = [], productForm = { nome: '', categoria: 'Frigobar', estoque: '', valor: '' }, setProductForm = () => {}, saveProduct = () => {}, consumos = [], reservations = [], clients = [], rooms = [] }) {
  const listaProdutos = Array.isArray(products) ? products : []
  const listaConsumos = Array.isArray(consumos) ? consumos : []
  const listaReservas = Array.isArray(reservations) ? reservations : []
  const listaClientes = Array.isArray(clients) ? clients : []
  const listaQuartos = Array.isArray(rooms) ? rooms : []

  return (
    <section className="servicos-produtos-page">
      <div className="panel-card">
        <h3>Cadastro de produtos e estoque</h3>
        <p className="hint">Cadastre produtos simples para lançar consumo nos quartos, frigobar, restaurante ou serviços extras.</p>

        <div className="form-grid">
          <label>Produto*
            <input value={productForm.nome || ''} onChange={e => setProductForm({ ...productForm, nome: e.target.value })} placeholder="Ex: Água mineral, refrigerante, almoço..." />
          </label>
          <label>Categoria
            <select value={productForm.categoria || 'Frigobar'} onChange={e => setProductForm({ ...productForm, categoria: e.target.value })}>
              <option>Frigobar</option>
              <option>Restaurante</option>
              <option>Lavanderia</option>
              <option>Serviço</option>
              <option>Outro</option>
            </select>
          </label>
          <label>Estoque*
            <input type="number" min="0" value={productForm.estoque || ''} onChange={e => setProductForm({ ...productForm, estoque: e.target.value })} placeholder="0" />
          </label>
          <label>Valor de venda*
            <input value={productForm.valor || ''} onChange={e => setProductForm({ ...productForm, valor: e.target.value })} placeholder="R$ 0,00" />
          </label>
        </div>

        <div className="actions">
          <button className="ghost" type="button" onClick={() => setProductForm({ nome: '', categoria: 'Frigobar', estoque: '', valor: '' })}>Limpar</button>
          <button className="primary" type="button" onClick={saveProduct}>Cadastrar produto</button>
        </div>
      </div>

      <div className="panel-card">
        <h3>Produtos cadastrados</h3>
        <table className="data-table">
          <thead>
            <tr><th>Produto</th><th>Categoria</th><th>Estoque</th><th>Valor</th></tr>
          </thead>
          <tbody>
            {listaProdutos.length === 0 && <tr><td colSpan="4">Nenhum produto cadastrado.</td></tr>}
            {listaProdutos.map(p => (
              <tr key={p.id}>
                <td><b>{p.nome}</b></td>
                <td>{p.categoria}</td>
                <td>{p.estoque}</td>
                <td>{BRL.format(Number(p.valor || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel-card full-span">
        <h3>Últimos consumos lançados nos quartos</h3>
        <table className="data-table">
          <thead>
            <tr><th>Data</th><th>Quarto</th><th>Cliente</th><th>Item</th><th>Qtd.</th><th>Total</th></tr>
          </thead>
          <tbody>
            {listaConsumos.length === 0 && <tr><td colSpan="6">Nenhum consumo lançado.</td></tr>}
            {listaConsumos.slice(0, 12).map(c => {
              const r = listaReservas.find(x => x.id === c.reservaId) || {}
              const cliente = listaClientes.find(x => x.id === r.clienteId) || {}
              const quarto = listaQuartos.find(x => x.id === r.quartoId) || {}
              return (
                <tr key={c.id}>
                  <td>{c.data}</td>
                  <td>{quarto.numero || '-'}</td>
                  <td>{cliente.nome || '-'}</td>
                  <td>{c.item}</td>
                  <td>{c.qtd}</td>
                  <td>{BRL.format(Number(c.qtd || 1) * Number(c.valor || 0))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}


function Financeiro({ reservations, payments, clients, clientOf, roomOf, setReceiveReserva, setCancelReserva, balance, paidTotal, reservationTotal }) {
  const totalRecebido = payments.filter(p=>p.tipo==='recebimento').reduce((s,p)=>s+Number(p.valor||0),0)
  const totalCredito = clients.reduce((s,c)=>s+Number(c.credito||0),0)
  return <section className="panel-card"><div className="finance-summary"><div><small>Recebido</small><b>{BRL.format(totalRecebido)}</b></div><div><small>Crédito clientes</small><b>{BRL.format(totalCredito)}</b></div><div><small>Reservas abertas</small><b>{reservations.filter(r=>!['cancelada','checkout'].includes(r.status)).length}</b></div><div><small>Pendências</small><b>{reservations.filter(r=>balance(r)>0&&!['cancelada','checkout'].includes(r.status)).length}</b></div></div><h3>Contas de reserva</h3><table className="data-table"><thead><tr><th>Reserva</th><th>Cliente</th><th>Quarto</th><th>Despesas</th><th>Recebido</th><th>Saldo</th><th>Ações</th></tr></thead><tbody>{reservations.map(r=><tr key={r.id}><td>{r.codigo}</td><td>{clientOf(r).nome}</td><td>{roomOf(r.quartoId).numero}</td><td>{BRL.format(reservationTotal(r))}</td><td>{BRL.format(paidTotal(r.id))}</td><td>{BRL.format(balance(r))}</td><td><button onClick={()=>setReceiveReserva(r)}>Receber</button><button onClick={()=>setCancelReserva(r)}>Cancelar/estornar</button></td></tr>)}</tbody></table><h3>Crédito de clientes</h3><div className="credit-list">{clients.filter(c=>Number(c.credito||0)>0).map(c=><div key={c.id}><b>{c.nome}</b><span>{BRL.format(c.credito)}</span></div>)}</div></section>
}


function CaixaDiario({ payments, consumos, reservations, clientOf, roomOf }) {
  const [data, setData] = useState(todayISO())
  const recebimentos = payments.filter(p => p.data === data && p.tipo === 'recebimento')
  const estornos = payments.filter(p => p.data === data && p.tipo === 'estorno')
  const multas = payments.filter(p => p.data === data && p.tipo === 'multa')
  const totalRecebido = recebimentos.reduce((s,p)=>s+Number(p.valor||0),0)
  const totalEstornado = estornos.reduce((s,p)=>s+Number(p.valor||0),0)
  const totalMulta = multas.reduce((s,p)=>s+Number(p.valor||0),0)
  const porForma = [...new Set(payments.filter(p=>p.data===data).map(p=>p.forma))].map(forma => ({ forma, valor: payments.filter(p=>p.data===data && p.forma===forma).reduce((s,p)=>s+(p.tipo==='estorno'?-Number(p.valor||0):Number(p.valor||0)),0) }))
  const movimentos = payments.filter(p=>p.data===data).map(p => {
    const r = reservations.find(x=>x.id===p.reservaId) || {}
    return { ...p, cliente: r.id ? clientOf(r).nome : p.pagante, quarto: r.quartoId ? roomOf(r.quartoId).numero : '-' }
  })
  const consumosDia = consumos.filter(c => c.data === data)
  return <section className="grid-two">
    <div className="panel-card"><div className="card-head"><div><h3>Caixa diário</h3><p className="hint">Conferência rápida da recepção: recebimentos, estornos, multas e consumo lançado.</p></div><label>Data<input type="date" value={data} onChange={e=>setData(e.target.value)}/></label></div>
      <div className="cash-summary"><div><span>Recebido</span><b>{BRL.format(totalRecebido)}</b></div><div><span>Estornado/crédito</span><b>{BRL.format(totalEstornado)}</b></div><div><span>Multas</span><b>{BRL.format(totalMulta)}</b></div><div><span>Saldo caixa</span><b>{BRL.format(totalRecebido + totalMulta - totalEstornado)}</b></div></div>
      <h4>Por forma de pagamento</h4><div className="payment-bars">{porForma.map(f=><div key={f.forma}><span>{f.forma}</span><b>{BRL.format(f.valor)}</b><i style={{width:`${Math.min(100, Math.abs(f.valor)/(Math.max(1,totalRecebido))*100)}%`}}></i></div>)}</div>
    </div>
    <div className="panel-card"><h3>Movimentos do dia</h3><table className="data-table"><thead><tr><th>Tipo</th><th>Cliente</th><th>Quarto</th><th>Forma</th><th>Valor</th></tr></thead><tbody>{movimentos.map(m=><tr key={m.id}><td><span className={`pill ${m.tipo}`}>{m.tipo}</span></td><td>{m.cliente}</td><td>{m.quarto}</td><td>{m.forma}</td><td>{BRL.format(m.valor)}</td></tr>)}</tbody></table></div>
    <div className="panel-card wide"><h3>Consumos lançados</h3><table className="data-table"><thead><tr><th>Reserva</th><th>Item</th><th>Qtd</th><th>Valor unit.</th><th>Total</th></tr></thead><tbody>{consumosDia.map(c=><tr key={c.id}><td>{c.reservaId}</td><td>{c.item}</td><td>{c.qtd}</td><td>{BRL.format(c.valor)}</td><td>{BRL.format(Number(c.qtd||1)*Number(c.valor||0))}</td></tr>)}</tbody></table></div>
  </section>
}

function Relatorios({ reservations, payments, clients, rooms, clientOf, roomOf, printReceipt }) {
  const ativos = reservations.filter(r=>!['cancelada','checkout'].includes(r.status)).length
  const recebidos = payments.filter(p=>p.tipo==='recebimento').reduce((s,p)=>s+Number(p.valor||0),0)
  const creditos = clients.reduce((s,c)=>s+Number(c.credito||0),0)
  const ocupacao = rooms.length ? Math.round((reservations.filter(r=>r.status==='hospedado').length/rooms.length)*100) : 0
  return <section className="panel-card"><h3>Relatórios e comprovantes</h3><div className="finance-summary"><div><small>Reservas ativas</small><b>{ativos}</b></div><div><small>Ocupação</small><b>{ocupacao}%</b></div><div><small>Recebido</small><b>{BRL.format(recebidos)}</b></div><div><small>Créditos</small><b>{BRL.format(creditos)}</b></div></div><div className="actions"><button onClick={()=>window.print()}>Imprimir tela atual</button><button onClick={()=>{ notify('Relatório operacional pronto para impressão.'); setTimeout(() => window.print(), 250) }}>Relatório operacional</button></div><table className="data-table"><thead><tr><th>Reserva</th><th>Cliente</th><th>Quarto</th><th>Entrada</th><th>Saída</th><th>Status</th><th>Imprimir</th></tr></thead><tbody>{reservations.map(r=><tr key={r.id}><td>{r.codigo}</td><td>{clientOf(r).nome}</td><td>{roomOf(r.quartoId).numero}</td><td>{r.entrada}</td><td>{r.saida}</td><td><span className={`pill ${r.status}`}>{r.status}</span></td><td><button onClick={()=>printReceipt(r)}>Relatório formato FastHotel</button></td></tr>)}</tbody></table></section>
}

function Auditoria({ auditLogs }) {
  return <section className="panel-card"><h3>Auditoria operacional</h3><p className="hint">Registro automático das ações importantes da recepção, financeiro, governança e reservas.</p><table className="data-table"><thead><tr><th>Data/hora</th><th>Usuário</th><th>Ação</th><th>Detalhe</th></tr></thead><tbody>{auditLogs.length ? auditLogs.map(l=><tr key={l.id}><td>{l.data}</td><td>{l.usuario}</td><td><b>{l.acao}</b></td><td>{l.detalhe}</td></tr>) : <tr><td colSpan="4">Nenhuma ação registrada ainda.</td></tr>}</tbody></table></section>
}

function Config({ roomTypes, rooms = [], clients = [], reservations = [], payments = [], exportSystemData, clearOperationalData, restoreRoomDefaults, paymentMethods, methodForm, setMethodForm, savePaymentMethod, togglePaymentMethod }) {
  return <section className="grid-two"><div className="panel-card"><div className="config-ops-panel">
    <h3>Operação do sistema</h3>
    <p className="hint">Área segura para preparar o sistema para cliente real, exportar backup e restaurar quartos cadastrados.</p>
    <div className="config-metrics">
      <div><b>{rooms.length}</b><span>quartos cadastrados</span></div>
      <div><b>{clients.length}</b><span>clientes</span></div>
      <div><b>{reservations.length}</b><span>reservas</span></div>
      <div><b>{BRL.format(payments.filter(p => p.tipo === 'recebimento').reduce((s, p) => s + Number(p.valor || 0), 0))}</b><span>recebido</span></div>
    </div>
    <div className="actions">
      <button className="primary" onClick={exportSystemData}>Exportar backup</button>
      <button onClick={restoreRoomDefaults}>Restaurar quartos padrão</button>
      <button className="danger" onClick={clearOperationalData}>Zerar movimentações</button>
    </div>
  </div>
  <h3>Formas de pagamento</h3><p className="hint">Crie novas formas sem mexer no código. A forma "Crédito do cliente" é usada para abater saldos gerados por estorno/cancelamento.</p><div className="form-grid"><label>Nome da forma<input value={methodForm.nome} onChange={e=>setMethodForm({...methodForm,nome:e.target.value})} placeholder="Ex.: Transferência, Cortesia, Crédito interno" /></label><label>Tipo<select value={methodForm.tipo} onChange={e=>setMethodForm({...methodForm,tipo:e.target.value})}><option value="normal">Normal</option><option value="cartao">Cartão</option><option value="credito">Crédito/saldo</option><option value="cortesia">Cortesia</option></select></label></div><button className="primary" onClick={savePaymentMethod}>Criar forma de pagamento</button><table className="data-table"><thead><tr><th>Forma</th><th>Tipo</th><th>Status</th><th>Ação</th></tr></thead><tbody>{paymentMethods.map(f=><tr key={f.id}><td>{f.nome}</td><td>{f.tipo}</td><td>{f.ativo ? 'Ativa' : 'Inativa'}</td><td><button onClick={()=>togglePaymentMethod(f.id)}>{f.ativo ? 'Desativar' : 'Ativar'}</button></td></tr>)}</tbody></table></div><div className="panel-card"><h3>Tipos de quarto e tarifas padrão</h3>{roomTypes.map(t=><p key={t.id}>✓ {t.nome} — {BRL.format(t.diaria)}</p>)}<div className="info-box">Para alterar valores por período, use a aba <b>Tarifas</b>. Para ver os quartos por categoria, use a aba <b>Quartos</b>.</div></div></section>
}


function RoomModal({ room, status, reservations, blocks, clientOf, setSelectedReserva, setBlockModal, setRooms, rooms, onClose }) {
  const futuras = reservations.filter(r => ['pendente', 'confirmada'].includes(r.status))
  const hospedado = reservations.find(r => r.status === 'hospedado')
  const historico = reservations.filter(r => ['checkout', 'cancelada'].includes(r.status))
  const [cls, label] = status
  const marcar = (statusLimpeza) => setRooms(rooms.map(q => q.id === room.id ? { ...q, statusLimpeza } : q))

  return <div className="modal-backdrop"><div className="modal large room-detail-modal"><button className="modal-close" onClick={onClose}>×</button>
    <div className="reservation-head"><div><h2>Quarto {room.numero}</h2><p>{room.tipo} · {room.andar}</p></div><span className={`pill ${cls}`}>{label}</span></div>
    <div className="room-detail-grid">
      <section className="room-now-card">
        <h3>Situação atual</h3>
        {hospedado ? <div><p><b>Hospedado:</b> {clientOf(hospedado).nome}</p><p><b>Reserva:</b> {hospedado.codigo}</p><p><b>Saída:</b> {hospedado.saida} 11:59</p><button className="primary" onClick={()=>setSelectedReserva(hospedado)}>Abrir conta da reserva</button></div> : <p className="hint">Sem hóspede no momento.</p>}
        <div className="room-fast-actions"><button onClick={()=>marcar('limpo')}>Marcar limpo</button><button onClick={()=>marcar('verificar')}>Verificar saída</button><button onClick={()=>marcar('manutencao')}>Manutenção</button><button onClick={()=>setBlockModal({quartoId:room.id,inicio:todayISO(),fim:addDays(todayISO(),1),motivo:'Bloqueio manual'})}>Bloquear período</button></div>
      </section>
      <section className="room-now-card"><h3>Próximas reservas</h3>{futuras.length ? futuras.map(r=><div className="mini-reservation" key={r.id}><b>{r.codigo} · {clientOf(r).nome}</b><span>{r.entrada} até {r.saida}</span><button onClick={()=>setSelectedReserva(r)}>Abrir</button></div>) : <p className="hint">Nenhuma reserva futura.</p>}</section>
    </div>
    <h3>Linha do tempo do quarto</h3>
    <div className="room-history">{reservations.map(r=><button key={r.id} className={`history-item ${r.status}`} onClick={()=>setSelectedReserva(r)}><b>{r.codigo}</b><span>{clientOf(r).nome}</span><small>{r.entrada} → {r.saida}</small></button>)}{blocks.map(b=><div key={b.id} className="history-item bloqueado"><b>Bloqueio</b><span>{b.motivo}</span><small>{b.inicio} → {b.fim}</small></div>)}{historico.length === 0 && blocks.length === 0 && futuras.length === 0 && !hospedado && <p className="hint">Ainda não existe histórico nesse quarto.</p>}</div>
  </div></div>
}

function ReservationModal({ r, client, room, diariaTotal, servicesTotal, total, paid, balance, payments, consumos, onClose, onReceive, onCancel, onCheckin, onCheckout, onPre, onService, onTransfer, onReschedule, onWhatsapp, onPrint }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card reserva-detalhe-modal">
        <div className="reserva-modal-header">
          <div>
            <span className={`pill ${r.status}`}>{r.status}</span>
            <h3>Reserva {r.codigo}</h3>
            <p>Quarto {room.numero} — {client.nome}</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="reserva-modal-body">
          <section className="reserva-info-card">
            <h4>Dados da hospedagem</h4>
            <div className="reserva-info-grid">
              <div><small>Entrada</small><b>{r.entrada} 12:00</b></div>
              <div><small>Saída</small><b>{r.saida} 11:59</b></div>
              <div><small>Quarto</small><b>{room.numero} — {room.tipo}</b></div>
              <div><small>Hóspedes</small><b>PAX {r.adultos}/{r.criancas}</b></div>
              <div><small>Tipo contratado</small><b>{room.tipo}</b></div>
              <div><small>Confirmação</small><b>{r.status === 'pendente' ? 'Pendente de pagamento' : r.status}</b></div>
            </div>
            <p className="reserva-note"><b>Observação interna:</b> {r.observacao || 'Não definida'}</p>
          </section>

          <aside className="reserva-summary-card">
            <h4>Resumo financeiro</h4>
            <div className="summary-row"><span>Diárias</span><b>{BRL.format(diariaTotal)}</b></div>
            <div className="summary-row"><span>Consumos</span><b>{BRL.format(servicesTotal)}</b></div>
            <div className="summary-row total"><span>Preço total</span><b>{BRL.format(total)}</b></div>
            <div className="summary-row"><span>Valor pago</span><b>{BRL.format(paid)}</b></div>
            <div className="summary-row saldo"><span>Saldo</span><b>{BRL.format(balance)}</b></div>
          </aside>
        </div>

        <div className="reserva-tabs-grid">
          <section>
            <h4>Conta da reserva</h4>
            <table className="data-table">
              <thead><tr><th>Data</th><th>Produto</th><th>Forma</th><th>Valor</th></tr></thead>
              <tbody>
                <tr><td>{r.entrada}</td><td>Diária</td><td>Despesa</td><td>{BRL.format(diariaTotal)}</td></tr>
                {consumos.map(c => <tr key={c.id}><td>{c.data}</td><td>{c.item} x{c.qtd}</td><td>Consumo</td><td>{BRL.format(Number(c.qtd || 1) * Number(c.valor || 0))}</td></tr>)}
                {payments.map(p => <tr key={p.id}><td>{p.data}</td><td>{p.observacao || p.forma}</td><td>{p.forma}</td><td>{p.tipo === 'recebimento' ? '-' : ''}{BRL.format(p.valor)}</td></tr>)}
              </tbody>
            </table>
          </section>

          <section>
            <h4>Hóspedes vinculados</h4>
            <table className="data-table">
              <thead><tr><th>Nome</th><th>Documento</th><th>Nascimento</th><th>Tipo</th></tr></thead>
              <tbody>
                <tr><td>{client.nome}</td><td>{client.cpf || '-'}</td><td>{client.nascimento || '-'}</td><td>Contratante</td></tr>
              </tbody>
            </table>
          </section>
        </div>

        <div className="reserva-modal-actions">
          <button onClick={onReceive}>Receber</button>
          <button onClick={onService}>Adicionar consumo</button>
          <button onClick={onTransfer}>Trocar quarto</button>
          <button onClick={onReschedule}>Remarcar</button>
          <button onClick={onWhatsapp}>WhatsApp</button>
          <button onClick={onPre}>Pré check-in</button>
          <button onClick={onPrint}>Imprimir</button>
          <button className="danger" onClick={onCancel}>Cancelar</button>
          {r.status !== 'hospedado' && <button className="primary" onClick={onCheckin}>Check-in</button>}
          {r.status === 'hospedado' && <button className="primary" onClick={onCheckout}>Check-out</button>}
        </div>
      </div>
    </div>
  )
}


function ReceiveModal({ reserva, client, saldo, paymentMethods, onClose, onSave }) {
  const [form, setForm] = useState({ forma: 'PIX', valor: String(saldo > 0 ? saldo : ''), observacao: '' })
  return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={onClose}>×</button><h2>Receber</h2><p>Recebido: {BRL.format(0)}<br/>A receber: {BRL.format(saldo)}</p><div className="info-box">Caso cancele uma reserva, o valor pode voltar como saldo/crédito do cliente. Use a forma <b>Crédito do cliente</b> para abater em nova reserva.</div><div className="form-grid"><label>Ponto de venda<select><option>Recepção</option></select></label><label>Forma de recebimento<select value={form.forma} onChange={e=>setForm({...form,forma:e.target.value})}>{paymentMethods.filter(m=>m.ativo).map(m=><option key={m.id}>{m.nome}</option>)}</select></label><label>Pagante<input value={client.nome} readOnly /></label><label>Documento<input value={client.cpf || ''} readOnly /></label><label>Valor<input value={form.valor} onChange={e=>setForm({...form,valor:e.target.value})}/></label><label>Comprovante<input type="file"/></label><label className="full">Observação<textarea value={form.observacao} onChange={e=>setForm({...form,observacao:e.target.value})}></textarea></label></div><div className="actions"><button onClick={onClose}>Descartar</button><button className="primary" onClick={()=>onSave(form)}>Receber</button></div></div></div>
}

function CancelModal({ reserva, received, onClose, onSave }) {
  const [form, setForm] = useState({ motivo: 'Lançamento errado', observacao: '', multa: '0' })
  return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={onClose}>×</button><h2>Cancelar reserva {reserva.codigo}</h2><p>Recebido: {BRL.format(received)}. O restante voltará como crédito do cliente.</p><div className="form-grid"><label>Motivo<select value={form.motivo} onChange={e=>setForm({...form,motivo:e.target.value})}><option>Lançamento errado</option><option>Desistência do cliente</option><option>Remarcação</option><option>Problema operacional</option></select></label><label>Multa de cancelamento<input value={form.multa} onChange={e=>setForm({...form,multa:e.target.value})}/></label><label className="full">Observação<textarea value={form.observacao} onChange={e=>setForm({...form,observacao:e.target.value})}></textarea></label></div><div className="actions"><button onClick={onClose}>Descartar</button><button className="danger-btn" onClick={()=>onSave(form)}>Cancelar e gerar crédito</button></div></div></div>
}



function RescheduleModal({ reserva, rooms, roomTypes, roomOf, availableRooms, onClose, onSave }) {
  const current = roomOf(reserva.quartoId)
  const [form, setForm] = useState({ entrada: reserva.entrada, saida: reserva.saida, tipoId: reserva.tipoId, quartoId: reserva.quartoId, diaria: String(reserva.diaria || ''), observacao: '' })
  const disponiveis = rooms.filter(q => q.tipoId === form.tipoId && (q.id === reserva.quartoId || availableRooms(form.tipoId, form.entrada, form.saida).some(a => a.id === q.id)))
  const tipoAtual = roomTypes.find(t => t.id === form.tipoId)
  const totalPrevisto = diffDays(form.entrada, form.saida) * (moneyNumber(form.diaria) || Number(tipoAtual?.diaria || 0))
  return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={onClose}>×</button><h2>Remarcar reserva {reserva.codigo}</h2><p>Quarto atual {current.numero} ({current.tipo}). A remarcação recalcula o período e permite trocar o quarto disponível.</p><div className="info-box">Use quando o cliente mudar datas. O pagamento já lançado fica preservado e o saldo será recalculado automaticamente.</div><div className="form-grid"><label>Entrada<input type="date" value={form.entrada} onChange={e=>setForm({...form,entrada:e.target.value,quartoId:''})}/></label><label>Saída<input type="date" value={form.saida} onChange={e=>setForm({...form,saida:e.target.value,quartoId:''})}/></label><label>Tipo de quarto<select value={form.tipoId} onChange={e=>{const t=roomTypes.find(x=>x.id===e.target.value);setForm({...form,tipoId:e.target.value,diaria:String(t?.diaria||''),quartoId:''})}}>{roomTypes.map(t=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></label><label>Quarto disponível<select value={form.quartoId} onChange={e=>setForm({...form,quartoId:e.target.value})}><option value="">Selecione</option>{disponiveis.map(q=><option key={q.id} value={q.id}>{q.numero} - {q.tipo}</option>)}</select></label><label>Diária<input value={form.diaria} onChange={e=>setForm({...form,diaria:e.target.value})}/></label><label>Total previsto<input value={BRL.format(totalPrevisto)} readOnly /></label><label className="full">Observação<textarea value={form.observacao} onChange={e=>setForm({...form,observacao:e.target.value})} placeholder="Motivo da remarcação, autorização, diferença de valor..."></textarea></label></div><div className="actions"><button onClick={onClose}>Descartar</button><button className="primary" onClick={()=>onSave(form)}>Salvar remarcação</button></div></div></div>
}

function TransferModal({ reserva, rooms, roomOf, availableRooms, onClose, onSave }) {
  const current = roomOf(reserva.quartoId)
  const list = rooms.filter(q => q.tipoId === reserva.tipoId && (q.id === reserva.quartoId || availableRooms(reserva.tipoId, reserva.entrada, reserva.saida).some(a => a.id === q.id)))
  const [form, setForm] = useState({ quartoId: reserva.quartoId, observacao: '' })
  return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={onClose}>×</button><h2>Alocar / trocar quarto</h2><p>Reserva {reserva.codigo} — quarto atual {current.numero} ({current.tipo})</p><div className="info-box">Ao trocar o quarto, o quarto anterior fica marcado para verificar saída. Só aparecem quartos disponíveis no mesmo período da reserva.</div><div className="form-grid"><label>Novo quarto<select value={form.quartoId} onChange={e=>setForm({...form,quartoId:e.target.value})}>{list.map(q=><option key={q.id} value={q.id}>{q.numero} - {q.tipo}</option>)}</select></label><label className="full">Observação<textarea value={form.observacao} onChange={e=>setForm({...form,observacao:e.target.value})} placeholder="Motivo da troca, pedido do cliente, manutenção..."></textarea></label></div><div className="actions"><button onClick={onClose}>Descartar</button><button className="primary" onClick={()=>onSave(form)}>Confirmar troca</button></div></div></div>
}

function ServiceModal({ reserva, client, room, onClose, onSave }) {
  const [form, setForm] = useState({ item: 'Água mineral', qtd: '1', valor: '', observacao: '' })
  return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={onClose}>×</button><h2>Adicionar consumo no quarto {room.numero}</h2><p>Reserva {reserva.codigo} — {client.nome}</p><div className="form-grid"><label>Produto/serviço<input value={form.item} onChange={e=>setForm({...form,item:e.target.value})}/></label><label>Quantidade<input type="number" min="1" value={form.qtd} onChange={e=>setForm({...form,qtd:e.target.value})}/></label><label>Valor unitário<input value={form.valor} onChange={e=>setForm({...form,valor:e.target.value})} placeholder="R$"/></label><label className="full">Observação<textarea value={form.observacao} onChange={e=>setForm({...form,observacao:e.target.value})}></textarea></label></div><div className="actions"><button onClick={onClose}>Descartar</button><button className="primary" onClick={()=>onSave(form)}>Lançar consumo</button></div></div></div>
}

function BlockModal({ rooms, data, onClose, onSave }) {
  const [form, setForm] = useState(data)
  return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={onClose}>×</button><h2>Bloquear período manualmente</h2><div className="form-grid"><label>Quarto<select value={form.quartoId} onChange={e=>setForm({...form,quartoId:e.target.value})}>{rooms.map(q=><option key={q.id} value={q.id}>{q.numero} - {q.tipo}</option>)}</select></label><label>Início<input type="date" value={form.inicio} onChange={e=>setForm({...form,inicio:e.target.value})}/></label><label>Fim<input type="date" value={form.fim} onChange={e=>setForm({...form,fim:e.target.value})}/></label><label className="full">Motivo<textarea value={form.motivo || ''} onChange={e=>setForm({...form,motivo:e.target.value})}></textarea></label></div><div className="actions"><button onClick={onClose}>Descartar</button><button className="primary" onClick={()=>onSave(form)}>Salvar bloqueio</button></div></div></div>
}

export default App
