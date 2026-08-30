import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createAdminDownloads,
  deleteAdminMedia,
  listAdminMedia,
  triggerAdminDownloads,
  type AdminDownload,
  type AdminMedia,
} from "../../lib/adminApi";
import {
  beginAdminLogin,
  completeAdminLogin,
  hasAdminOAuthCallback,
  logoutAdmin,
  readAdminSession,
  type AdminSession,
} from "../../lib/adminAuth";
import { clearSession } from "../../lib/gallerySession";
import { groupGalleryMedia, type GalleryMediaGroup } from "../../lib/galleryGrouping";
import GalleryViewer from "./GalleryViewer";

interface AdminMediaGroup extends Omit<GalleryMediaGroup, "items"> {
  items: AdminMedia[];
}

interface AdminViewerState {
  group: AdminMediaGroup;
  initialIndex: number;
}

function AdminPreview({ item }: { item: AdminMedia }) {
  if (item.mediaKind === "image") {
    return <img src={item.thumbnailUrl ?? item.mediaUrl} alt="" className="h-full w-full object-cover" loading="lazy" />;
  }
  return (
    <div className="relative h-full w-full bg-black">
      <video src={item.mediaUrl} className="h-full w-full object-cover" preload="metadata" muted playsInline />
      <span className="absolute inset-0 grid place-items-center text-3xl text-white" aria-hidden>▶</span>
    </div>
  );
}

