"use client";

import { useState, useMemo } from "react";
import { FaTooth, FaRegCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaPlus, FaRightFromBracket } from "react-icons/fa6";
import { MdOutlineDashboard } from "react-icons/md";
import { RxPeople } from "react-icons/rx";
import { IoMdTime, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { addDays, format, isToday, isTomorrow, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import Calendario from "@/components/Calendario";
import DireitaAgenda from "@/components/DireitaAgenda";
import Pacientes from "@/components/Pacientes";
import NovoAgendamento from "@/components/NovoAgendamento";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/contexts/auth-context";
import {
    countWeekAppointments,
    derivePatients,
    filterAppointmentsByDate,
    getNextAppointmentTime,
    getServiceStyle,
} from "@/lib/appointments";

type Page = "dashboard" | "agenda" | "pacientes";

function getDateLabel(date: Date): string {
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    if (isYesterday(date)) return "Ontem";
    return format(date, "EEEE", { locale: ptBR });
}

export default function Dashboard() {
    const [page, setPage] = useState<Page>("dashboard");
    const [dayOffset, setDayOffset] = useState(0);
    const [agendaDate, setAgendaDate] = useState<Date>(new Date());
    const [showNovoAgendamento, setShowNovoAgendamento] = useState(false);
    const { user, logout } = useAuth();

    const { appointments, loading, error, refresh } = useAppointments();

    const selectedDate = useMemo(() => addDays(new Date(), dayOffset), [dayOffset]);
    const dayAppointments = useMemo(
        () => filterAppointmentsByDate(appointments, selectedDate),
        [appointments, selectedDate]
    );
    const agendaDayAppointments = useMemo(
        () => filterAppointmentsByDate(appointments, agendaDate),
        [appointments, agendaDate]
    );
    const patients = useMemo(() => derivePatients(appointments), [appointments]);

    const stats = useMemo(
        () => ({
            agendamentos: dayAppointments.length,
            proximo: getNextAppointmentTime(appointments, selectedDate),
            consultasSemana: countWeekAppointments(appointments, selectedDate),
        }),
        [appointments, selectedDate, dayAppointments.length]
    );

    return (
        <main className="flex">
            <aside className="w-[20%]">
                <header className="px-6 py-5 border-b border-r border-gray-300">
                    <h1 className="flex items-center gap-2 font-bold text-2xl">
                        <div className="bg-emerald-500 p-2 rounded-lg">
                            <FaTooth className="text-white" />
                        </div>
                        DentaCare
                    </h1>
                </header>

                <div className="flex flex-col border-r border-gray-300 h-screen p-6 gap-4">
                    <button
                        onClick={() => setPage("dashboard")}
                        className={`font-bold flex items-center gap-2 text-left cursor-pointer ${page === "dashboard" ? "text-emerald-500" : "text-gray-600"
                            }`}
                    >
                        <MdOutlineDashboard className="text-xl" /> Dashboard
                    </button>
                    <button
                        onClick={() => setPage("agenda")}
                        className={`font-bold flex items-center gap-2 text-left cursor-pointer ${page === "agenda" ? "text-emerald-500" : "text-gray-600"
                            }`}
                    >
                        <FaRegCalendarAlt className="text-xl" /> Agenda
                    </button>
                    <button
                        onClick={() => setPage("pacientes")}
                        className={`font-bold flex items-center gap-2 text-left cursor-pointer ${page === "pacientes" ? "text-emerald-500" : "text-gray-600"
                            }`}
                    >
                        <RxPeople className="text-xl" /> Pacientes
                    </button>

                    <div className="mt-auto flex flex-col gap-2 border-t border-gray-300 pt-4">
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        <button
                            onClick={logout}
                            className="font-bold flex items-center gap-2 text-left cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                        >
                            <FaRightFromBracket className="text-lg" /> Sair
                        </button>
                    </div>
                </div>
            </aside>

            <section className="w-full">
                {error && (
                    <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {page === "dashboard" && (
                    <>
                        <header className="flex justify-between px-6 py-4 items-center border-b border-gray-300">
                            <div>
                                <h1 className="font-bold text-2xl">Resumo</h1>
                                <p className="text-xs text-gray-500">
                                    {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowNovoAgendamento(true)}
                                className="bg-emerald-500 px-3 py-2 rounded-lg text-white font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <FaPlus className="font-bold text-lg" /> Novo Agendamento
                            </button>
                        </header>

                        <div className="grid grid-cols-4 gap-4 p-6">
                            <div className="bg-gray-100 rounded-xl p-4">
                                <p className="text-sm text-gray-500 flex items-center gap-1"><FaRegCalendarAlt className="text-emerald-500 text-lg" />Agendamentos {getDateLabel(selectedDate)}</p>
                                <p className="text-3xl font-bold">{loading ? "..." : stats.agendamentos}</p>
                            </div>
                            <div className="bg-gray-100 rounded-xl p-4">
                                <p className="text-sm text-gray-500 flex items-center gap-1"><RxPeople className="text-blue-500 text-lg" />Total Pacientes</p>
                                <p className="text-3xl font-bold">{loading ? "..." : patients.length}</p>
                            </div>
                            <div className="bg-gray-100 rounded-xl p-4">
                                <p className="text-sm text-gray-500 flex items-center gap-1"><IoMdTime className="text-orange-600 text-lg" />Próximo Horário</p>
                                <p className="text-3xl font-bold">{loading ? "..." : stats.proximo}</p>
                            </div>
                            <div className="bg-gray-100 rounded-xl p-4">
                                <p className="text-sm text-gray-500 flex items-center gap-1"><IoMdCheckmarkCircleOutline className="text-green-600 text-lg" />Consultas esta Semana</p>
                                <p className="text-3xl font-bold">{loading ? "..." : stats.consultasSemana}</p>
                            </div>
                        </div>

                        <div className="mx-6 rounded-xl p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold mb-4">Agenda do Dia</h2>
                                <div className="flex pb-3 items-center gap-3">
                                    <button
                                        onClick={() => setDayOffset((prev) => prev - 1)}
                                        className="cursor-pointer hover:text-emerald-500 transition-colors"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <p className="font-medium min-w-[70px] text-center">{getDateLabel(selectedDate)}</p>
                                    <button
                                        onClick={() => setDayOffset((prev) => prev + 1)}
                                        className="cursor-pointer hover:text-emerald-500 transition-colors"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>

                            </div>

                            <div className="flex flex-col gap-3">
                                {loading ? (
                                    <p className="text-gray-400 text-center py-8">Carregando agendamentos...</p>
                                ) : dayAppointments.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8">Nenhum agendamento para este dia.</p>
                                ) : (
                                    dayAppointments.map((appt) => {
                                        const style = getServiceStyle(appt.servico);
                                        return (
                                            <div key={appt.id} className="bg-white rounded-lg p-5 flex items-center gap-4 border border-gray-300">
                                                <span className="text-sm text-gray-800 bg-gray-200 px-4 py-5 rounded-xl font-bold">{appt.hora}</span>
                                                <div>
                                                    <p className="text-sm text-gray-500 uppercase">{style.emoji} {appt.servico}</p>
                                                    <p className="font-bold flex items-center gap-2"><FiUser />{appt.nome}</p>
                                                    <p className="text-xs text-gray-400">{appt.dentista} · {appt.telefone}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </>
                )}

                {page === "agenda" && (
                    <>
                        <header className="flex justify-between px-6 py-4 items-center border-b border-gray-300">
                            <div>
                                <h1 className="font-bold text-2xl">Agenda</h1>
                                <p className="text-xs text-gray-500">
                                    {format(agendaDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowNovoAgendamento(true)}
                                className="bg-emerald-500 px-3 py-2 rounded-lg text-white font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <FaPlus className="font-bold text-lg" /> Novo Agendamento
                            </button>
                        </header>

                        <section className="flex">
                            <Calendario
                                selectedDate={agendaDate}
                                onSelectDate={setAgendaDate}
                                appointments={agendaDayAppointments}
                                allAppointments={appointments}
                            />
                            <DireitaAgenda
                                onSelectToday={() => setAgendaDate(new Date())}
                                appointments={agendaDayAppointments}
                            />
                        </section>
                    </>
                )}

                {page === "pacientes" && (
                    <>
                        <header className="flex justify-between px-6 py-4 items-center border-b border-gray-300">
                            <div>
                                <h1 className="font-bold text-2xl">Pacientes</h1>
                                <p className="text-xs text-gray-500">
                                    {loading ? "Carregando..." : `${patients.length} pacientes cadastrados`}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowNovoAgendamento(true)}
                                className="bg-emerald-500 px-3 py-2 rounded-lg text-white font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <FaPlus className="font-bold text-lg" /> Novo Paciente
                            </button>
                        </header>

                        <Pacientes patients={patients} loading={loading} onRefresh={refresh} />
                    </>
                )}
            </section>

            <NovoAgendamento
                open={showNovoAgendamento}
                onClose={() => setShowNovoAgendamento(false)}
                onCreated={refresh}
                existingPatients={patients.map((p) => ({
                    name: p.name,
                    phone: p.phone,
                }))}
            />
        </main>
    );
}
