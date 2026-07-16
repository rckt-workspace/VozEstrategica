import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listPedidosLibros, cancelBookOrder } from "@/lib/book-orders.functions";
import { Loader2 } from "lucide-react";

type Pedido = {
  id: string;
  fecha_creacion: string;
  libro: string;
  formato: string;
  cantidad: number;
  total: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  direccion: string | null;
  ciudad: string | null;
  departamento: string | null;
  estado_pago: string;
  bold_order_id: string | null;
};

export const Route = createFileRoute("/admin/pedidos-libros")({
  head: () => ({
    meta: [
      { title: "Admin — Pedidos de libros" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl uppercase">Acceso denegado</h1>
      <p className="mt-4 text-muted-foreground">{error.message}</p>
      <Link to="/" className="mt-6 inline-block underline">Volver al inicio</Link>
    </div>
  ),
  notFoundComponent: () => <div className="p-8">No encontrado</div>,
  component: AdminPedidosPage,
});

function AdminPedidosPage() {
  const list = useServerFn(listPedidosLibros);
  const cancel = useServerFn(cancelBookOrder);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estado, setEstado] = useState<string>("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    list({ data: { estado: estado === "todos" ? undefined : estado } })
      .then((r) => setPedidos(r.pedidos as Pedido[]))
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  const handleCancel = async (id: string) => {
    if (!confirm("¿Seguro que quieres cancelar este pedido?")) return;
    setCancellingId(id);
    try {
      await cancel({ data: { id } });
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al cancelar");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sección</div>
          <h2 className="mt-1 font-display text-2xl uppercase leading-tight md:text-3xl">Pedidos de libros</h2>
        </div>
        <div className="flex gap-2">
          {["todos", "pendiente", "aprobado", "rechazado", "cancelado"].map((e) => (
            <button
              key={e}
              onClick={() => setEstado(e)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
                estado === e ? "bg-foreground text-background" : "bg-foreground/5 hover:bg-foreground/10"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
        </div>
      )}
      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {!loading && !error && pedidos.length === 0 && (
        <p className="text-muted-foreground">No hay pedidos con este filtro.</p>
      )}

      {!loading && pedidos.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-foreground/10">
          <table className="w-full text-sm">
            <thead className="bg-foreground/5 text-left">
              <tr>
                <Th>Fecha</Th>
                <Th>Estado</Th>
                <Th>Libro</Th>
                <Th>Cant.</Th>
                <Th>Total</Th>
                <Th>Comprador</Th>
                <Th>Contacto</Th>
                <Th>Envío</Th>
                <Th>Referencia</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id} className="border-t border-foreground/10 align-top">
                  <Td>{new Date(p.fecha_creacion).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })}</Td>
                  <Td>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                      p.estado_pago === "aprobado" ? "bg-green-100 text-green-800" :
                      p.estado_pago === "rechazado" ? "bg-red-100 text-red-800" :
                      p.estado_pago === "cancelado" ? "bg-gray-200 text-gray-700" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>{p.estado_pago}</span>
                  </Td>
                  <Td className="font-semibold">{p.libro}<div className="text-[10px] uppercase text-muted-foreground">{p.formato}</div></Td>
                  <Td>{p.cantidad}</Td>
                  <Td className="font-semibold">${p.total.toLocaleString("es-CO")}</Td>
                  <Td>{p.nombre_completo}</Td>
                  <Td>
                    <div>{p.email}</div>
                    <div className="text-xs text-muted-foreground">{p.telefono}</div>
                  </Td>
                  <Td>
                    {p.formato === "fisico" ? (
                      <div className="text-xs">
                        {p.direccion}<br />{p.ciudad}, {p.departamento}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Digital</span>
                    )}
                  </Td>
                  <Td className="font-mono text-[10px]">{p.bold_order_id}</Td>
                  <Td>
                    {(p.estado_pago === "pendiente" || p.estado_pago === "rechazado") && (
                      <button
                        onClick={() => handleCancel(p.id)}
                        disabled={cancellingId === p.id}
                        title="Cancelar pedido"
                        className="inline-flex items-center gap-1 rounded-md border border-foreground/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-foreground/5 hover:text-foreground disabled:opacity-50"
                      >
                        {cancellingId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "×"}
                        Cancelar
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{children}</th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-3 py-3 ${className}`}>{children}</td>
);
