"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da oficina
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Em breve
          </CardTitle>
          <CardDescription>
            A página de configurações será implementada na próxima iteração.
            Aqui você poderá configurar dados da oficina, logo, integr WhatsApp,
            e preferências do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground space-y-2">
            <p>Funcionalidades planejadas:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Dados da oficina (nome, CNPJ, endereço, logo)</li>
              <li>Integração com WhatsApp (Z-API / Evolution API)</li>
              <li>Configuração de follow-ups automáticos</li>
              <li>Templates de mensagens</li>
              <li>Backup e exportação de dados</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