export default function AdminGalleryPage() {
  const [session, setSession] = useState<AdminSession | undefined>(() => readAdminSession());
  const [authStatus, setAuthStatus] = useState<"idle" | "loading" | "error">(
    hasAdminOAuthCallback() ? "loading" : "idle",
  );
  const [authError, setAuthError] = useState("");
  const [items, setItems] = useState<AdminMedia[]>([]);
  const [nextCursor, setNextCursor] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState<"delete" | "download">();
  const [error, setError] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(() => new Set());
  const [activeGroupId, setActiveGroupId] = useState<string>();
  const [viewer, setViewer] = useState<AdminViewerState>();
  const [downloads, setDownloads] = useState<AdminDownload[]>([]);
  const callbackStarted = useRef(false);
  const loadedSessionToken = useRef<string | undefined>(undefined);

  const groups = useMemo(
    () => groupGalleryMedia(items) as AdminMediaGroup[],
    [items],
  );
  const activeGroup = groups.find((group) => group.id === activeGroupId);
  const selectedMediaIds = groups
    .filter((group) => selectedGroups.has(group.id))
    .flatMap((group) => group.items.map((item) => item.id));

  const loadMedia = useCallback(async (activeSession: AdminSession, cursor?: string) => {
    setLoading(true);
    setError("");
    try {
      const page = await listAdminMedia(activeSession, cursor);
      setItems((current) => cursor ? [...current, ...page.items] : page.items);
      setNextCursor(page.nextCursor);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No pudimos cargar los recuerdos.");
      if (!readAdminSession()) setSession(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasAdminOAuthCallback() || callbackStarted.current) return;
    callbackStarted.current = true;
    setAuthStatus("loading");
    void completeAdminLogin()
      .then((newSession) => {
        setSession(newSession);
        setAuthStatus("idle");
      })
      .catch((loginError: unknown) => {
        setAuthStatus("error");
        setAuthError(loginError instanceof Error ? loginError.message : "No pudimos iniciar sesión.");
      });
  }, []);

  useEffect(() => {
    if (!session || loadedSessionToken.current === session.idToken) return;
    clearSession();
    loadedSessionToken.current = session.idToken;
    void loadMedia(session);
    const remaining = Math.max(0, session.expiresAt - Date.now());
    const timeout = window.setTimeout(() => setSession(undefined), Math.min(remaining, 2_147_000_000));
    return () => window.clearTimeout(timeout);
  }, [loadMedia, session]);

  function toggleGroup(groupId: string): void {
    setSelectedGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  async function removeMedia(mediaIds: string[], description: string): Promise<void> {
    if (!session || !mediaIds.length) return;
    if (!window.confirm(`¿Eliminar ${description}? Los originales privados se conservarán.`)) return;
    setOperation("delete");
    setError("");
    try {
      const result = await deleteAdminMedia(session, mediaIds);
      const deleted = new Set(result.deletedMediaIds);
      setItems((current) => current.filter((item) => !deleted.has(item.id)));
      setSelectedGroups(new Set());
      setActiveGroupId(undefined);
      setViewer(undefined);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "No pudimos eliminar la selección.");
      if (!readAdminSession()) setSession(undefined);
    } finally {
      setOperation(undefined);
    }
  }

  async function downloadMedia(mediaIds: string[]): Promise<void> {
    if (!session || !mediaIds.length) return;
    setOperation("download");
    setError("");
    setDownloads([]);
    try {
      const result = await createAdminDownloads(session, mediaIds);
      setDownloads(result.items);
      triggerAdminDownloads(result.items);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "No pudimos preparar las descargas.");
      if (!readAdminSession()) setSession(undefined);
    } finally {
      setOperation(undefined);
    }
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--color-ivory)] px-5 py-16 text-[var(--color-forest)]">
        <section className="paper-surface w-full max-w-md rounded-[12px] border border-black/8 p-7 text-center shadow-[0_25px_70px_rgba(22,28,19,0.14)] sm:p-10">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[var(--color-olive)]">Wedding Memories</p>
          <h1 className="font-heading mt-4 text-5xl font-medium italic leading-none">Administración</h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-[var(--color-forest)]/65">
            Inicia sesión con la única cuenta autorizada para descargar o retirar recuerdos de la galería.
          </p>
          {authError && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-900" role="alert">{authError}</p>}
          <button
            type="button"
            disabled={authStatus === "loading"}
            onClick={() => {
              setAuthStatus("loading");
              setAuthError("");
              void beginAdminLogin().catch((loginError: unknown) => {
                setAuthStatus("error");
                setAuthError(loginError instanceof Error ? loginError.message : "No pudimos abrir Cognito.");
              });
            }}
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--color-forest)] px-6 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-55"
          >
            {authStatus === "loading" ? "Abriendo Cognito…" : "Iniciar sesión con Cognito"}
          </button>
          <a href="#portada" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-olive)]">Volver a la invitación</a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f2] pb-28 text-[var(--color-forest)]">
      <header className="sticky top-0 z-40 border-b border-black/8 bg-[#f4f5f2]/90 px-4 py-3 backdrop-blur-xl [padding-top:max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-olive)]">Panel privado</p>
            <h1 className="truncate text-lg font-semibold">Administrar recuerdos</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => void loadMedia(session)}
              className="min-h-11 rounded-full border border-black/10 bg-white px-4 text-xs font-semibold disabled:opacity-50"
            >
              Actualizar
            </button>
            <button
              type="button"
              onClick={() => logoutAdmin()}
              className="min-h-11 rounded-full bg-[var(--color-forest)] px-4 text-xs font-semibold text-white"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-5 pt-8 sm:px-6">
        <p className="text-xs text-[var(--color-forest)]/55">Sesión: {session.email}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-olive)]">Galería publicada</p>
            <h2 className="font-heading mt-1 text-[clamp(2.7rem,7vw,4.8rem)] font-medium italic leading-[0.9]">Selecciona grupos</h2>
          </div>
          <p className="text-sm text-[var(--color-forest)]/60">{groups.length} {groups.length === 1 ? "grupo" : "grupos"}</p>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-forest)]/62">
          Al eliminar, se borran todas las versiones procesadas y el registro visible. El original privado se conserva.
        </p>
      </section>

      {error && <p className="mx-auto mb-5 max-w-7xl rounded-xl bg-red-50 p-4 text-sm text-red-900" role="alert">{error}</p>}

      {loading && items.length === 0 ? (
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <span key={index} className="aspect-square animate-pulse rounded-2xl bg-black/8" />)}
        </div>
      ) : groups.length === 0 ? (
        <section className="mx-auto grid min-h-[45svh] max-w-md place-items-center px-6 text-center">
          <div><h2 className="text-xl font-semibold">No hay recuerdos publicados</h2><p className="mt-2 text-sm text-black/50">Los nuevos archivos aparecerán aquí cuando estén listos.</p></div>
        </section>
      ) : (
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-4" aria-label="Grupos administrables">
          {groups.map((group) => {
            const selected = selectedGroups.has(group.id);
            return (
              <li key={group.id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${selected ? "border-[var(--color-olive)] ring-2 ring-[var(--color-olive)]/20" : "border-black/8"}`}>
                <div className="relative aspect-square overflow-hidden bg-black/5">
                  <button
                    type="button"
                    aria-label={`Ver grupo ${group.displayName || "sin nombre"} en grande`}
                    onClick={() => setViewer({ group, initialIndex: 0 })}
                    className="block h-full w-full touch-manipulation text-left"
                  >
                    <AdminPreview item={group.items[0]!} />
                  </button>
                  <label className="absolute left-3 top-3 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white/92 shadow-md backdrop-blur">
                    <input type="checkbox" checked={selected} onChange={() => toggleGroup(group.id)} aria-label={`Seleccionar ${group.displayName || "grupo"}`} className="h-5 w-5 accent-[var(--color-olive)]" />
                  </label>
                  {group.items.length > 1 && <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white">{group.items.length}</span>}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold">{group.displayName || "Recuerdo de invitado"}</p>
                  <p className="mt-1 truncate text-xs text-black/45">{group.caption || `${group.items.length} ${group.items.length === 1 ? "archivo" : "archivos"}`}</p>
                  <button type="button" onClick={() => setActiveGroupId(group.id)} className="mt-3 min-h-11 w-full rounded-full border border-black/10 text-xs font-semibold">Administrar grupo</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {nextCursor && <div className="py-8 text-center"><button type="button" disabled={loading} onClick={() => void loadMedia(session, nextCursor)} className="min-h-11 rounded-full border border-black/10 bg-white px-6 text-xs font-semibold disabled:opacity-50">{loading ? "Cargando…" : "Cargar más"}</button></div>}

      {downloads.length > 0 && (
        <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6" aria-label="Descargas preparadas">
          <div className="rounded-2xl border border-black/8 bg-white p-4">
            <div className="flex items-center justify-between gap-4"><h2 className="font-semibold">Descargas preparadas</h2><button type="button" onClick={() => triggerAdminDownloads(downloads)} className="min-h-11 rounded-full bg-[var(--color-forest)] px-4 text-xs font-semibold text-white">Descargar de nuevo</button></div>
            <p className="mt-2 text-xs text-black/50">Si el navegador bloquea descargas múltiples, toca cada archivo:</p>
            <div className="mt-3 flex flex-wrap gap-2">{downloads.map((download) => <a key={download.id} href={download.url} download={download.fileName} className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold">{download.fileName}</a>)}</div>
          </div>
        </section>
      )}

      {selectedGroups.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/94 px-4 py-3 shadow-[0_-14px_35px_rgba(0,0,0,0.12)] backdrop-blur-xl [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <p className="mr-auto text-sm font-semibold">{selectedGroups.size} {selectedGroups.size === 1 ? "grupo" : "grupos"}</p>
            <button type="button" disabled={Boolean(operation)} onClick={() => void downloadMedia(selectedMediaIds)} className="min-h-11 rounded-full border border-black/12 px-4 text-xs font-semibold disabled:opacity-50">{operation === "download" ? "Preparando…" : "Descargar"}</button>
            <button type="button" disabled={Boolean(operation)} onClick={() => void removeMedia(selectedMediaIds, `${selectedGroups.size} ${selectedGroups.size === 1 ? "grupo" : "grupos"}`)} className="min-h-11 rounded-full bg-red-700 px-4 text-xs font-semibold text-white disabled:opacity-50">{operation === "delete" ? "Eliminando…" : "Eliminar"}</button>
          </div>
        </div>
      )}

      {activeGroup && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <button type="button" aria-label="Cerrar detalle" onClick={() => setActiveGroupId(undefined)} className="absolute inset-0" />
          <section role="dialog" aria-modal="true" aria-label="Administrar archivos del grupo" className="relative z-10 max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-[#f4f5f2] p-5 [padding-bottom:max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-3xl sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-olive)]">Grupo</p><h2 className="mt-1 text-2xl font-semibold">{activeGroup.displayName || "Recuerdo de invitado"}</h2><p className="mt-1 text-sm text-black/50">{activeGroup.items.length} {activeGroup.items.length === 1 ? "archivo" : "archivos"}</p></div><button type="button" onClick={() => setActiveGroupId(undefined)} aria-label="Cerrar" className="grid h-11 w-11 place-items-center rounded-full bg-white text-xl">×</button></div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">{activeGroup.items.map((item, index) => <li key={item.id} className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-sm"><button type="button" aria-label={`Ver ${item.originalFileName} en grande`} onClick={() => setViewer({ group: activeGroup, initialIndex: index })} className="h-20 w-20 shrink-0 touch-manipulation overflow-hidden rounded-xl bg-black/5"><AdminPreview item={item} /></button><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.originalFileName}</p><p className="mt-1 text-xs uppercase tracking-wide text-black/40">{item.mediaKind === "image" ? "Imagen" : "Video"}</p><button type="button" disabled={Boolean(operation)} onClick={() => void removeMedia([item.id], `este ${item.mediaKind === "image" ? "archivo" : "video"}`)} className="mt-2 min-h-9 text-xs font-semibold text-red-700 disabled:opacity-50">Eliminar archivo</button></div></li>)}</ul>
            <div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" disabled={Boolean(operation)} onClick={() => void downloadMedia(activeGroup.items.map((item) => item.id))} className="min-h-11 rounded-full border border-black/12 bg-white px-5 text-xs font-semibold disabled:opacity-50">Descargar grupo</button><button type="button" disabled={Boolean(operation)} onClick={() => void removeMedia(activeGroup.items.map((item) => item.id), "todo este grupo")} className="min-h-11 rounded-full bg-red-700 px-5 text-xs font-semibold text-white disabled:opacity-50">Eliminar grupo</button></div>
          </section>
        </div>
      )}

      {viewer && (
        <GalleryViewer
          key={`${viewer.group.id}:${viewer.initialIndex}`}
          group={viewer.group}
          initialIndex={viewer.initialIndex}
          onClose={() => setViewer(undefined)}
        />
      )}
    </main>
  );
}
