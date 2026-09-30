"use client";

import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import type { Patient } from "@/types/appointment";
import {
    deleteAppointmentsByPatient,
    updateAppointmentsByPatient,
} from "@/lib/api";

interface PacientesProps {
    patients: Patient[];
    loading?: boolean;
    onRefresh?: () => void;
}

interface EditModal {
    open: boolean;
    patient: Patient | null;
}

export default function Pacientes({ patients, loading, onRefresh }: PacientesProps) {
    const [search, setSearch] = useState("");
    const [editModal, setEditModal] = useState<EditModal>({ open: false, patient: null });
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filtered = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.phone.includes(search)
    );

    function openEdit(patient: Patient) {
        setEditName(patient.name);
        setEditPhone(patient.phone);
        setEditModal({ open: true, patient });
    }

    function closeEdit() {
        setEditModal({ open: false, patient: null });
    }

    async function handleSave() {
        if (!editModal.patient) return;
        setSaving(true);
        try {
            await updateAppointmentsByPatient(editModal.patient.appointmentIds, {
                nome: editName.trim(),
                telefone: editPhone.trim(),
            });
            closeEdit();
            onRefresh?.();
        } catch {
            alert("Erro ao salvar alterações. Tente novamente.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(patient: Patient) {
        const confirmed = window.confirm(
            `Deseja excluir todos os agendamentos de "${patient.name}"?`
        );
        if (!confirmed) return;

        setDeletingId(patient.phone);
        try {
            await deleteAppointmentsByPatient(patient.appointmentIds);
            onRefresh?.();
        } catch {
            alert("Erro ao excluir paciente. Tente novamente.");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <section>
            <div className="px-10 py-5 border-b border-gray-300">
                <div className="relative w-[50%]">
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
            </div>
            <div className="p-6 flex flex-col gap-3">
                {loading ? (
                    <p className="text-gray-400 text-center py-8">Carregando pacientes...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                        {search ? "Nenhum paciente encontrado." : "Nenhum paciente cadastrado ainda."}
                    </p>
                ) : (
                    filtered.map((p) => (
                        <div key={`${p.phone}-${p.name}`} className="bg-gray-100 rounded-xl p-4 flex items-center gap-4">
                            <div className="bg-emerald-200 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                                <p className="text-emerald-500">
                                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                </p>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold">{p.name}</p>
                                <p className="text-sm text-gray-500">{p.phone}</p>
                                <p className="text-xs text-gray-500">
                                    Última visita: {format(p.lastVisit, "dd/MM/yyyy")}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEdit(p)}
                                    className="p-2 rounded-lg hover:bg-emerald-100 text-emerald-600 cursor-pointer transition-colors"
                                    title="Editar paciente"
                                >
                                    {/* <FaEdit size={16} /> */}
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(p)}
                                    disabled={deletingId === p.phone}
                                    className="p-2 rounded-lg hover:bg-red-100 text-red-500 cursor-pointer transition-colors disabled:opacity-50"
                                    title="Excluir paciente"
                                >
                                    {/* <FaTrash size={16} /> */}
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {editModal.open && editModal.patient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="font-bold text-lg mb-4">Editar Paciente</h2>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Nome</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="border border-gray-300 w-full py-2 px-3 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Telefone</label>
                                <input
                                    type="text"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    className="border border-gray-300 w-full py-2 px-3 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={closeEdit}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !editName.trim() || !editPhone.trim()}
                                className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 cursor-pointer transition-colors disabled:opacity-50"
                            >
                                {saving ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
