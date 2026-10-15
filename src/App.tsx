import { useState } from 'react';
import { TopHeader } from './components/TopHeader';
import { SubHeader, TopTabItem } from './components/SubHeader';
import { IconSidebar } from './components/IconSidebar';
import { TreeSidebar } from './components/TreeSidebar';
import { TimelineBar } from './components/TimelineBar';
import { TopologyCanvas } from './components/TopologyCanvas';
import { MetricAnalysisDrawer } from './components/MetricAnalysisDrawer';
import { CompareConfigModal, CompareConfig } from './components/CompareConfigModal';
import { PeriodicCompareDrawer, DrillDownParams } from './components/PeriodicCompareDrawer';
import { SmartTraceView } from './components/SmartTraceView';

export default function App() {
  // Top navigation tabs
  const [topTabs, setTopTabs] = useState<TopTabItem[]>([
    { id: 'topology', label: '应用拓扑', isCloseable: false },
  ]);
  const [activeTopTabId, setActiveTopTabId] = useState('topology');

  // Metric Analysis Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNodeName, setSelectedNodeName] = useState('交换机1');

  // Compare feature states
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);
  const [compareConfig, setCompareConfig] = useState<CompareConfig>({
    baseTime: '2026-10-15 10:12 ~ 2026-10-15 10:27',
    comparePeriodType: 'yesterday',
    compareTime: '2026-10-14 10:12 ~ 2026-10-14 10:27',
    selectedMetrics: ['流量', '响应时间-服务器', '网络时延', '建连失败率'],
    selectedNodes: ['交换机', '交换机1'],
  });

  // Drill-down parameters for SmartTrace (智溯)
  const [drillDownParams, setDrillDownParams] = useState<DrillDownParams>({
    timeRange: '2026-10-15 10:17 ~ 2026-10-15 10:20',
    nodeName: '交换机',
  });

  const handleOpenMetricAnalysis = (nodeName: string) => {
    setSelectedNodeName(nodeName);
    setIsDrawerOpen(true);
  };

  const handleCloseMetricAnalysis = () => {
    setIsDrawerOpen(false);
  };

  const handleOpenCompare = () => {
    setIsCompareModalOpen(true);
  };

  const handleConfirmCompare = (config: CompareConfig) => {
    setCompareConfig(config);
    setIsCompareModalOpen(false);
    setIsCompareDrawerOpen(true);
  };

  const handleReconfigureCompare = () => {
    setIsCompareModalOpen(true);
  };

  // Handle drill-down from brush selection in PeriodicCompareDrawer
  const handleDrillDown = (params: DrillDownParams) => {
    setDrillDownParams(params);
    setIsCompareDrawerOpen(false);

    // Open/switch to 流量分析 tab
    const traceTabExists = topTabs.some((t) => t.id === 'trace');
    if (!traceTabExists) {
      setTopTabs((prev) => [
        ...prev,
        { id: 'trace', label: '流量分析', isCloseable: true },
      ]);
    }
    setActiveTopTabId('trace');
  };

  const handleCloseTopTab = (tabId: string) => {
    setTopTabs((prev) => prev.filter((t) => t.id !== tabId));
    if (activeTopTabId === tabId) {
      setActiveTopTabId('topology');
    }
  };

  const currentTimeRange =
    activeTopTabId === 'trace'
      ? drillDownParams.timeRange
      : '2026-10-15 09:29  ~  2026-10-15 10:29';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-gray-800 font-sans antialiased">
      {/* 1. Top Global Navigation Header */}
      <TopHeader />

      {/* 2. Sub-Header with Application Topology / Drill-down Tab and Date Time Picker */}
      <SubHeader
        tabs={topTabs}
        activeTabId={activeTopTabId}
        onTabChange={setActiveTopTabId}
        onCloseTab={handleCloseTopTab}
        timeRange={currentTimeRange}
      />

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Leftmost Dark Icon Bar */}
        <IconSidebar />

        {/* View 1: Application Topology Main View */}
        {activeTopTabId === 'topology' && (
          <>
            {/* Left Topology Tree Sidebar */}
            <TreeSidebar />

            {/* Right Topology Viewport Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#F4F6F9] overflow-hidden">
              {/* Top Timeline Bar (Figure 1) */}
              <TimelineBar />

              {/* Topology Canvas with Nodes & Bottom-right Controls */}
              <TopologyCanvas
                onOpenMetricAnalysis={handleOpenMetricAnalysis}
                onOpenCompare={handleOpenCompare}
              />
            </main>
          </>
        )}

        {/* View 2: Drill-down Smart Trace / Traffic Analysis (智溯 / 流量分析页面, Figure 2) */}
        {activeTopTabId === 'trace' && (
          <SmartTraceView
            timeRange={drillDownParams.timeRange}
            nodeName={drillDownParams.nodeName}
          />
        )}
      </div>

      {/* 4. Metric Analysis Drawer (triggered by clicking '指标分析' in node menu) */}
      <MetricAnalysisDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseMetricAnalysis}
        selectedNodeName={selectedNodeName}
      />

      {/* 5. One-click Compare Configuration Modal (一键对比配置弹窗) */}
      <CompareConfigModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onConfirm={handleConfirmCompare}
      />

      {/* 6. Periodic Comparison Drawer (周期对比抽屉式弹窗) */}
      <PeriodicCompareDrawer
        isOpen={isCompareDrawerOpen}
        onClose={() => setIsCompareDrawerOpen(false)}
        config={compareConfig}
        onReconfigure={handleReconfigureCompare}
        onDrillDown={handleDrillDown}
      />
    </div>
  );
}
