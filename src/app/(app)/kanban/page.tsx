"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useOrcamentos, useUpdateOrcamentoStatus } from "@/hooks";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  type StatusOrcamento,
  type KanbanColumn,
  type Orcamento,
} from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { GripVertical } from "lucide-react";

const KANBAN_COLUMNS: { id: StatusOrcamento; label: string }[] = [
  { id: "contato", label: "Contato" },
  { id: "orcamento_enviado", label: "Enviado" },
  { id: "aguardando_aprovacao", label: "Aguardando" },
  { id: "aprovado", label: "Aprovado" },
  { id: "em_andamento", label: "Em Andamento" },
  { id: "pronto_retirada", label: "Pronto" },
];

function KanbanCard({ orcamento }: { orcamento: Orcamento }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: orcamento.id, data: { orcamento } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Link href={`/orcamentos/${orcamento.id}`}>
        <Card className="mb-2 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {orcamento.cliente?.nome || "Cliente"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {orcamento.veiculo?.marca} {orcamento.veiculo?.modelo}
                </p>
                <p className="text-xs text-muted-foreground">
                  {orcamento.veiculo?.placa}
                </p>
              </div>
              <div
                {...listeners}
                className="cursor-grab p-1 text-muted-foreground hover:text-foreground"
              >
                <GripVertical className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-bold">
                {formatCurrency(orcamento.valor_total)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(orcamento.criado_em)}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

function KanbanColumnComponent({
  column,
  items,
}: {
  column: { id: StatusOrcamento; label: string };
  items: Orcamento[];
}) {
  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm">{column.label}</h3>
        <Badge variant="secondary" className="text-xs">
          {items.length}
        </Badge>
      </div>
      <SortableContext
        items={items.map((o) => o.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 rounded-lg bg-muted/50 p-2 min-h-[200px]">
          {items.map((orcamento) => (
            <KanbanCard key={orcamento.id} orcamento={orcamento} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanPage() {
  const { data: orcamentos, isLoading } = useOrcamentos();
  const updateStatus = useUpdateOrcamentoStatus();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const columns: KanbanColumn[] = useMemo(() => {
    if (!orcamentos) return KANBAN_COLUMNS.map((col) => ({ ...col, items: [] }));
    return KANBAN_COLUMNS.map((col) => ({
      ...col,
      items: orcamentos.filter((o) => o.status === col.id),
    }));
  }, [orcamentos]);

  const activeOrcamento = activeId
    ? orcamentos?.find((o) => o.id === activeId)
    : null;

  function findColumnByOrcamentoId(id: string): StatusOrcamento | undefined {
    for (const col of columns) {
      if (col.items.some((o) => o.id === id)) return col.id;
    }
    return undefined;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeColumn = findColumnByOrcamentoId(active.id as string);

    // Determine target column
    let targetColumn: StatusOrcamento | undefined;

    // Check if dropped on another card
    const overOrcamento = columns
      .flatMap((c) => c.items)
      .find((o) => o.id === over.id);
    if (overOrcamento) {
      targetColumn = findColumnByOrcamentoId(over.id as string);
    } else {
      // Dropped directly on a column
      targetColumn = over.id as StatusOrcamento;
    }

    if (activeColumn && targetColumn && activeColumn !== targetColumn) {
      await updateStatus.mutateAsync({
        id: active.id as string,
        status: targetColumn,
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kanban</h1>
        <p className="text-muted-foreground">
          Arraste os orçamentos entre colunas para atualizar o status
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              items={column.items}
            />
          ))}
        </div>

        <DragOverlay>
          {activeOrcamento ? (
            <Card className="w-[280px] shadow-lg">
              <CardContent className="p-3">
                <p className="font-medium text-sm">
                  {activeOrcamento.cliente?.nome}
                </p>
                <p className="text-sm font-bold">
                  {formatCurrency(activeOrcamento.valor_total)}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
