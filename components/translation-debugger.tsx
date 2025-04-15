'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { validateTranslations } from '@/lib/translation-validator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bug } from 'lucide-react';

export function TranslationDebugger() {
  const { language, t } = useLanguage();
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const runValidation = async () => {
    const result = await validateTranslations();
    setValidationResult(result);
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full h-10 w-10"
          aria-label={t('debugger.title')}
        >
          <Bug className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('debugger.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {t('debugger.currentLanguage')}
              </p>
              <p className="text-2xl font-bold">{language}</p>
            </div>
            <Button onClick={runValidation}>
              {t('debugger.validateTranslations')}
            </Button>
          </div>

          {validationResult && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                  {t('debugger.validationResults')}
                </h3>
                <Badge
                  variant={validationResult.isValid ? 'default' : 'destructive'}
                >
                  {validationResult.isValid
                    ? t('debugger.valid')
                    : t('debugger.invalid')}
                </Badge>
              </div>

              {validationResult.errors.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-destructive">
                    {t('debugger.errors')}
                  </h4>
                  <ScrollArea className="h-24 w-full rounded-md border p-2">
                    <ul className="list-disc pl-4 text-sm text-destructive">
                      {validationResult.errors.map(
                        (error: string, index: number) => (
                          <li key={index}>{error}</li>
                        )
                      )}
                    </ul>
                  </ScrollArea>
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-yellow-500">
                    {t('debugger.warnings')}
                  </h4>
                  <ScrollArea className="h-24 w-full rounded-md border p-2">
                    <ul className="list-disc pl-4 text-sm text-yellow-500">
                      {validationResult.warnings.map(
                        (warning: string, index: number) => (
                          <li key={index}>{warning}</li>
                        )
                      )}
                    </ul>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {t('debugger.translationExamples')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md border p-2">
                <p className="text-xs text-muted-foreground">common.home</p>
                <p className="font-medium">{t('common.home')}</p>
              </div>
              <div className="rounded-md border p-2">
                <p className="text-xs text-muted-foreground">home.hero.title</p>
                <p className="font-medium">
                  {t('home.hero.title', { name: 'Daniel Ochi' })}
                </p>
              </div>
              <div className="rounded-md border p-2">
                <p className="text-xs text-muted-foreground">
                  home.hero.subtitle
                </p>
                <p className="font-medium">{t('home.hero.subtitle')}</p>
              </div>
              <div className="rounded-md border p-2">
                <p className="text-xs text-muted-foreground">
                  home.services.title
                </p>
                <p className="font-medium">{t('home.services.title')}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
