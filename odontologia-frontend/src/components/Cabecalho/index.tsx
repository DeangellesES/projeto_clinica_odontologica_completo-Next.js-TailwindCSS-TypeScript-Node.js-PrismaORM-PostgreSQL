"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Cabecalho() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-4 bg-white/60 backdrop-blur-md">
                <h1 className="flex items-center font-bold text-xl">
                    <Image
                        src="/dente.png"
                        alt="Logo da Clínica Sorrir"
                        width={40}
                        height={30}
                    />
                    Clínica Sorrir
                </h1>

                {/* Menu Desktop */}
                <nav className="hidden md:flex items-center space-x-8 text-[#666666] text-sm">
                    <a href="#inicio">Início</a>
                    <a href="#servicos">Serviços</a>
                    <a href="#contatos">Contato</a>

                    <Link
                        href="/agendamento"
                        className="bg-[var(--cor-primaria)] hover:bg-[#691111] text-white px-5 py-3 rounded-lg font-bold text-sm"
                    >
                        Agendar
                    </Link>
                </nav>

                {/* Botão Mobile */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden"
                    aria-label="Abrir menu"
                >
                    {menuOpen ? <X size={30} /> : <Menu size={30} />}
                </button>
            </header>

            {/* Menu Mobile */}
            {menuOpen && (
                <nav className="fixed top-[72px] left-0 w-full bg-white shadow-lg flex flex-col items-center gap-6 py-8 md:hidden z-40">
                    <a
                        href="#inicio"
                        onClick={() => setMenuOpen(false)}
                    >
                        Início
                    </a>

                    <a
                        href="#servicos"
                        onClick={() => setMenuOpen(false)}
                    >
                        Serviços
                    </a>

                    <a
                        href="#contatos"    
                        onClick={() => setMenuOpen(false)}
                    >
                        Contato
                    </a>

                    <Link
                        href="/agendamento"
                        className="bg-[var(--cor-primaria)] hover:bg-[#691111] text-white px-5 py-3 rounded-lg font-bold text-sm"
                        onClick={() => setMenuOpen(false)}
                    >
                        Agendar
                    </Link>
                </nav>
            )}
        </>
    );
}