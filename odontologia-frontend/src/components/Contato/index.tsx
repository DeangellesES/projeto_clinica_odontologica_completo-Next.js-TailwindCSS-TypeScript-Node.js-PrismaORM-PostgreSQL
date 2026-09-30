'use client';
import { MapPin, Phone, Mail, Clock4 } from 'lucide-react';

export default function Contato() {
    return (
        <section className=' mb-10' id='contatos'>
            <p className="text-[var(--cor-secundaria)] text-center text-md uppercase font-bold">Contato</p>
            <h1 className="text-center font-bold text-4xl mb-10">Venha nos visitar</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 px-15 ">
                <div className='space-y-4'>
                    <div className='flex items-center gap-5'>
                        <MapPin className='text-[var(--cor-secundaria)] bg-[#98c7b0] w-12 h-12 p-3 rounded-xl' />
                        <div>
                            <h2 className='font-bold '>Endereço</h2>
                            <p className='text-gray-500'>Rua das Flores, 123 — Centro, São Paulo - SP</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <Phone className='text-[var(--cor-secundaria)] bg-[#98c7b0] w-12 h-12 p-3 rounded-xl' />
                        <div>
                            <h2 className='font-bold '>Telefone</h2>
                            <p className='text-gray-500'>(11) 99999-9999</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <Mail className='text-[var(--cor-secundaria)] bg-[#98c7b0] w-12 h-12 p-3 rounded-xl' />
                        <div>
                            <h2 className='font-bold '>E-mail</h2>
                            <p className='text-gray-500'>contato@clinicasorrir.com.br</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 mb-9'>
                        <Clock4 className='text-[var(--cor-secundaria)] bg-[#98c7b0] w-12 h-12 p-3 rounded-xl' />
                        <div>
                            <h2 className='font-bold '>Horário</h2>
                            <p className='text-gray-500'>Seg a Sex: 8h–18h | Sáb: 8h–12h</p>
                        </div>
                    </div>

                    <a href="" className='bg-[var(--cor-secundaria)] hover:bg-[#22b46b] p-4 rounded-xl text-white flex w-fit items-center gap-4'
                        onClick={(e) => {
                            e.preventDefault();

                            window.open(
                                'https://wa.me/5511999999999',
                                '_blank'
                            );
                        }}
                    ><Phone size={20} /> Agendar pelo Whatsapp</a>
                </div>

                <div className="w-full h-[380px] rounded-2xl">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1987217189226!2d-46.65567890843753!3d-23.561305327989796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1774557974123!5m2!1spt-BR!2sbr"
                        className="w-full h-full rounded-2xl border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    ></iframe>
                </div>

            </div>
        </section>
    )
}