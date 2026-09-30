"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { createAppointment, API_BASE_URL } from "@/lib/api";
import axios from "axios";

interface NovoAgendamentoProps {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
    existingPatients: { name: string; phone: string }[];
}

const SERVICOS = [
    "Limpeza",
    "Restauração",
    "Canal",
    "Clareamento",
    "Consulta",
    "Ortodontia",
    "Lente de Contato",
    "Implantes",
    "Outro",
];

const HORARIOS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

interface AxiosErrorResponse {
    response?: {
        data?: {
            error?: string;
        };
    };
}

function isAxiosError(err: unknown): err is AxiosErrorResponse {
    return typeof err === "object" && err !== null && "response" in err;
}

function NovoAgendamentoForm({
    onClose,
    onCreated,
    existingPatients,
}: Omit<NovoAgendamentoProps, "open">) {
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [servico, setServico] = useState(SERVICOS[0]);
    const [dentista, setDentista] = useState("");
    const [data, setData] = useState(format(new Date(), "yyyy-MM-dd"));
    const [hora, setHora] = useState(HORARIOS[0]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);

    useEffect(() => {
        if (!data) return;
        let cancelled = false;
        axios
            .get<{ horariosOcupados: string[] }>(
                `${API_BASE_URL}/appointments/disponibilidade?data=${data}`
            )
            .then((res) => {
                if (!cancelled) setHorariosOcupados(res.data.horariosOcupados);
            })
            .catch(() => {
                if (!cancelled) setHorariosOcupados([]);
            });
        return () => {
            cancelled = true;
        };
    }, [data]);

    function handlePhoneChange(value: string) {
        setTelefone(value);
        const match = existingPatients.find(
            (p) => p.phone.trim() === value.trim()
        );
        if (match) {
            setNome(match.name);
        }
    }

    function handleNomeChange(value: string) {
        setNome(value);
        const match = existingPatients.find(
            (p) => p.name.toLowerCase() === value.toLowerCase()
        );
        if (match) {
            setTelefone(match.phone);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!nome.trim() || !telefone.trim() || !dentista.trim()) {
            setError("Preencha todos os campos obrigatórios.");
            return;
        }

        setSaving(true);
        try {
            await createAppointment({
                nome: nome.trim(),
                telefone: telefone.trim(),
                servico,
                dentista: dentista.trim(),
                data,
                hora,
            });
            onCreated();
            onClose();
        } catch (err: unknown) {
            const msg = isAxiosError(err)
                ? err.response?.data?.error ||
                  "Erro ao criar agendamento. Tente novamente."
                : "Erro ao criar agendamento. Tente novamente.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">Novo Agendamento</h2>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                        Nome do Paciente *
                    </label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => handleNomeChange(e.target.value)}
                        placeholder="Nome completo"
                        className="border border-gray-300 w-full py-2 px-3 rounded-lg"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                        Telefone *
                    </label>
                    <input
                        type="text"
                        value={telefone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="border border-gray-300 w-full py-2 px-3 rounded-lg"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">
                            Serviço *
                        </label>
                        <select
                            value={servico}
                            onChange={(e) => setServico(e.target.value)}
                            className="border border-gray-300 w-full py-2 px-3 rounded-lg"
                        >
                            {SERVICOS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">
                            Dentista *
                        </label>
                        <input
                            type="text"
                            value={dentista}
                            onChange={(e) => setDentista(e.target.value)}
                            placeholder="Ex: Dr. João"
                            className="border border-gray-300 w-full py-2 px-3 rounded-lg"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">
                            Data *
                        </label>
                        <input
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            className="border border-gray-300 w-full py-2 px-3 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">
                            Horário *
                        </label>
                        <select
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            className="border border-gray-300 w-full py-2 px-3 rounded-lg"
                        >
                            {HORARIOS.map((h) => (
                                <option
                                    key={h}
                                    value={h}
                                    disabled={horariosOcupados.includes(h)}
                                >
                                    {h}
                                    {horariosOcupados.includes(h)
                                        ? " (ocupado)"
                                        : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={
                            saving ||
                            !nome.trim() ||
                            !telefone.trim() ||
                            !dentista.trim()
                        }
                        className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 cursor-pointer transition-colors disabled:opacity-50"
                    >
                        {saving ? "Agendando..." : "Agendar"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function NovoAgendamento({
    open,
    onClose,
    onCreated,
    existingPatients,
}: NovoAgendamentoProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <NovoAgendamentoForm
                key={open ? "open" : "closed"}
                onClose={onClose}
                onCreated={onCreated}
                existingPatients={existingPatients}
            />
        </div>
    );
}
