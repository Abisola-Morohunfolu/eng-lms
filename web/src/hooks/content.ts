import { useQueries, useQuery } from '@tanstack/react-query';
import { contentApi } from '../api/client';
import { keys } from './keys';

export function useGetTracks() {
  return useQuery({ queryKey: keys.tracks, queryFn: contentApi.tracks });
}

export function useGetTrackDetails(tracks?: { slug: string }[]) {
  return useQueries({
    queries: (tracks ?? []).map((track) => ({
      queryKey: keys.track(track.slug),
      queryFn: () => contentApi.track(track.slug),
    })),
  });
}

export function useGetModule(slug?: string) {
  return useQuery({
    queryKey: keys.module(slug ?? ''),
    queryFn: () => contentApi.module(slug!),
    enabled: !!slug,
  });
}

export function useGetLesson(slug?: string | null) {
  return useQuery({
    queryKey: keys.lesson(slug ?? ''),
    queryFn: () => contentApi.lesson(slug!),
    enabled: !!slug,
  });
}
