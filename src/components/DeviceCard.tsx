import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "./StatusIndicator";
import { Router, Settings, Activity, Wifi } from "lucide-react";

interface DeviceCardProps {
  device: {
    id: string;
    name: string;
    status: "online" | "offline" | "warning";
    lastSeen: string;
    sensorsCount: number;
    mqttConnections: number;
    dataRate: string;
    location?: string;
  };
  onConfigure?: (deviceId: string) => void;
  onMonitor?: (deviceId: string) => void;
}

export function DeviceCard({ device, onConfigure, onMonitor }: DeviceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Router className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">{device.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{device.id}</p>
            </div>
          </div>
          <StatusIndicator status={device.status} size="lg" showLabel />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">传感器数量</span>
            </div>
            <p className="font-medium text-foreground">{device.sensorsCount} 个</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">MQTT连接</span>
            </div>
            <p className="font-medium text-foreground">{device.mqttConnections} 个</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">数据速率</span>
            <Badge variant="secondary" className="text-xs">
              {device.dataRate}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">最后通讯</span>
            <span className="text-foreground">{device.lastSeen}</span>
          </div>
          
          {device.location && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">位置</span>
              <span className="text-foreground">{device.location}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onConfigure?.(device.id)}
          >
            <Settings className="w-4 h-4 mr-1" />
            配置
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onMonitor?.(device.id)}
          >
            <Activity className="w-4 h-4 mr-1" />
            监控
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}