import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { progressApi } from '../api/client';
import type { ModuleProgress } from '../api/types';
import { keys } from './keys';

export function useGetProgress() {
  return useQuery({ queryKey: keys.progress, queryFn: progressApi.progress });
}

export function useGetModuleProgress(slug?: string) {
  return useQuery({
    queryKey: keys.moduleProgress(slug ?? ''),
    queryFn: () => progressApi.moduleProgress(slug!),
    enabled: !!slug,
  });
}

function useInvalidateProgress() {
  const queryClient = useQueryClient();
  return (slug?: string) => {
    queryClient.invalidateQueries({ queryKey: keys.progress });
    if (slug) {
      queryClient.invalidateQueries({ queryKey: keys.moduleProgress(slug) });
    }
  };
}

export function useCompleteLesson(slug: string) {
  const invalidate = useInvalidateProgress();
  return useMutation({
    mutationFn: progressApi.completeLesson,
    onSuccess: () => {
      invalidate(slug);
      toast.success('Lesson marked complete');
    },
    onError: () => toast.error('Couldn’t mark lesson complete'),
  });
}

export function useToggleChecklistItem(slug: string) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateProgress();
  return useMutation({
    mutationFn: progressApi.toggleChecklistItem,
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: keys.moduleProgress(slug) });
      const previous = queryClient.getQueryData<ModuleProgress>(keys.moduleProgress(slug));
      if (previous) {
        queryClient.setQueryData<ModuleProgress>(keys.moduleProgress(slug), {
          ...previous,
          checkedChecklistItemIds: previous.checkedChecklistItemIds.includes(itemId)
            ? previous.checkedChecklistItemIds.filter((id) => id !== itemId)
            : [...previous.checkedChecklistItemIds, itemId],
        });
      }
      return { previous };
    },
    onError: (_err, _itemId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(keys.moduleProgress(slug), context.previous);
      }
      toast.error('Couldn’t update checklist');
    },
    onSettled: () => invalidate(slug),
  });
}

export function useSubmitQuiz(quizId: string, slug: string) {
  const invalidate = useInvalidateProgress();
  return useMutation({
    mutationFn: (answers: number[]) => progressApi.submitQuiz(quizId, answers),
    onSuccess: (result) => {
      invalidate(slug);
      toast.success(`Quiz submitted — ${result.score}/${result.total}`);
    },
    onError: () => toast.error('Couldn’t submit quiz'),
  });
}
