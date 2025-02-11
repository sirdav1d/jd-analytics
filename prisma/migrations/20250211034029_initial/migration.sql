-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "googleAccessToken" TEXT,
    "googleRefreshToken" TEXT,
    "googleUserId" TEXT,
    "googleScopes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardMarketing" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sessoes" INTEGER NOT NULL,
    "usuarios" INTEGER NOT NULL,
    "taxaRejeicao" DOUBLE PRECISION NOT NULL,
    "taxaConversaoSite" DOUBLE PRECISION NOT NULL,
    "taxaAbandonoCarrinho" DOUBLE PRECISION NOT NULL,
    "impressoes" INTEGER NOT NULL,
    "cliques" INTEGER NOT NULL,
    "ctr" DOUBLE PRECISION NOT NULL,
    "cpc" DECIMAL(65,30) NOT NULL,
    "conversoes" INTEGER NOT NULL,
    "custoPorConversao" DECIMAL(65,30) NOT NULL,
    "roas" DOUBLE PRECISION NOT NULL,
    "custoPorLead" DECIMAL(65,30) NOT NULL,
    "faturamentoTotal" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardMarketing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trafego" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,

    CONSTRAINT "Trafego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanalTrafego" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "taxaConversao" DOUBLE PRECISION NOT NULL,
    "cpa" DECIMAL(65,30) NOT NULL,
    "roi" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CanalTrafego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnuncioCTR" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ctr" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AnuncioCTR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnuncioConversao" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "conversoes" INTEGER NOT NULL,

    CONSTRAINT "AnuncioConversao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PalavraChave" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "palavra" TEXT NOT NULL,
    "ctr" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PalavraChave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardComercial" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "receitaTotal" DECIMAL(65,30) NOT NULL,
    "ticketMedio" DECIMAL(65,30) NOT NULL,
    "crescimentoReceita" DOUBLE PRECISION NOT NULL,
    "novosClientes" INTEGER NOT NULL,
    "taxaRetencaoClientes" DOUBLE PRECISION NOT NULL,
    "clv" DECIMAL(65,30) NOT NULL,
    "volumeReparos" INTEGER NOT NULL,
    "taxaReincidenciaReparos" DOUBLE PRECISION NOT NULL,
    "receitaReparosVsVendas" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardComercial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceitaCategoria" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "receita" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ReceitaCategoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceitaMetodoPagamento" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "metodoPagamento" TEXT NOT NULL,
    "receita" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ReceitaMetodoPagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientesRecorrentesVsUnicos" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "tipoCliente" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "ClientesRecorrentesVsUnicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoRank" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "produto" TEXT NOT NULL,
    "vendas" INTEGER NOT NULL,

    CONSTRAINT "ProdutoRank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardMarketing_organizationId_key" ON "DashboardMarketing"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardComercial_organizationId_key" ON "DashboardComercial"("organizationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardMarketing" ADD CONSTRAINT "DashboardMarketing_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trafego" ADD CONSTRAINT "Trafego_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "DashboardMarketing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanalTrafego" ADD CONSTRAINT "CanalTrafego_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "DashboardMarketing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnuncioCTR" ADD CONSTRAINT "AnuncioCTR_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "DashboardMarketing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnuncioConversao" ADD CONSTRAINT "AnuncioConversao_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "DashboardMarketing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PalavraChave" ADD CONSTRAINT "PalavraChave_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "DashboardMarketing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardComercial" ADD CONSTRAINT "DashboardComercial_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceitaCategoria" ADD CONSTRAINT "ReceitaCategoria_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "DashboardComercial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceitaMetodoPagamento" ADD CONSTRAINT "ReceitaMetodoPagamento_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "DashboardComercial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientesRecorrentesVsUnicos" ADD CONSTRAINT "ClientesRecorrentesVsUnicos_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "DashboardComercial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoRank" ADD CONSTRAINT "ProdutoRank_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "DashboardComercial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
