import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT ?? 3333),
  databaseUrl: process.env.DATABASE_URL ?? '',
  // colocar o JTW SECRET correto para funcionar, esta no arquivo .env
  jwtSecret: process.env.JWT_SECRET ?? 'secret_key',
  // colocar palavra chave para login unico no sistema
  inviteCode: process.env.INVITE_CODE ?? 'palavraChaveAcessoUnico',
}
