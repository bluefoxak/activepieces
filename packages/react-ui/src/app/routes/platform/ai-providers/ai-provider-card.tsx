import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { t } from "i18next";
import { UpsertAIProviderDialog } from "./upsert-provider-dialog";
import { Button } from "@/components/ui/button";
import { AiProviderConfig, AuthHeader } from "@activepieces/shared";
import { platformHooks } from "@/hooks/platform-hooks";
import { Edit, Pencil, Trash } from "lucide-react";

type AIProviderCardProps = {
    providerName: string;
    provider?: AiProviderConfig;
    logoUrl: string;
    label: string;
    defaultBaseUrl?: string;
    onDelete: () => void;
    onSave: () => void;
    isDeleting: boolean;
    auth: AuthHeader;
};

const AIProviderCard = ({
    provider,
    logoUrl,
    providerName,
    label,
    defaultBaseUrl,
    onDelete,
    isDeleting,
    onSave,
    auth
}: AIProviderCardProps) => {
    const { platform } = platformHooks.useCurrentPlatform();
    const config: Omit<AiProviderConfig, "id"> & { id?: string } = provider ?? {
        baseUrl: defaultBaseUrl ?? '',
        provider: providerName,
        config: {
            defaultHeaders: {}
        },
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        platformId: platform.id
    }
    return (
        <Card className="w-full px-4 py-4">
            <div className="flex w-full gap-2 justify-center items-center">
                <div className="flex flex-col gap-2 text-center mr-2">
                    <img src={logoUrl}
                        alt="icon"
                        width={32}
                        height={32}
                    />
                </div>
                <div className="flex flex-grow flex-col">
                    <div className="text-lg">{label}</div>
                    <div className="text-sm text-muted-foreground">
                        {t('Configure credentials for {providerName} AI provider.', { providerName: label })}
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center gap-1">
                    <UpsertAIProviderDialog auth={auth} provider={config} onSave={onSave}>
                        <Button variant={provider ? 'ghost' : "basic"} size={'sm'} >{provider ? <Pencil className="size-4" /> : t('Enable')}</Button>
                    </UpsertAIProviderDialog>
                    {provider && (
                        <div className="gap-2 flex">
                            <Button variant={'ghost'} size={'sm'} onClick={onDelete} loading={isDeleting} disabled={isDeleting}>
                                <Trash className="size-4 text-destructive" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

AIProviderCard.displayName = 'AIProviderCard'
export { AIProviderCard };
