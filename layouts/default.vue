<template>
	<v-app dark>
		<v-navigation-drawer
			v-model="drawer"
			:mini-variant="miniVariant"
			fixed
			app
		>
			<v-list>
				<div
					v-for="(item, i) in items"
					:key="i"
				>
					<v-list-item
						v-if="!item.sublinks"
						:to="item.to"
						router
						exact
					>
						<v-list-item-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title v-text="item.title" />
						</v-list-item-content>
					</v-list-item>
					<v-expansion-panels
						accordion
						flat
						v-else
					>
    					<v-expansion-panel class="expandable-nav">
							<v-expansion-panel-header style="min-height: 48px; font-size: 16px; padding: 12px 16px;">
								<div style="flex: none; margin-right: 32px;">
									<v-icon>{{ item.icon }}</v-icon>
								</div>
								<div class="d-flex">
									<span>{{ item.title }}</span>
								</div>
							</v-expansion-panel-header>
							<v-expansion-panel-content class="expandable-nav-content">
								<v-list style="padding: 0;">
									<v-list-item
										v-for="(sublink, j) in item.sublinks"
										:key="j"
										:to="sublink.to"
										router
										exact
										style="padding-left: 74px"
									>
										<v-list-item-content>
											<v-list-item-title v-text="sublink.title" />
										</v-list-item-content>
									</v-list-item>
								</v-list>
							</v-expansion-panel-content>
    					</v-expansion-panel>
					</v-expansion-panels>
				</div>
			</v-list>
			<div>
				<v-btn
					bottom
					right
					absolute
					small
					icon
					@click.stop="miniVariant = !miniVariant"
				>
					<v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
				</v-btn>
			</div>
		</v-navigation-drawer>

		<v-app-bar
			fixed
			flat
			app
			dense
		>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" class="d-xl-none" />
			<v-toolbar-title v-text="title" />
			<v-spacer />
			<v-btn
				icon
				@click.stop="rightDrawer = !rightDrawer"
			>
				<v-icon>mdi-account-circle</v-icon>
			</v-btn>
		</v-app-bar>

		<v-main>
			<nuxt />
		</v-main>
		<v-navigation-drawer
			v-model="rightDrawer"
			:right="right"
			temporary
			fixed
		>
			<v-list>
				<v-list-item @click.native="right = !right">
					<v-list-item-action>
						<v-icon light>
							mdi-repeat
						</v-icon>
					</v-list-item-action>
					<v-list-item-title>Switch drawer (click me)</v-list-item-title>
				</v-list-item>
				<v-list-item>
					<v-btn
						color="primary"
						class="mr-4"
						@click="signOut"
					>
						Sign Out
					</v-btn>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-footer
			fixed
			app
		>
			<span>&copy; {{ new Date().getFullYear() }}</span>
		</v-footer>
	</v-app>
</template>

<script>
export default {
	data () {
		return {
			drawer: true,
			items: [
				{
					icon: 'mdi-apps',
					title: 'Welcome',
					to: '/'
				},
				{
					icon: 'mdi-form-select',
					title: 'Invoices',
					sublinks: [
						{
							icon: 'mdi-form-select',
							title: 'Invoices',
							to: '/invoices'
						},
						{
							icon: 'mdi-text-box-plus-outline',
							title: 'Create Invoice',
							to: '/invoices/create'
						}
					]
				},
				{
					icon: 'mdi-account-group',
					title: 'Customers',
					to: '/customers'
				},
				{
					icon: 'mdi-bank-transfer',
					title: 'Transactions',
					to: '/transactions'
				},
				{
					icon: 'mdi-chart-bar',
					title: 'Sales Report',
					to: '/reports'
				}
			],
			miniVariant: false,
			right: true,
			rightDrawer: false,
			title: 'Sales'
		}
	},
	methods: {
        signOut: function(err) {
			this.$store.dispatch('auth/signOut')
				.then(() => {
					this.$router.replace({ path: '/login' });
				})
				.catch(err => {
					alert(err.message);
				});
        }
	}
}
</script>

<style>
	.expandable-nav {
		background-color:			transparent !important;
	}
	.expandable-nav-content .v-expansion-panel-content__wrap {
		padding:					0px;
	}

    .handle {
        cursor:                     grab;
    }
    .handle:active {
        cursor:                     grabbing;
    }

	/* For Trnasactions Page, when editing */
	.row-editing {
        background-color: 			rgba(255, 246, 237, 1);
	}
	.row-editing .v-data-table__mobile-row {
        background-color: 			rgba(255, 246, 237, 1);
	}
</style>