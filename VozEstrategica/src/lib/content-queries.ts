import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Speaker = Tables<"speakers">;
export type EventRow = Tables<"events">;
export type Book = Tables<"books">;
export type GalleryImage = Tables<"media_gallery_images">;

export type BookFormato = "fisico" | "digital";

export type SpeakerRef = Pick<Speaker, "slug" | "nombre">;
export type EventWithSpeaker = EventRow & { speaker: SpeakerRef | null };
export type BookWithAuthor = Book & { autor: SpeakerRef | null };

export async function getSpeakers(): Promise<Speaker[]> {
  const { data, error } = await supabase
    .from("speakers")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getSpeaker(slug: string): Promise<Speaker | null> {
  const { data, error } = await supabase
    .from("speakers")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getEvents(): Promise<EventWithSpeaker[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*, speaker:speakers(slug,nombre)")
    .order("fecha", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as EventWithSpeaker[];
}

export async function eventsForSpeakerId(speakerId: string): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("speaker_id", speakerId)
    .order("fecha", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getBooks(): Promise<BookWithAuthor[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*, autor:speakers!autor_speaker_id(slug,nombre)")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as BookWithAuthor[];
}

export async function booksForSpeakerId(speakerId: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("autor_speaker_id", speakerId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getGallery(galleryKey: string): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from("media_gallery_images")
    .select("*")
    .eq("gallery_key", galleryKey)
    .order("orden", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Para landing pages con fotos de rol fijo (ver slot_key en la migración). */
export function gallerySlotMap(images: GalleryImage[]): Record<string, GalleryImage> {
  return Object.fromEntries(
    images.filter((i) => i.slot_key).map((i) => [i.slot_key as string, i]),
  );
}

export function tematicasDe(speakers: Speaker[]): string[] {
  return Array.from(new Set(speakers.flatMap((s) => s.tematicas))).sort();
}
