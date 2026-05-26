<template>
  <div class="app-shell" :class="{ 'sidebar-open': sidebarOpen, 'sidebar-collapsed': sidebarCollapsed }">

    <!-- Mobile sidebar backdrop -->
    <div class="sidebar-backdrop" @click="sidebarOpen = false"></div>

    <!-- Mobile toggle button -->
    <button class="sb-toggle" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle sidebar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <!-- Sidebar -->
    <aside class="sidebar">

      <!-- Brand + Collapse toggle -->
      <div class="sb-header">
        <div class="sb-brand">
          <div class="sb-brand-logo">CC</div>
          <div class="sb-brand-text">
            <div class="sb-brand-name">{{ t('nav.companyName') }}</div>
            <div class="sb-brand-sub">{{ t('nav.subtitle') }}</div>
          </div>
        </div>
        <button
          class="sb-collapse-btn"
          @click="sidebarCollapsed = !sidebarCollapsed"
          :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline v-if="!sidebarCollapsed" points="15 18 9 12 15 6"/>
            <polyline v-else points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="sb-nav">
        <router-link to="/" class="sb-nav-item" :class="{ active: $route.path === '/' }" @click="sidebarOpen = false" data-label="Overview">
          <svg class="sb-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span class="sb-nav-label">{{ t('nav.overview') }}</span>
        </router-link>

        <router-link to="/inventory" class="sb-nav-item" :class="{ active: $route.path === '/inventory' }" @click="sidebarOpen = false" data-label="Inventory">
          <svg class="sb-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          <span class="sb-nav-label">{{ t('nav.inventory') }}</span>
        </router-link>

        <router-link to="/orders" class="sb-nav-item" :class="{ active: $route.path === '/orders' }" @click="sidebarOpen = false" data-label="Orders">
          <svg class="sb-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          <span class="sb-nav-label">{{ t('nav.orders') }}</span>
        </router-link>

        <router-link to="/spending" class="sb-nav-item" :class="{ active: $route.path === '/spending' }" @click="sidebarOpen = false" data-label="Finance">
          <svg class="sb-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
          </svg>
          <span class="sb-nav-label">{{ t('nav.finance') }}</span>
        </router-link>

        <router-link to="/demand" class="sb-nav-item" :class="{ active: $route.path === '/demand' }" @click="sidebarOpen = false" data-label="Demand Forecast">
          <svg class="sb-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>
          <span class="sb-nav-label">{{ t('nav.demandForecast') }}</span>
        </router-link>

        <router-link to="/reports" class="sb-nav-item" :class="{ active: $route.path === '/reports' }" @click="sidebarOpen = false" data-label="Reports">
          <svg class="sb-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>
          </svg>
          <span class="sb-nav-label">Reports</span>
        </router-link>
      </nav>

      <!-- Footer: LanguageSwitcher + ProfileMenu -->
      <div class="sb-footer">
        <LanguageSwitcher />
        <ProfileMenu
          @show-profile-details="showProfileDetails = true"
          @show-tasks="showTasks = true"
        />
      </div>
    </aside>

    <!-- Main content -->
    <div class="main-wrapper">
      <!-- Filter bar sticky strip -->
      <div class="top-bar">
        <FilterBar />
      </div>

      <!-- Page content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>

    <!-- Modals (portal-style, unchanged) -->
    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />
    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    const sidebarOpen = ref(false)
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])

    // Collapsed state — persisted to localStorage
    const sidebarCollapsed = ref(localStorage.getItem('sb-collapsed') === 'true')
    watch(sidebarCollapsed, val => localStorage.setItem('sb-collapsed', String(val)))

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(loadTasks)

    return {
      t,
      sidebarOpen,
      sidebarCollapsed,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask
    }
  }
}
</script>

