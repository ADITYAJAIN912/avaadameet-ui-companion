import { Routes, Route } from 'react-router-dom'
import { LayoutProvider } from './context/LayoutContext'
import { MeetingsProvider } from './context/MeetingsContext'
import { ActionItemsProvider } from './context/ActionItemsContext'
import { ActionWorkspaceProvider } from './context/ActionWorkspaceContext'
import { CalendarProvider } from './context/CalendarContext'
import { DashboardInsightsProvider } from './context/DashboardInsightsContext'
import { AiCopilotProvider } from './context/AiCopilotContext'
import { AppLayout } from './components/layout/AppLayout'
import { StartupAnimation } from './components/ui/StartupAnimation'
import { Home } from './pages/Home'
import { Meetings } from './pages/Meetings'
import { ActionItems } from './pages/ActionItems'
import { CalendarPage } from './pages/Calendar'

export default function App() {
  return (
    <LayoutProvider>
      <MeetingsProvider>
        <ActionItemsProvider>
          <ActionWorkspaceProvider>
            <CalendarProvider>
              <DashboardInsightsProvider>
                <AiCopilotProvider>
                  <StartupAnimation />
                  <Routes>
                    <Route element={<AppLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/meetings" element={<Meetings />} />
                      <Route path="/action-items" element={<ActionItems />} />
                    </Route>
                  </Routes>
                </AiCopilotProvider>
              </DashboardInsightsProvider>
            </CalendarProvider>
          </ActionWorkspaceProvider>
        </ActionItemsProvider>
      </MeetingsProvider>
    </LayoutProvider>
  )
}
