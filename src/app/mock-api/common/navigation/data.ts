/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        // subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.project',
                title: 'Dashboards',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/dashboards/project',
            }
        ],
    },
    {
        id: 'apps',
        title: 'Applications',
        // subtitle: 'Custom made application designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'apps.property',
                title: 'Biens immobiliers',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/apps/properties',
            },
            {
                id: 'apps.devices',
                title: 'Appareils',
                type: 'basic',
                icon: 'heroicons_outline:cpu-chip',
                link: '/apps/devices',
            },
            {
                id: 'apps.staff',
                title: 'Staff',
                type: 'basic',
                icon: 'heroicons_outline:shield-check',
                link: '/apps/users',
            },
            {
                id: 'apps.guests',
                title: 'Visiteurs',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/apps/guests',
            },
            {
                id: 'apps.settings',
                title: 'Paramètres',
                type: 'basic',
                icon: 'heroicons_outline:cog-6-tooth',
                link: '/apps/settings',
            }
        ],
    },
];

export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        type: 'group',
        icon: 'heroicons_outline:squares-2x2',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'group',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        type: 'group',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Misc',
        type: 'group',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
