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
import { WorkbenchCompareView } from './components/WorkbenchCompareView';

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
  const [compareModalTitle, setCompareModalTitle] = useState('一键对比配置');
  const [compareInitialNodes, setCompareInitialNodes] = useState<string[]>([
    '交换机1',
  ]);
  const [compareConfig, setCompareConfig] = useState<CompareConfig>({
    baseTime: '2026-10-25 19:39 ~ 2026-10-25 20:39',
    comparePeriodType: 'yesterday',
    compareTime: '2026-10-24 19:39 ~ 2026-10-24 20:39',
    selectedMetrics: ['流量', '响应时间-服务器', '网络时延', '建连失败率'],
    selectedNodes: ['交换机1'],
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

  const handleOpenCompare = (nodeName?: string) => {
    if (nodeName) {
      setCompareInitialNodes([nodeName]);
      setCompareModalTitle('周期对比配置');
    } else {
      setCompareInitialNodes(['交换机1', '交换机2']);
      setCompareModalTitle('一键对比配置');
    }
    setIsCompareModalOpen(true);
  };

  const handleConfirmCompare = (config: CompareConfig) => {
    setCompareConfig(config);
    setIsCompareModalOpen(false);
    setIsCompareDrawerOpen(false);

    // 规则：
    // 点击周期对比，只要是节点选择为1个的时候，展示图2内容（工作台单节点周期对比样式）
    // 如果是多个节点，展示图1内容（工作台多对象对比样式）
    const workbenchTabExists = topTabs.some((t) => t.id === 'workbench');
    if (!workbenchTabExists) {
      setTopTabs((prev) => {
        const hasTrace = prev.some((t) => t.id === 'trace');
        const next = [...prev];
        if (!hasTrace) {
          next.push({ id: 'trace', label: '流量分析', isCloseable: true });
        }
        next.push({ id: 'workbench', label: '工作台', isCloseable: true });
        return next;
      });
    }
    setActiveTopTabId('workbench');
  };

  const handleReconfigureCompare = () => {
    setCompareInitialNodes(compareConfig.selectedNodes);
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
      : activeTopTabId === 'workbench'
      ? compareConfig.baseTime || '2026-10-25 19:39 ~ 2026-10-25 20:39'
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
        <IconSidebar
          activeId={activeTopTabId}
          onSelectNav={(id) => {
            if (id === 'topology') setActiveTopTabId('topology');
            else if (id === 'trace') setActiveTopTabId('trace');
          }}
        />

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

        {/* View 3: Workbench Periodic Compare View (工作台 - 多对象/周期对比页面, Image 1) */}
        {activeTopTabId === 'workbench' && (
          <WorkbenchCompareView
            nodes={compareConfig.selectedNodes}
            nodeName={compareConfig.selectedNodes[0] || '交换机1'}
            baseTime={compareConfig.baseTime}
            compareTime={compareConfig.compareTime}
            selectedMetrics={compareConfig.selectedMetrics}
            initialMode={compareConfig.selectedNodes.length > 1 ? 'multi' : 'single'}
          />
        )}
      </div>

      {/* 4. Metric Analysis Drawer (triggered by clicking '指标分析' in node menu) */}
      <MetricAnalysisDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseMetricAnalysis}
        selectedNodeName={selectedNodeName}
      />

      {/* 5. One-click / Periodic Compare Configuration Modal (对比配置弹窗) */}
      <CompareConfigModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onConfirm={handleConfirmCompare}
        initialNodes={compareInitialNodes}
        title={compareModalTitle}
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
