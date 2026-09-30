import Image from 'next/image'

const servicos = [
    {
        id: 1,
        title: 'Clareamento Dental',
        desc: 'Dentes mais brancos com segurança e tecnologia LED.',
        price: 'A partir de R$ 800',
        image: '/clareamento.jpg'
    },
    {
        id: 2,
        title: 'Limpeza Profissional',
        desc: 'Profilaxia completa para saúde bucal perfeita..',
        price: 'R$ 250',
        image: '/limpeza.jpg'
    },
    {
        id: 3,
        title: 'Restauração',
        desc: 'Restaurações estéticas em resina de alta qualidade.',
        price: 'A partir de R$ 200',
        image: '/restauracao.jpg'
    },
    {
        id: 4,
        title: 'Ortodontia',
        desc: 'Aparelhos fixos, móveis e alinhadores invisíveis.',
        price: 'A partir de R$ 350/mês',
        image: '/aparelhoDental.jpg'
    },
    {
        id: 5,
        title: 'Implantes',
        desc: 'Implantes dentários com tecnologia de ponta.',
        price: 'A partir de R$ 3.500',
        image: '/implantes.jpg'
    },
    {
        id: 6,
        title: 'Lentes de Contato',
        desc: 'Lentes de porcelana para um sorriso perfeito.',
        price: 'A partir de R$ 1.500/und',
        image: '/lentes.jpg'
    }
]


export default function Servicos() {
    return (
        <section className="py-16 px-6 md:px-12 bg-[#e6fff3]" id='servicos'>

            {/* Título */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <p className='text-center font-bold uppercase text-[var(--cor-secundaria)]' >Nossos Serviços</p>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 w-max-xl mx-auto">
                    Tratamentos para cada necessidade
                </h1>
                <p className="text-gray-500 w-max-xl mx-auto">
                    Oferecemos uma ampla gama de serviços odontológicos com os melhores profissionais.
                </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">

                {servicos.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
                    >
                        {/* IMAGEM */}
                        <div className="relative w-full h-48 overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition duration-700 group-hover:scale-110"
                            />
                        </div>

                        {/* CONTEÚDO */}
                        <div className="p-6 flex flex-col gap-3 ">
                            <h2 className="text-xl font-bold w-full">
                                {item.title}
                            </h2>

                            <p className="text-gray-500 min-h-[60px]">
                                {item.desc}
                            </p>

                            <p className="text-[var(--cor-primaria)] font-bold">
                                {item.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}