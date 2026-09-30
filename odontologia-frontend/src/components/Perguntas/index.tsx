'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react';

const perguntas = [
    {
        id: 1,
        title: 'Como funciona o agendamento de consultas?',
        desc: 'O agendamento é feito diretamente pelo nosso sistema, onde você pode visualizar os dias e horários disponíveis em tempo real. Basta clicar no botão de agendamento, escolher o serviço desejado, selecionar a data e o horário que melhor se encaixam na sua rotina, e confirmar. Você também receberá um lembrete antes da consulta.'
    },
    {
        id: 2,
        title: 'Quais formas de pagamento são aceitas?',
        desc: 'Aceitamos diversas formas de pagamento: cartões de crédito e débito, PIX, boleto bancário e dinheiro. Também oferecemos parcelamento em até 12x no cartão de crédito para procedimentos de maior valor.'
    },
    {
        id: 3,
        title: 'A clínica atende por convênio?',
        desc: 'Sim! Trabalhamos com os principais convênios odontológicos do mercado. Entre em contato conosco pelo WhatsApp para verificar se o seu convênio é aceito e quais procedimentos estão cobertos.'
    },
    {
        id: 4,
        title: 'Qual a duração média de cada procedimento?',
        desc: 'A duração varia conforme o tratamento. Uma limpeza leva cerca de 40 minutos, clareamento entre 1 a 2 horas, e procedimentos como implantes podem necessitar de múltiplas sessões. Na consulta inicial, o dentista informará o tempo estimado do seu tratamento.'
    },
    {
        id: 5,
        title: 'É necessário fazer uma avaliação antes de iniciar o tratamento?',
        desc: 'Sim, todos os tratamentos começam com uma avaliação clínica completa. Nessa consulta, o profissional analisa sua saúde bucal, solicita exames se necessário, e elabora um plano de tratamento personalizado com valores e prazos.'
    },
    {
        id: 6,
        title: 'A clínica atende emergências?',
        desc: 'Sim, reservamos horários para atendimentos de urgência como dores agudas, fraturas dentárias e outros casos emergenciais. Entre em contato pelo WhatsApp e informaremos o horário disponível mais próximo.'
    }
]

export default function Perguntas() {
    const [openId, setOpenId] = useState<number | null>(null)

    return (
        <section className="my-20 px-6 md:px-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Perguntas Frequentes</h1>
            <p className="text-gray-500 text-center mb-10">Tire suas dúvidas sobre nossos serviços e atendimento</p>

            <div className="max-w-4xl mx-auto flex flex-col gap-4">

                {perguntas.map((item) => (
                    <div
                        key={item.id}
                        className="border border-black/20 rounded-xl p-5 hover:shadow-md transition"
                    >
                        {/* HEADER */}
                        <button
                            onClick={() =>
                                setOpenId(openId === item.id ? null : item.id)
                            }
                            className="w-full flex justify-between items-center text-left cursor-pointer"
                        >
                            <h2 className="font-bold text-lg hover:text-[var(--cor-primaria)]">
                                {item.title}
                            </h2>

                            <ChevronDown
                                className={`transition-transform duration-300 ${openId === item.id ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {/* CONTEÚDO */}
                        <div
                            className={`overflow-hidden transition-all duration-300 ${openId === item.id
                                ? 'max-h-40 mt-3'
                                : 'max-h-0'
                                }`}
                        >
                            <p className="text-gray-500">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}

            </div>

            <p className='text-center mt-10 text-gray-500'>Ainda tem dúvidas? Fale conosco!</p>
            <a href="" className='font-bold py-3 px-4 bg-[var(--cor-primaria)] mt-5 w-fit text-white rounded-3xl mx-auto block hover:bg-[#691111]'
                onClick={(e) => {
                    e.preventDefault();

                    window.open(
                        'https://wa.me/5511999999999',
                        '_blank'
                    );
                }}
            >Falar pelo Whatsapp</a>

        </section >
    )
}