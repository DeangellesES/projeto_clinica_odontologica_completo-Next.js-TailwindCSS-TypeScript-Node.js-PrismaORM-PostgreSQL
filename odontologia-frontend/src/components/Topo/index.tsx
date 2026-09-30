'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { useState, useEffect } from 'react'

import 'swiper/css'
import 'swiper/css/pagination'

import { ChevronRight, ChevronLeft, Phone } from 'lucide-react';

type Slide = {
    id: number
    image: string
    frase: string
    title: string
    title1: string
    description: string
    primaryButton: string
    secondaryButton: string
}

const slides: Slide[] = [
    {
        id: 1,
        image: '/sorriso.jpg',
        frase: '😁 Transforme seu Sorriso',
        title: 'Seu sorriso merece o',
        title1: 'melhor cuidado',
        description: 'Clareamento, lentes de contato e tratamentos estéticos para um sorriso radiante e confiante.',
        primaryButton: 'Agendar Consulta',
        secondaryButton: 'Ver Serviços',
    },
    {
        id: 2,
        image: '/equipamentos.jpg',
        frase: '✨ Tecnologia de Ponta',
        title: 'Consultório moderno e',
        title1: 'equipado para você',
        description: 'Ambiente acolhedor com equipamentos de última geração para garantir o melhor tratamento odontológico.',
        primaryButton: 'Agendar Consulta',
        secondaryButton: 'Ver Serviços',
    },
    {
        id: 3,
        image: '/equipe.jpg',
        frase: '👨‍⚕️ Equipe especializada',
        title: 'Profissionais dedicados à',
        title1: 'sua saúde bucal',
        description: 'Uma equipe multidisciplinar pronta para cuidar de você e de toda a sua família com excelência.',
        primaryButton: 'Agendar Consulta',
        secondaryButton: 'Ver Serviços',
    },
]

export default function Topo() {
    const [swiperInstance, setSwiperInstance] = useState<any>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="w-full h-screen relative" id='inicio'>
            <Swiper
                modules={[Pagination, Autoplay]}
                onSwiper={setSwiperInstance}
                pagination={{ clickable: true }}
                slidesPerView={1}
                slidesPerGroup={1}
                spaceBetween={0}
                loop={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                className="w-full h-full custom-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* 🔵 Overlay azul */}
                            <div className="absolute inset-0 bg-blue-400/30" />

                            {/* 🔲 Overlay escuro + conteúdo */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 flex items-center">

                                <div className="text-white px-6 md:px-12 max-w-2xl flex flex-col gap-5">

                                    <p className="text-lg md:text-base text-gray-200 bg-blue-400/20 w-fit px-4 py-1 rounded-2xl">
                                        {slide.frase}
                                    </p>

                                    <div>
                                        <h2 className="inline text-3xl md:text-6xl font-bold">
                                            {slide.title}{' '}
                                        </h2>
                                        <h2 className="inline text-3xl md:text-6xl font-bold text-[var(--cor-primaria)]">
                                            {slide.title1}
                                        </h2>
                                    </div>

                                    <p className="text-lg md:text-xl text-gray-200 font-bold">
                                        {slide.description}
                                    </p>

                                    <div className='flex gap-4'>
                                        <a className='flex gap-5 items-center bg-[var(--cor-primaria)] w-fit text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-[#691111] cursor-pointer' onClick={() =>
                                            window.open(
                                                'https://wa.me/5511999999999',
                                                '_blank'
                                            )
                                        }>
                                            <Phone size={15} /> {slide.primaryButton}
                                        </a>
                                        <a href="#servicos" className='bg-blue-400/20 hover:bg-blue-400/30 cursor-pointer pt-2.5 pb-1 px-6 rounded-lg border border-white/30 text-sm'>
                                            {slide.secondaryButton}
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* PREV */}
            <button
                onClick={() => swiperInstance?.slidePrev()}
                className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-white/20 cursor-pointer text-white w-12 h-12 rounded-full flex items-center justify-center transition"
            >
                <ChevronLeft />
            </button>

            {/* NEXT */}
            <button
                onClick={() => swiperInstance?.slideNext()}
                className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-white/20 cursor-pointer text-white w-12 h-12 rounded-full flex items-center justify-center transition"
            >
                <ChevronRight />
            </button>

            {/* estilizacao pagination */}
            <style jsx global>{`
                .custom-swiper .swiper-pagination-bullet {
                @apply w-2.5 h-2.5 bg-white/50 rounded-full transition-all duration-300;
            }
                .custom-swiper .swiper-pagination-bullet-active {
                @apply w-8 h-2.5 bg-[var(--cor-primaria)] opacity-100;
            }
                .custom-swiper .swiper-pagination {
                @apply bottom-6;
            }
            `}
            </style>

        </div>
    )
}