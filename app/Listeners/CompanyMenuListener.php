<?php

namespace App\Listeners;

use App\Events\CompanyMenuEvent;

class CompanyMenuListener
{
    /**
     * Handle the event.
     */
    public function handle(CompanyMenuEvent $event) : void
    {
        $module = 'Base';
        $menu   = $event->menu;
        $menu->add([
            'category'   => 'Dashboard',
            'title'      => __('Dashboard'),
            'icon'       => 'home',
            'name'       => 'dashboard',
            'parent'     => null,
            'order'      => 1,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => '',
            'module'     => $module,
            'permission' => '',
        ]);
        $menu->add([
            'category'   => 'Dashboard',
            'title'      => __('CRM Dashboard'),
            'icon'       => '',
            'name'       => 'crm-dashboard',
            'parent'     => 'dashboard',
            'order'      => 3,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'lead.dashboard',
            'module'     => $module,
            'permission' => 'crm dashboard manage',
        ]);

        $menu->add([
            'category'   => 'User',
            'title'      => __('User'),
            'icon'       => 'users',
            'name'       => 'user-management',
            'parent'     => null,
            'order'      => 30,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => '',
            'module'     => $module,
            'permission' => 'user manage',
        ]);
        $menu->add([
            'category'   => 'User',
            'title'      => __('User'),
            'icon'       => '',
            'name'       => 'user',
            'parent'     => 'user-management',
            'order'      => 30,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'users.index',
            'module'     => $module,
            'permission' => 'user manage',
        ]);
        $menu->add([
            'category'   => 'User',
            'title'      => __('Role'),
            'icon'       => '',
            'name'       => 'role',
            'parent'     => 'user-management',
            'order'      => 30,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'roles.index',
            'module'     => $module,
            'permission' => 'roles manage',
        ]);

        $menu->add([
            'category'   => 'Finance',
            'title'      => __('Proposal'),
            'icon'       => 'replace',
            'name'       => 'proposal',
            'parent'     => null,
            'order'      => 150,
            'ignore_if'  => [],
            'depend_on'  => ['Account', 'Taskly'],
            'route'      => 'proposal.index',
            'module'     => $module,
            'permission' => 'proposal manage',
        ]);
        $menu->add([
            'category'   => 'Finance',
            'title'      => __('Estimations'),
            'icon'       => 'calculator',
            'name'       => 'estimations',
            'parent'     => null,
            'order'      => 200,
            'ignore_if'  => [],
            'depend_on'  => ['Taskly'],
            'route'      => 'estimations.index',
            'module'     => $module,
            'permission' => 'estimation manage',
        ]);
        $menu->add([
            'category'   => 'Finance',
            'title'      => __('Invoice'),
            'icon'       => 'file-invoice',
            'name'       => 'invoice',
            'parent'     => null,
            'order'      => 200,
            'ignore_if'  => [],
            'depend_on'  => ['Account', 'Taskly'],
            'route'      => 'invoice.index',
            'module'     => $module,
            'permission' => 'invoice manage',
        ]);

        // $menu->add([
        //     'category'   => 'Finance',
        //     'title'      => __('Purchases'),
        //     'icon'       => 'shopping-cart',
        //     'name'       => 'purchases',
        //     'parent'     => null,
        //     'order'      => 250,
        //     'ignore_if'  => [],
        //     'depend_on'  => ['Account', 'Taskly'],
        //     'route'      => '',
        //     'module'     => $module,
        //     'permission' => 'purchase manage',
        // ]);
        // $menu->add([
        //     'category'   => 'Finance',
        //     'title'      => __('Purchase'),
        //     'icon'       => '',
        //     'name'       => 'purchase',
        //     'parent'     => 'purchases',
        //     'order'      => 10,
        //     'ignore_if'  => [],
        //     'depend_on'  => ['Account', 'Taskly'],
        //     'route'      => 'purchases.index',
        //     'module'     => $module,
        //     'permission' => 'purchase manage',
        // ]);

        // $menu->add([
        //     'category'   => 'Finance',
        //     'title'      => __('Warehouse'),
        //     'icon'       => '',
        //     'name'       => 'warehouse',
        //     'parent'     => 'purchases',
        //     'order'      => 15,
        //     'ignore_if'  => [],
        //     'depend_on'  => ['Account', 'Taskly'],
        //     'route'      => 'warehouses.index',
        //     'module'     => $module,
        //     'permission' => 'warehouse manage',
        // ]);

        // $menu->add([
        //     'category'   => 'Finance',
        //     'title'      => __('Transfer'),
        //     'icon'       => '',
        //     'name'       => 'transfer',
        //     'parent'     => 'purchases',
        //     'order'      => 20,
        //     'ignore_if'  => [],
        //     'depend_on'  => [],
        //     'route'      => 'warehouses-transfer.index',
        //     'module'     => $module,
        //     'permission' => 'warehouse manage',
        // ]);

        // $menu->add([
        //     'category'   => 'Finance',
        //     'title'      => __('Report'),
        //     'icon'       => '',
        //     'name'       => 'reports',
        //     'parent'     => 'purchases',
        //     'order'      => 25,
        //     'ignore_if'  => [],
        //     'depend_on'  => ['Account', 'Taskly'],
        //     'route'      => '',
        //     'module'     => $module,
        //     'permission' => 'report purchase',
        // ]);

        // $menu->add([
        //     'category'   => 'Finance',
        //     'title'      => __('Purchase Daily/Monthly Report'),
        //     'icon'       => '',
        //     'name'       => 'purchase-monthly',
        //     'parent'     => 'reports',
        //     'order'      => 10,
        //     'ignore_if'  => [],
        //     'depend_on'  => [],
        //     'route'      => 'reports.daily.purchase',
        //     'module'     => $module,
        //     'permission' => 'report purchase',
        // ]);

        // $menu->add([
        //     'category'   => 'Finance',
        //     'title'      => __('Warehouse Report'),
        //     'icon'       => '',
        //     'name'       => 'warehouse-report',
        //     'parent'     => 'reports',
        //     'order'      => 20,
        //     'ignore_if'  => [],
        //     'depend_on'  => [],
        //     'route'      => 'reports.warehouse',
        //     'module'     => $module,
        //     'permission' => 'report warehouse',
        // ]);

        $menu->add([
            'category'   => 'Communication',
            'title'      => __('Templates'),
            'icon'       => 'bell',
            'name'       => 'templates',
            'parent'     => null,
            'order'      => 1400,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => '',
            'module'     => $module,
            'permission' => 'templates manage',
        ]);

        $menu->add([
            'category'   => 'Communication',
            'title'      => __('Smart Blocks'),
            'icon'       => '',
            'name'       => 'smart-blocks',
            'parent'     => 'templates',
            'order'      => 10,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'smart-templates.index',
            'module'     => $module,
            'permission' => 'templates manage',
        ]);
        $menu->add([
            'category'   => 'Communication',
            'title'      => __('Smart Block Promts'),
            'icon'       => '',
            'name'       => 'smart-block-promts',
            'parent'     => 'templates',
            'order'      => 20,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'ai-templates.index',
            'module'     => $module,
            'permission' => 'templates manage',
        ]);
        $menu->add([
            'category'   => 'Communication',
            'title'      => __('General Templates'),
            'icon'       => '',
            'name'       => 'general-templates',
            'parent'     => 'templates',
            'order'      => 30,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'general-templates.index',
            'module'     => $module,
            'permission' => 'templates manage',
        ]);
        // $menu->add([
        //     'category'   => 'Communication',
        //     'title'      => __('Messenger'),
        //     'icon'       => 'brand-hipchat',
        //     'name'       => 'messenger',
        //     'parent'     => '',
        //     'order'      => 1500,
        //     'ignore_if'  => [],
        //     'depend_on'  => [],
        //     'route'      => 'chatify',
        //     'module'     => $module,
        //     'permission' => 'user chat manage',
        // ]);
        $menu->add([
            'category'   => 'Settings',
            'title'      => __('Helpdesk'),
            'icon'       => 'headphones',
            'name'       => 'helpdesk',
            'parent'     => null,
            'order'      => 1900,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'helpdesk.index',
            'module'     => $module,
            'permission' => 'helpdesk ticket manage',
        ]);
        $menu->add([
            'category'   => 'Settings',
            'title'      => __('Settings'),
            'icon'       => 'settings',
            'name'       => 'settings',
            'parent'     => null,
            'order'      => 2000,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => '',
            'module'     => $module,
            'permission' => 'setting manage',
        ]);
        $menu->add([
            'category'   => 'Settings',
            'title'      => __('System Settings'),
            'icon'       => '',
            'name'       => 'system-settings',
            'parent'     => 'settings',
            'order'      => 10,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'settings.index',
            'module'     => $module,
            'permission' => 'setting manage',
        ]);
        $menu->add([
            'category'   => 'Settings',
            'title'      => __('Setup Subscription Plan'),
            'icon'       => '',
            'name'       => 'setup-subscription-plan',
            'parent'     => 'settings',
            'order'      => 20,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'plans.index',
            'module'     => $module,
            'permission' => 'plan manage',
        ]);
        $menu->add([
            'category'   => 'Settings',
            'title'      => __('Referral Program'),
            'icon'       => '',
            'name'       => 'referral-program',
            'parent'     => 'settings',
            'order'      => 25,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'referral-program.company',
            'module'     => $module,
            'permission' => 'referral program manage',
        ]);
        $menu->add([
            'category'   => 'Settings',
            'title'      => __('Order'),
            'icon'       => '',
            'name'       => 'order',
            'parent'     => 'settings',
            'order'      => 30,
            'ignore_if'  => [],
            'depend_on'  => [],
            'route'      => 'plan.order.index',
            'module'     => $module,
            'permission' => 'plan orders',
        ]);
    }
}