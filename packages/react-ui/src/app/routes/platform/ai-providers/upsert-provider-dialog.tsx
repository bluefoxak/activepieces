import { typeboxResolver } from '@hookform/resolvers/typebox';
import { useMutation } from '@tanstack/react-query';
import { t } from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { INTERNAL_ERROR_TOAST, useToast } from '@/components/ui/use-toast';
import { aiProviderApi } from '@/features/platform-admin-panel/lib/ai-provider-api';
import { AiProviderConfig, AuthHeader } from '@activepieces/shared';
import { Type } from '@sinclair/typebox';

type UpsertAIProviderDialogProps = {
  provider: Omit<AiProviderConfig, "id"> & { id?: string };
  children: React.ReactNode;
  onSave: () => void;
  auth: AuthHeader;
};

export const UpsertAIProviderDialog = ({
  children,
  onSave,
  provider,
  auth
}: UpsertAIProviderDialogProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<AiProviderConfig>({
    resolver: typeboxResolver(AiProviderConfig),
    defaultValues: provider,
  });

  const formState = form.watch()

  const newHeaderForm = useForm({
    resolver: typeboxResolver(Type.Object({
      apiKey: Type.String({ minLength: 1 }),
    })),
  })

  const [isNewHeaderFormOpen, setIsNewHeaderFormOpen] = useState(false);

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['upsert-proxy-config'],
    mutationFn: () => aiProviderApi.upsert(form.getValues()),
    onSuccess: () => {
      form.reset();
      setOpen(false);
      onSave();
    },
    onError: () => {
      toast(INTERNAL_ERROR_TOAST);
      form.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{provider.id ? t('Update AI Provider') : t('Enable AI Provider')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="grid space-y-4" onSubmit={(e) => e.preventDefault()}>
            <FormField
              name="baseUrl"
              render={({ field }) => (
                <FormItem className="grid space-y-2" itemType='url'>
                  <Label htmlFor="baseUrl">{t('Base URL')}</Label>
                  <Input
                    {...field}
                    required
                    type="url"
                    id="baseUrl"
                    placeholder={t('Base URL')}
                    className="rounded-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name={`config.defaultHeaders.${auth.name}`}
              render={({ field }) => (
                <FormItem className="grid space-y-3">
                  <Label htmlFor={`config.defaultHeaders.${auth.name}`}>{t('API Key')}</Label>
                  <div className='flex gap-2 items-center justify-center'>
                    <Input
                      autoFocus
                      {...field}
                      required
                      id={`config.defaultHeaders.${auth.name}`}
                      placeholder={t('sk_************************')}
                      className="rounded-sm"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form?.formState?.errors?.root?.serverError && (
              <FormMessage>
                {form.formState.errors.root.serverError.message}
              </FormMessage>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button
            variant={'outline'}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(false);
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            disabled={isPending || !form.formState.isValid}
            loading={isPending}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              mutate();
            }}
          >
            {t('Save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
