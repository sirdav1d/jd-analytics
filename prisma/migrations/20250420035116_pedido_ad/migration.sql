-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "data_pedido" TIMESTAMP(3) NOT NULL,
    "data_aprovacao" TIMESTAMP(3) NOT NULL,
    "cancelada" BOOLEAN NOT NULL,
    "faturado" BOOLEAN NOT NULL,
    "codigo_pedido" TEXT NOT NULL,
    "codigo_produto" TEXT NOT NULL,
    "setor" TEXT NOT NULL,
    "produto" TEXT NOT NULL,
    "preco_unitario" DECIMAL(12,2) NOT NULL,
    "quantidade" DECIMAL(12,2) NOT NULL,
    "valor_total" DECIMAL(12,2) NOT NULL,
    "cliente" TEXT NOT NULL,
    "vendedor" TEXT NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);
