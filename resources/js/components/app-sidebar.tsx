import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Folder, 
    LayoutGrid, 
    CreditCard, 
    TrendingUp, 
    TrendingDown, 
    ArrowRightLeft,
    Grid3X3,
    Tags,
    PiggyBank,
    BarChart3,
    Calendar,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Accounts',
        href: '/accounts',
        icon: CreditCard,
    },
];

const transactionNavItems: NavItem[] = [
    {
        title: 'Income',
        href: '/income',
        icon: TrendingUp,
    },
    {
        title: 'Outcome',
        href: '/outcome',
        icon: TrendingDown,
    },
    {
        title: 'Transfer',
        href: '/transfer',
        icon: ArrowRightLeft,
    },
];

const managementNavItems: NavItem[] = [
    {
        title: 'Categories',
        href: '/categories',
        icon: Grid3X3,
    },
    {
        title: 'Tags',
        href: '/tags',
        icon: Tags,
    },
    {
        title: 'Budgets',
        href: '/budgets',
        icon: PiggyBank,
    },
];

const insightNavItems: NavItem[] = [
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Planned Payments',
        href: '/planned-payments',
        icon: Calendar,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
                
                <div className="px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Transaction
                    </p>
                </div>
                <NavMain items={transactionNavItems} />
                
                <div className="px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Management
                    </p>
                </div>
                <NavMain items={managementNavItems} />
                
                <div className="px-3 py-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Insights
                    </p>
                </div>
                <NavMain items={insightNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}