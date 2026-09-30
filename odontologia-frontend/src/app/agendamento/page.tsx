'use client'

import Link from "next/link";
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'

import { ArrowRight, ArrowLeft } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'

const HORARIOS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]

function formatDataLocal(date: Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

const services = [
    { id: 1, icon: "🪥", name: "Limpeza", duration: "30 min", price: "R$ 150" },
    { id: 2, icon: "🦷", name: "Consulta", duration: "20 min", price: "R$ 100" },
    { id: 3, icon: "😁", name: "Ortodontia", duration: "45 min", price: "R$ 300" },
    { id: 4, icon: "💎", name: "Clareamento", duration: "60 min", price: "R$ 500" },
    { id: 5, icon: "🔧", name: "Restauração", duration: "60 min", price: "R$ 200" },
    { id: 6, icon: "✨", name: "Lente de Contato", duration: "2h", price: "R$ 800" },
    { id: 7, icon: "🔩", name: "Implantes", duration: "2h", price: "R$ 3500" },
    { id: 8, icon: "👨‍⚕️", name: "Outro" },
];

const dentistas = [
    { id: 1, name: "Dr. José", specialty: "Clínico Geral" },
    { id: 2, name: "Dra. Maria", specialty: "Ortodontista" },
    { id: 3, name: "Dr. Pedro", specialty: "Implantodontista" },
];

type Service = (typeof services)[number]
type Dentista = (typeof dentistas)[number]

const steps = [
    { id: 1, label: "Serviço" },
    { id: 2, label: "Dentista" },
    { id: 3, label: "Data & Hora" },
    { id: 4, label: "Seus Dados" },
    { id: 5, label: "Concluído" },
];

export default function Agendamento() {

    const [step, setStep] = useState(1)
    const [selectedService, setSelectedService] = useState<Service | null>(null)

    const [selectedDentist, setSelectedDentist] = useState<Dentista | null>(null)

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [horariosOcupados, setHorariosOcupados] = useState<string[]>([])
    const [carregandoHorarios, setCarregandoHorarios] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const cacheRef = useRef<Map<string, string[]>>(new Map())

    useEffect(() => {
        if (!selectedDate) {
            setHorariosOcupados([])
            return
        }

        const dataStr = formatDataLocal(selectedDate)
        const cached = cacheRef.current.get(dataStr)
        if (cached) {
            setHorariosOcupados(cached)
            return
        }

        const controller = new AbortController()

        async function buscarHorariosOcupados() {
            setCarregandoHorarios(true)
            try {
                const { data } = await axios.get<{ horariosOcupados: string[] }>(
                    `${API_BASE_URL}/appointments/disponibilidade`,
                    {
                        params: { data: dataStr },
                        signal: controller.signal,
                    }
                )
                const ocupados = data.horariosOcupados ?? []
                cacheRef.current.set(dataStr, ocupados)
                setHorariosOcupados(ocupados)
                setSelectedTime((atual) =>
                    atual && ocupados.includes(atual) ? null : atual
                )
            } catch (error) {
                if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
                    return
                }
                setHorariosOcupados([])
            } finally {
                if (!controller.signal.aborted) {
                    setCarregandoHorarios(false)
                }
            }
        }

        buscarHorariosOcupados()
        return () => controller.abort()
    }, [selectedDate])

    async function finalizarAgendamento() {

        try {

            const agendamento = {
                servico: selectedService?.name,
                dentista: selectedDentist?.name,
                data: selectedDate ? formatDataLocal(selectedDate) : '',
                hora: selectedTime,
                nome: name.trim(),
                telefone: phone.trim(),
            }

            const response = await axios.post(
                `${API_BASE_URL}/appointments/servico`,
                agendamento
            )

            alert('Agendamento realizado com sucesso!')

            setStep(5)

        } catch (error) {
            console.log(error)

            if (axios.isAxiosError(error) && error.response?.status === 409) {
                alert('Este horário acabou de ser reservado. Escolha outro horário.')
                setStep(3)
                setSelectedTime(null)
                return
            }

            alert('Erro ao salvar agendamento')
        }
    }

    const handleNextStep = async () => {

        if (step === 4) {

            await finalizarAgendamento()

            return
        }

        setStep(step + 1)
    }

    return (
        <main className="mb-20">

            {/* IMAGEM */}
            <div className="relative w-full h-[40vh]">
                <div className="absolute top-0 left-0 z-50 p-2">
                    <Link href="/" className="flex items-center font-bold text-xl text-white">
                        <Image
                            src="/dente.png"
                            alt="Minha imagem"
                            width={40}
                            height={30}
                        />
                        <span>Clínica Sorrir</span>
                    </Link>
                </div>

                <Image
                    src="/clinica-recepcao.jpg"
                    alt="Minha imagem"
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute inset-0 bg-mauve-600/60"></div>

                {/* TEXTO CENTRALIZADO */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <h1 className="text-white text-5xl font-bold">
                        Sorriso Dental
                    </h1>
                    <p className="text-white">
                        Agende sua consulta em poucos passos
                    </p>
                </div>
            </div>

            {/* CARD SOBREPOSTO */}
            <div className="relative z-20 -mt-10 px-6">
                <div className="w-full mx-auto max-w-5xl bg-white rounded-2xl shadow-xl p-8">

                    {/* STEPPER DINÂMICO - DESKTOP */}
                    <div className="hidden md:flex items-center justify-between mb-8">
                        {steps.map((item, index) => (
                            <div key={item.id} className="flex items-center w-full">

                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold
                                                ${step >= item.id
                                                ? "bg-teal-600 text-white"
                                                : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {item.id}
                                    </div>

                                    <span
                                        className={`${step >= item.id ? "text-gray-700" : "text-gray-400"
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="flex-1 h-[1px] bg-gray-300 mx-4"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* STEPPER DINÂMICO - MOBILE (2-2-1) */}
                    <div className="flex md:hidden flex-col items-center gap-3 mb-8">
                        {/* Linha 1: passos 1 e 2 */}
                        <div className="flex justify-center gap-6 w-full">
                            {steps.slice(0, 2).map((item) => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <div
                                        className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm
                                                ${step >= item.id
                                                ? "bg-teal-600 text-white"
                                                : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {item.id}
                                    </div>
                                    <span className={`text-sm ${step >= item.id ? "text-gray-700" : "text-gray-400"}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Linha 2: passos 3 e 4 */}
                        <div className="flex justify-center gap-6 w-full">
                            {steps.slice(2, 4).map((item) => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <div
                                        className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm
                                                ${step >= item.id
                                                ? "bg-teal-600 text-white"
                                                : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {item.id}
                                    </div>
                                    <span className={`text-sm ${step >= item.id ? "text-gray-700" : "text-gray-400"}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Linha 3: passo 5 */}
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm
                                            ${step >= 5
                                            ? "bg-teal-600 text-white"
                                            : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    5
                                </div>
                                <span className={`text-sm ${step >= 5 ? "text-gray-700" : "text-gray-400"}`}>
                                    Concluído
                                </span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-[#494848]">
                        {step === 1 && "Escolha o serviço"}
                        {step === 2 && "Escolha o dentista"}
                        {step === 3 && "Escolha data e horário"}
                        {step === 4 && "Seus dados"}
                    </h2>


                    {step === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10 justify-items-center">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => setSelectedService(service)}
                                    className={`w-full max-w-[250px] border p-6 rounded-xl space-y-1 cursor-pointer transition
                                    ${selectedService?.id === service.id
                                            ? "border-teal-600 bg-teal-50"
                                            : "border-gray-400 hover:border-teal-400"
                                        }`}
                                >
                                    <p className="text-2xl">{service.icon}</p>
                                    <h2 className="font-bold text-[#494848]">{service.name}</h2>
                                    <p>{service.duration}</p>
                                    <p className="text-teal-600 font-bold">{service.price}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="mt-10 space-y-4">

                            <p className="text-gray-600">
                                Serviço escolhido: <strong>{selectedService?.name}</strong>
                            </p>

                            {dentistas.map((dentist) => (
                                <div
                                    key={dentist.id}
                                    onClick={() => setSelectedDentist(dentist)}
                                    className={`p-4 border rounded-lg cursor-pointer transition
                                            ${selectedDentist?.id === dentist.id
                                            ? "border-teal-600 bg-teal-50"
                                            : "border-gray-300 hover:border-teal-400"
                                        }`}
                                >
                                    <h3 className="font-semibold">{dentist.name}</h3>
                                    <p className="text-sm text-gray-500">{dentist.specialty}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="mt-10 space-y-6">

                            {/* Data */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">
                                    Escolha a data
                                </label>

                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date: Date | null) => {
                                        setSelectedDate(date)
                                        setSelectedTime(null)
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Clique para selecionar"
                                    className="w-full border border-gray-300 p-3 rounded-lg"
                                    minDate={new Date()}
                                />
                            </div>

                            {/* Horários */}
                            {selectedDate && (
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">
                                        Escolha o horário
                                    </label>

                                    {carregandoHorarios && (
                                        <p className="text-sm text-gray-500 mb-2">
                                            Verificando horários disponíveis...
                                        </p>
                                    )}

                                    <div className="grid grid-cols-3 gap-3">
                                        {HORARIOS.map((time) => {
                                            const ocupado = horariosOcupados.includes(time)

                                            return (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    disabled={ocupado || carregandoHorarios}
                                                    onClick={() => !ocupado && setSelectedTime(time)}
                                                    title={ocupado ? "Horário já agendado" : undefined}
                                                    className={`p-2 border rounded-lg
                                            ${ocupado || carregandoHorarios
                                                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                                                            : selectedTime === time
                                                                ? "bg-teal-600 text-white border-teal-600"
                                                                : "border-gray-300 hover:border-teal-400 cursor-pointer"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {!carregandoHorarios && horariosOcupados.length === HORARIOS.length && (
                                        <p className="text-sm text-amber-600 mt-2">
                                            Todos os horários desta data estão ocupados. Escolha outra data.
                                        </p>
                                    )}
                                </div>
                            )}

                        </div>
                    )}

                    {step === 4 && (
                        <div className="mt-10 space-y-6">

                            <p className="text-gray-600">
                                Revise seu agendamento:
                            </p>

                            <div className="bg-gray-100 p-4 rounded-lg text-sm space-y-1">
                                <p><strong>Serviço:</strong> {selectedService?.name}</p>
                                <p><strong>Dentista:</strong> {selectedDentist?.name}</p>
                                <p><strong>Data:</strong> {selectedDate?.toLocaleDateString()}</p>
                                <p><strong>Hora:</strong> {selectedTime}</p>
                            </div>

                            {/* FORM */}
                            <div className="space-y-4">

                                <input
                                    type="text"
                                    placeholder="Seu nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-lg"
                                />

                                {/* <input
                                    type="email"
                                    placeholder="Seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-lg"
                                /> */}

                                <input
                                    type="text"
                                    placeholder="Seu telefone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border border-gray-300 p-3 rounded-lg"
                                />

                            </div>

                        </div>
                    )}

                    {step === 5 && (
                        <div className="mt-10 text-center space-y-4">
                            <h2 className="text-2xl font-bold text-teal-600">
                                ✅ Agendamento concluído!
                            </h2>

                            <p className="text-gray-600">
                                Seu horário foi reservado com sucesso.
                            </p>

                            <div className="bg-gray-100 p-4 rounded-lg text-sm space-y-1">
                                <p><strong>Serviço:</strong> {selectedService?.name}</p>
                                <p><strong>Dentista:</strong> {selectedDentist?.name}</p>
                                <p><strong>Data:</strong> {selectedDate?.toLocaleDateString()}</p>
                                <p><strong>Hora:</strong> {selectedTime}</p>
                                <p><strong>Nome:</strong> {name}</p>
                                <p><strong>Telefone:</strong> {phone}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-10 px-7">
                        <button
                            onClick={() => setStep(step - 1)}
                            disabled={step === 1}
                            className={`flex gap-2 ${step === 1
                                ? "cursor-not-allowed text-gray-400"
                                : "cursor-pointer text-black"
                                }`}
                        >
                            <ArrowLeft /> Voltar
                        </button>

                        {step < 5 && (
                            <button
                                onClick={handleNextStep}
                                disabled={
                                    (step === 1 && !selectedService) ||
                                    (step === 2 && !selectedDentist) ||
                                    (step === 3 && (!selectedDate || !selectedTime)) ||
                                    (step === 4 && (!name.trim() || !phone.trim()))
                                }
                                className={`flex gap-2 py-2 px-4 rounded-lg
                                ${(step === 1 && selectedService) ||
                                        (step === 2 && selectedDentist) ||
                                        (step === 3 && selectedDate && selectedTime) ||
                                        (step === 4 && name.trim() && phone.trim())
                                        ? "bg-teal-600 text-white cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                {step === 4 ? "Finalizar Agendamento" : "Próximo"} <ArrowRight />
                            </button>
                        )}

                        {step === 5 && (
                            <button
                                onClick={() => {
                                    setStep(1)
                                    setSelectedService(null)
                                    setSelectedDentist(null)
                                    setSelectedDate(null)
                                    setSelectedTime(null)
                                    setHorariosOcupados([])
                                    setName("")
                                    setPhone("")
                                }}
                                className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg"
                            >
                                Novo agendamento
                            </button>
                        )}
                    </div>

                </div>

            </div>

        </main>
    )
}