import { t } from 'i18next';
import React from 'react';

import { JsonViewer } from '@/components/json-viewer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StepStatusIcon } from '@/features/flow-runs/components/step-status-icon';
import { cn, formatUtils } from '@/lib/utils';
import { StepOutputStatus } from '@activepieces/shared';

import { TestButtonTooltip } from './test-step-tooltip';

type TestSampleDataViewerProps = {
  onRetest: () => void;
  isValid: boolean;
  isSaving: boolean;
  isTesting: boolean;
  sampleData: unknown;
  errorMessage: string | undefined;
  lastTestDate: string | undefined;
  children?: React.ReactNode;
  consoleLogs?: string | null;
};

const TestSampleDataViewer = React.memo(
  ({
    onRetest,
    isValid,
    isSaving,
    isTesting,
    sampleData,
    errorMessage,
    lastTestDate,
    children,
    consoleLogs,
  }: TestSampleDataViewerProps) => {
    return (
      <>
        {!isTesting && children}
        <div className="flex-grow flex flex-col w-full text-start gap-4">
          <div className="flex justify-center items-center">
            <div className="flex flex-col flex-grow gap-1">
              <div className="text-md flex gap-1 items-center">
                {errorMessage ? (
                  <>
                    <StepStatusIcon
                      status={StepOutputStatus.FAILED}
                      size="5"
                    ></StepStatusIcon>
                    <span>{t('Testing Failed')}</span>
                  </>
                ) : (
                  <>
                    <StepStatusIcon
                      status={StepOutputStatus.SUCCEEDED}
                      size="5"
                    ></StepStatusIcon>
                    <span>{t('Tested Successfully')}</span>
                  </>
                )}
              </div>
              <div className="text-muted-foreground text-xs">
                {lastTestDate &&
                  !errorMessage &&
                  formatUtils.formatDate(new Date(lastTestDate))}
              </div>
            </div>
            <TestButtonTooltip disabled={!isValid}>
              <Button
                variant="outline"
                size="sm"
                disabled={!isValid || isSaving}
                keyboardShortcut="G"
                onKeyboardShortcut={onRetest}
                onClick={onRetest}
                loading={isTesting}
              >
                {t('Retest')}
              </Button>
            </TestButtonTooltip>
          </div>

          <Tabs defaultValue="Output">
            <TabsList
              className={cn(
                'grid w-full ',
                consoleLogs ? 'grid-cols-3 w-[375px]' : 'grid-cols-2 w-[250px]',
              )}
            >
              <TabsTrigger value="Input">{t('Input')}</TabsTrigger>
              <TabsTrigger value="Output">{t('Output')}</TabsTrigger>
              {consoleLogs && (
                <TabsTrigger value="Logs">{t('Logs')}</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="Input">
              <JsonViewer
                json={errorMessage ?? {}}
                title={t('Input')}
              ></JsonViewer>
            </TabsContent>
            <TabsContent value="Output">
              <JsonViewer
                json={errorMessage ?? sampleData}
                title={t('Output')}
              ></JsonViewer>
            </TabsContent>
            {consoleLogs && (
              <TabsContent value="Logs">
                <JsonViewer json={consoleLogs} title={t('Logs')}></JsonViewer>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </>
    );
  },
);

TestSampleDataViewer.displayName = 'TestSampleDataViewer';
export { TestSampleDataViewer };
