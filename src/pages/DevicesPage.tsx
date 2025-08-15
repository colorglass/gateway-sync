import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeviceCard } from "@/components/DeviceCard";
import { Plus, Search } from "lucide-react";

// 模拟设备数据
const mockDevices = [
  {
    id: "GW001",
    name: "工厂A-网关1",
    status: "online" as const,
    lastSeen: "2分钟前",
    sensorsCount: 12,
    mqttConnections: 2,
    dataRate: "1.2KB/s",
    location: "生产车间A区",
  },
  {
    id: "GW002", 
    name: "工厂A-网关2",
    status: "warning" as const,
    lastSeen: "15分钟前",
    sensorsCount: 8,
    mqttConnections: 1,
    dataRate: "0.8KB/s",
    location: "生产车间B区",
  },
  {
    id: "GW003",
    name: "工厂B-网关1",
    status: "offline" as const,
    lastSeen: "2小时前",
    sensorsCount: 15,
    mqttConnections: 0,
    dataRate: "0KB/s",
    location: "仓储区",
  },
  {
    id: "GW004",
    name: "工厂B-网关2",
    status: "online" as const,
    lastSeen: "刚刚",
    sensorsCount: 20,
    mqttConnections: 3,
    dataRate: "2.1KB/s",
    location: "包装车间",
  },
];

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [devices] = useState(mockDevices);

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineCount = devices.filter(d => d.status === "online").length;
  const offlineCount = devices.filter(d => d.status === "offline").length;
  const warningCount = devices.filter(d => d.status === "warning").length;

  const handleConfigure = (deviceId: string) => {
    console.log(`Configure device: ${deviceId}`);
    // 跳转到配置页面
  };

  const handleMonitor = (deviceId: string) => {
    console.log(`Monitor device: ${deviceId}`);
    // 跳转到监控页面
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题和操作 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">设备管理</h1>
            <p className="text-muted-foreground mt-1">管理您的IoT网关设备</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            添加设备
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总设备数</p>
                <p className="text-2xl font-bold text-foreground">{devices.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">在线设备</p>
                <p className="text-2xl font-bold text-status-online">{onlineCount}</p>
              </div>
              <div className="w-12 h-12 bg-status-online/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">告警设备</p>
                <p className="text-2xl font-bold text-status-warning">{warningCount}</p>
              </div>
              <div className="w-12 h-12 bg-status-warning/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">离线设备</p>
                <p className="text-2xl font-bold text-status-offline">{offlineCount}</p>
              </div>
              <div className="w-12 h-12 bg-status-offline/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">❌</span>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="搜索设备名称或ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 设备网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onConfigure={handleConfigure}
              onMonitor={handleMonitor}
            />
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">未找到匹配的设备</p>
          </div>
        )}
      </div>
    </div>
  );
}