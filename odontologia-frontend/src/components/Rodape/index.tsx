import Image from "next/image"

export default function Rodape() {
    return (
        <footer className="bg-[#333] px-15">
            <div className="pt-15 pb-10 px-10 flex flex-col md:flex-row items-center justify-between md:items-start gap-6">
                <div className="text-center md:text-left">
                    <h1 className="flex items-center justify-center md:justify-start font-bold text-xl text-white " ><Image
                        src="/dente.png"
                        alt="Minha imagem"
                        width={40}
                        height={30}
                    />Clínica Sorrir</h1>
                    <p className="text-gray-500 mt-3">Cuidando do seu sorriso com carinho.</p>
                </div>
                <div className="flex gap-5">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white cursor-pointer"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white cursor-pointer"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </div>
            </div>
            <div className="border-t-1 border-gray-500 py-10">
                <p className="text-gray-500 text-sm text-center ">© 2026 Clínica Sorrir. Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}