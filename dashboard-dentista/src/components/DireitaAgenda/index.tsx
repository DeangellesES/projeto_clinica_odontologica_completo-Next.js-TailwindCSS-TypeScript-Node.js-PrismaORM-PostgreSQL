"use client";

import { useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import type { Appointment } from "@/types/appointment";
import { getServiceStyle } from "@/lib/appointments";

interface DireitaAgendaProps {
    onSelectToday: () => void;
    appointments: Appointment[];
}

const allSlots = Array.from({ length: 21 }, (_, i) => {
    const h = 8 + Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    return `${String(h).padStart(2, "0")}:${m}`;
});

export default function DireitaAgenda({
    onSelectToday,
    appointments,
}: DireitaAgendaProps) {
    const [search, setSearch] = useState("");

    const appointmentsByTime = useMemo(() => {
        const map = new Map<string, Appointment>();
        for (const item of appointments) {
            map.set(item.hora, item);
        }
        return map;
    }, [appointments]);

    const filteredAppointments = useMemo(() => {
        if (!search.trim()) return appointments;
        const term = search.toLowerCase();
        return appointments.filter(
            (a) =>
                a.nome.toLowerCase().includes(term) ||
                a.telefone.includes(term) ||
                a.servico.toLowerCase().includes(term)
        );
    }, [appointments, search]);

    const visibleTimes = useMemo(() => {
        if (!search.trim()) return new Set(allSlots);
        return new Set(filteredAppointments.map((a) => a.hora));
    }, [filteredAppointments, search]);

    return (
        <section className="flex flex-col w-full border-l border-gray-300">
            <div className="flex justify-between px-8 py-5 border-b border-gray-300">
                <div className="relative w-[60%]">
                    <IoSearch
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Buscar Paciente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 w-[100%] py-2 px-8 rounded-lg"
                    />
                </div>

                <button
                    onClick={onSelectToday}
                    className="border px-5 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Hoje
                </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
                {allSlots.map((slot) => {
                    if (!visibleTimes.has(slot)) return null;

                    const item = appointmentsByTime.get(slot);
                    if (!item) {
                        return (
                            <div key={slot} className="rounded-xl px-4 py-6 flex items-center border border-dashed border-gray-200">
                                <span className="text-sm font-bold text-gray-300 w-12">{slot}</span>
                            </div>
                        );
                    }

                    const style = getServiceStyle(item.servico);
                    return (
                        <div key={slot} className="bg-gray-100 rounded-xl px-4 py-6 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-emerald-500 w-12">{item.hora}</span>
                                <div>
                                    <span className={`text-sm px-2 py-0.5 rounded-2xl ${style.bg} ${style.text}`}>
                                        {style.emoji} {item.servico}
                                    </span>
                                    <p className="font-bold">{item.nome}</p>
                                    <p className="text-xs text-gray-500">{item.dentista} · {item.telefone}</p>
                                </div>
                            </div>
                            <span className="text-sm font-bold px-3 py-1 rounded-full bg-green-100 text-green-600">
                                Confirmado
                            </span>
                        </div>
                    );
                })}

                {appointments.length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                        Nenhum agendamento para este dia.
                    </p>
                )}
            </div>
        </section>
    );
}
