"use client";

import { Calendar } from "@/components/ui/calendar";
import type { Appointment } from "@/types/appointment";
import { countServices, getDatesWithAppointments, getNextAppointmentTime, getServiceStyle } from "@/lib/appointments";

interface CalendarioProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    appointments: Appointment[];
    allAppointments: Appointment[];
}

export default function Calendario({
    selectedDate,
    onSelectDate,
    appointments,
    allAppointments,
}: CalendarioProps) {
    const datesWithAppointments = getDatesWithAppointments(allAppointments);
    const serviceCounts = countServices(appointments);
    const proximo = getNextAppointmentTime(allAppointments, selectedDate);

    return (
        <section className="px-8 py-6 w-[30%]">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onSelectDate(date)}
                className="rounded-lg border w-[100%]"
                modifiers={{
                    hasAppointment: datesWithAppointments,
                }}
                modifiersClassNames={{
                    hasAppointment: "bg-emerald-100 font-bold text-emerald-700",
                }}
            />

            <div className="py-8">
                <h2 className="font-bold">Resumo do Dia</h2>

                <div className="flex text-center py-3 gap-3">
                    <div className="border p-3 border-gray-300 rounded-lg">
                        <h1 className="font-bold text-4xl">{appointments.length}</h1>
                        <p className="text-sm text-gray-600">Agendamentos</p>
                    </div>

                    <div className="border p-3 border-gray-300 rounded-lg">
                        <h1 className="font-bold text-4xl">{proximo}</h1>
                        <p className="text-sm text-gray-600">Próximo</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="font-bold">Serviços</h2>

                <div className="py-3 flex flex-wrap gap-2">
                    {serviceCounts.size === 0 ? (
                        <p className="text-sm text-gray-400">Nenhum serviço agendado neste dia.</p>
                    ) : (
                        Array.from(serviceCounts.entries()).map(([servico, count]) => {
                            const style = getServiceStyle(servico);
                            return (
                                <div key={servico} className={`${style.bg} py-1 px-2 rounded-2xl`}>
                                    <h3 className={`text-sm ${style.text}`}>
                                        {style.emoji} {servico} ({count})
                                    </h3>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
