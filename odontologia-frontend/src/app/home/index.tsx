import dynamic from "next/dynamic";
import Cabecalho from "@/components/Cabecalho";
import Topo from "@/components/Topo";

const Servicos = dynamic(() => import("@/components/Servicos"));
const Perguntas = dynamic(() => import("@/components/Perguntas"));
const Contato = dynamic(() => import("@/components/Contato"));
const Rodape = dynamic(() => import("@/components/Rodape"));

export default function Principal() {
    return (
        <>
            <Cabecalho/>
            <Topo/>
            <Servicos/>
            <Perguntas/>
            <Contato/>
            <Rodape/>
        </>
    )
}