<style>
/* ─── Reset ──────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

/* ─── Design tokens ───────────────────────────────────── */
:root {
  --bg-page: #f8fafc;
  --bg-sidebar: #0f172a;
  --bg-surface: #ffffff;
  --bg-surface-hover: #f8fafc;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --sidebar-text: #cbd5e1;
  --sidebar-muted: #4b5563;
  --sidebar-hover: rgba(255,255,255,0.07);
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --accent-tint: #eff6ff;
  --accent-tint-text: #1d4ed8;
  --accent-border: #bfdbfe;
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.25rem; --space-6: 1.5rem; --space-8: 2rem;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 14px; --radius-pill: 100px;
  --shadow-sm: 0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.04);
  /* Sidebar collapse animation variables */
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  --sidebar-transition: 0.22s ease;
}

/* ─── App shell ───────────────────────────────────────── */
.app-shell {
  display: flex;
  min-height: 100vh;
}

/* ─── Sidebar ─────────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-width);
  min-height: 100vh;
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  flex-shrink: 0;
  border-right: 1px solid rgba(255,255,255,0.05);
  overflow: hidden;
  z-index: 100;
  transition: width var(--sidebar-transition);
}

.sb-header {
  padding: 1.125rem 0.875rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 64px;
}

/* ─── Brand layout ────────────────────────────────────── */
.sb-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
  flex: 1;
  min-width: 0;
}

.sb-brand-logo {
  width: 32px;
  height: 32px;
  background: rgba(59,130,246,0.25);
  border: 1px solid rgba(59,130,246,0.4);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.688rem;
  font-weight: 800;
  color: #93c5fd;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.sb-brand-text {
  overflow: hidden;
  transition: opacity var(--sidebar-transition), max-width var(--sidebar-transition);
  white-space: nowrap;
}

.sb-brand-name {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.sb-brand-sub {
  font-size: 0.688rem;
  color: var(--sidebar-muted);
  margin-top: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

/* ─── Collapse toggle button ──────────────────────────── */
.sb-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-sm);
  color: var(--sidebar-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s, opacity var(--sidebar-transition);
}
.sb-collapse-btn:hover {
  background: var(--sidebar-hover);
  color: #f1f5f9;
}

/* ─── Nav ─────────────────────────────────────────────── */
.sb-nav {
  flex: 1;
  padding: 0.875rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.sb-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.575rem 0.75rem;
  border-radius: var(--radius-sm);
  color: var(--sidebar-text);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease, padding var(--sidebar-transition), gap var(--sidebar-transition);
  cursor: pointer;
  white-space: nowrap;
}

.sb-nav-item:hover {
  background: var(--sidebar-hover);
  color: #f1f5f9;
}

.sb-nav-item.active {
  background: rgba(59,130,246,0.18);
  color: #93c5fd;
  font-weight: 600;
}

.sb-nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.9;
}

/* Nav label span — hidden when collapsed */
.sb-nav-label {
  overflow: hidden;
  white-space: nowrap;
  transition: opacity var(--sidebar-transition), max-width var(--sidebar-transition);
  max-width: 160px;
  opacity: 1;
}

/* ─── Footer ──────────────────────────────────────────── */
.sb-footer {
  padding: 0.875rem 0.75rem 1rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.sb-footer-text {
  overflow: hidden;
  white-space: nowrap;
  transition: opacity var(--sidebar-transition), max-width var(--sidebar-transition);
  max-width: 160px;
  opacity: 1;
}

/* ─── Main wrapper ────────────────────────────────────── */
.main-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-page);
}

.top-bar {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: var(--shadow-sm);
}

.page-content {
  flex: 1;
  padding: 1.75rem;
}

/* ─── Cards ───────────────────────────────────────────── */
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease;
  margin-bottom: 1.25rem;
}
.card:hover { box-shadow: var(--shadow-md); }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.015em;
}

/* ─── Stat cards ──────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease;
}
.stat-card:hover { box-shadow: var(--shadow-md); }

.stat-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.stat-card.warning .stat-value { color: #ea580c; }
.stat-card.success .stat-value { color: #16a34a; }
.stat-card.danger  .stat-value { color: #dc2626; }
.stat-card.info    .stat-value { color: var(--accent); }

/* ─── Page header ─────────────────────────────────────── */
.page-header { margin-bottom: 1.5rem; }
.page-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 0.25rem;
}
.page-header p { color: var(--text-secondary); font-size: 0.875rem; }

/* ─── Tables ──────────────────────────────────────────── */
.table-container { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead { background: var(--bg-page); }
th {
  text-align: left;
  padding: 0.5rem 0.875rem;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
td {
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 0.875rem;
}
tbody tr { transition: background 0.12s ease; }
tbody tr:hover td { background: var(--bg-surface-hover); }
tbody tr:last-child td { border-bottom: none; }

/* ─── Badges ──────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.badge.success    { background: #dcfce7; color: #15803d; }
.badge.warning    { background: #fef3c7; color: #92400e; }
.badge.danger     { background: #fee2e2; color: #991b1b; }
.badge.info       { background: var(--accent-tint); color: var(--accent-tint-text); }
.badge.increasing { background: #dcfce7; color: #15803d; }
.badge.decreasing { background: #fee2e2; color: #991b1b; }
.badge.stable     { background: #e0e7ff; color: #3730a3; }
.badge.high       { background: #fee2e2; color: #991b1b; }
.badge.medium     { background: #fef3c7; color: #92400e; }
.badge.low        { background: var(--accent-tint); color: var(--accent-tint-text); }

/* ─── Buttons ─────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
  text-decoration: none;
}
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: var(--accent-hover); }
.btn-secondary {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
.btn-secondary:hover { background: var(--bg-surface-hover); }

/* ─── Feedback states ─────────────────────────────────── */
.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}
.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  margin: 1rem 0;
}

/* ─── Collapsed sidebar state ─────────────────────────── */
.sidebar-collapsed .sidebar {
  width: var(--sidebar-collapsed-width);
  /* overflow: visible allows tooltips to escape the sidebar bounds */
  overflow: visible;
}

.sidebar-collapsed .sb-brand-text {
  opacity: 0;
  max-width: 0;
  overflow: hidden;
}

.sidebar-collapsed .sb-header {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 0.5rem;
}

.sidebar-collapsed .sb-brand {
  justify-content: center;
}

/* Keep collapse button visible and centred when collapsed so user can re-expand */
.sidebar-collapsed .sb-collapse-btn {
  display: flex;
  opacity: 1;
}

.sidebar-collapsed .sb-nav {
  padding: 0.875rem 0.5rem;
  align-items: center;
}

.sidebar-collapsed .sb-nav-item {
  justify-content: center;
  padding: 0.575rem 0;
  gap: 0;
  /* Position context for tooltip pseudo-element */
  position: relative;
}

.sidebar-collapsed .sb-nav-label {
  max-width: 0;
  opacity: 0;
}

.sidebar-collapsed .sb-footer {
  flex-direction: column;
  align-items: center;
  padding: 0.875rem 0 1rem;
  gap: 0.5rem;
}

.sidebar-collapsed .sb-footer-text {
  max-width: 0;
  opacity: 0;
}

/* ─── CSS-only tooltips on nav items when collapsed ───── */
.sidebar-collapsed .sb-nav-item::after {
  content: attr(data-label);
  position: absolute;
  left: calc(var(--sidebar-collapsed-width) - 4px);
  top: 50%;
  transform: translateY(-50%);
  background: #1e293b;
  color: #f1f5f9;
  font-size: 0.813rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255,255,255,0.1);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 300;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.sidebar-collapsed .sb-nav-item:hover::after {
  opacity: 1;
}

/* ─── Mobile toggle button ────────────────────────────── */
.sb-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 201;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.5rem;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}
.sidebar-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 99;
}

/* ─── Mobile responsive ───────────────────────────────── */
@media (max-width: 768px) {
  .sb-toggle { display: flex; }
  /* Collapse toggle is a desktop-only feature */
  .sb-collapse-btn { display: none !important; }

  .sidebar {
    position: fixed;
    left: -240px;
    top: 0;
    height: 100vh;
    /* Override any collapsed state — always full width on mobile */
    width: 240px !important;
    transition: left 0.25s ease;
    z-index: 200;
    overflow-y: auto;
  }
  .app-shell.sidebar-open .sidebar { left: 0; }
  .app-shell.sidebar-open .sidebar-backdrop { display: block; }

  .main-wrapper { padding-left: 0; }
  .page-content { padding: 1.25rem 1rem; }
}
</style>
